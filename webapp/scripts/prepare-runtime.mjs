import * as fs from "node:fs/promises"
import { createRequire } from "node:module"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { isDeepStrictEqual } from "node:util"

const root = fileURLToPath(new URL("../", import.meta.url))
const build = path.join(root, ".next")
const output = path.join(build, "runtime")
const require = createRequire(import.meta.url)
const { nodeFileTrace } = require("next/dist/compiled/@vercel/nft")
const files = new Set()
const omittedBuildDirectories = new Set([
  "build",
  "cache",
  "dev",
  "diagnostics",
  "runtime",
  "standalone",
  "types",
])

function insideRoot(file) {
  const relative = path.relative(root, file)
  if (
    relative === ".." ||
    relative.startsWith(`..${path.sep}`) ||
    path.isAbsolute(relative)
  ) {
    throw new Error(`Runtime file is outside the application: ${file}`)
  }
  return relative
}

function addFile(file) {
  const absolute = path.resolve(file)
  const relative = insideRoot(absolute).split(path.sep).join("/")
  // The registry disables Next's image optimizer, so its native Sharp binaries
  // are unreachable. Keep them automatically if image optimization is enabled.
  if (
    imageOptimizationDisabled &&
    /(?:^|\/)node_modules\/(?:sharp(?:\/|$)|@img\/sharp[^/]*(?:\/|$))/.test(
      relative
    )
  ) {
    return
  }
  // Source maps and type declarations are not needed to execute production code.
  if (!absolute.endsWith(".map") && !absolute.endsWith(".d.ts")) {
    files.add(absolute)
  }
}

async function collectDirectory(directory, isBuild = false) {
  for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name)
    if (
      isBuild &&
      directory === build &&
      (omittedBuildDirectories.has(entry.name) ||
        entry.name === "trace" ||
        entry.name === "trace-build")
    )
      continue

    if (entry.isDirectory()) {
      await collectDirectory(file, isBuild)
    } else if (isBuild && entry.name.endsWith(".nft.json")) {
      const trace = JSON.parse(await fs.readFile(file, "utf8"))
      for (const dependency of trace.files) {
        addFile(path.resolve(directory, dependency))
      }
    } else {
      addFile(file)
    }
  }
}

await fs.access(path.join(build, "BUILD_ID"))
const manifest = JSON.parse(
  await fs.readFile(path.join(build, "required-server-files.json"), "utf8")
)
if (!manifest.config || !Array.isArray(manifest.files)) {
  throw new Error("The Next.js production build manifest is invalid")
}
// Node 24 loads this TypeScript configuration in the builder without SWC.
// Serialize only its public settings, not Next's normalized internal fields.
process.env.NODE_ENV = "production"
const config = require(path.join(root, "next.config.ts")).default
if (!config || typeof config !== "object" || Array.isArray(config)) {
  throw new Error("Runtime packaging requires a Next.js configuration object")
}
const serializedConfig = JSON.stringify(config)
if (!isDeepStrictEqual(config, JSON.parse(serializedConfig))) {
  throw new Error(
    "The Next.js configuration cannot be serialized without changing its values"
  )
}
const imageOptimizationDisabled = manifest.config.images?.unoptimized === true
try {
  await fs.access(output)
  throw new Error(
    "The runtime output already exists; run a fresh production build before packaging"
  )
} catch (error) {
  if (error.code !== "ENOENT") throw error
}

// Next.js does not trace custom servers. Combine its build traces with our own
// Express entry point instead of replacing the server with standalone output.
const customServer = await nodeFileTrace([path.join(root, "server.js")], {
  base: root,
  processCwd: root,
  mixedModules: true,
  ignore: [
    "**/*.map",
    "**/*.d.ts",
    ...(imageOptimizationDisabled
      ? ["**/node_modules/sharp/**", "**/node_modules/@img/sharp*/**"]
      : []),
  ],
})
for (const file of new Set([
  ...customServer.fileList,
  ...customServer.esmFileList,
])) {
  addFile(path.resolve(root, file))
}
for (const file of manifest.files) addFile(path.resolve(root, file))
addFile(path.join(root, "package.json"))
await collectDirectory(build, true)
await collectDirectory(path.join(root, "public"))

// Config loading installs webpack aliases with dynamic require.resolve calls,
// which file tracing cannot discover. Keep these targets available at startup.
await collectDirectory(
  path.join(root, "node_modules/next/dist/compiled/webpack")
)
addFile(require.resolve("next/dist/compiled/@babel/runtime/package.json"))

// Reject external symlink targets before creating any output. Preserve directory
// links with relative runtime targets so builder paths never become runtime links.
const entries = []
for (const file of files) {
  const real = await fs.realpath(file)
  insideRoot(real)
  const link = (await fs.lstat(file)).isSymbolicLink()
  entries.push({
    file,
    real,
    directory: (await fs.stat(file)).isDirectory(),
    link,
  })
}
await fs.mkdir(output)
for (const { file, real, directory, link } of entries.filter(
  (entry) => entry.directory
)) {
  const destination = path.join(output, insideRoot(file))
  if (link) {
    const target = path.join(output, insideRoot(real))
    await fs.mkdir(target, { recursive: true })
    await fs.mkdir(path.dirname(destination), { recursive: true })
    await fs.symlink(
      path.relative(path.dirname(destination), target),
      destination
    )
  } else {
    await fs.mkdir(destination, { recursive: true })
  }
}
for (const { file, directory } of entries) {
  if (directory) continue
  const destination = path.join(output, insideRoot(file))
  await fs.mkdir(path.dirname(destination), { recursive: true })
  await fs.copyFile(file, destination)
}

// The runtime must load the same configuration without TypeScript/SWC tooling.
await fs.writeFile(
  path.join(output, "next.config.js"),
  `module.exports = ${serializedConfig};\n`
)
console.log(`Prepared production runtime with ${entries.length} traced files`)
