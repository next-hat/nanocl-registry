const next = require("next");
const express = require("express");
const path = require("path");

// In-memory registry utilities
const registry = require("./lib/registry");

const port = process.env.PORT || 3000;
const dev = process.env.NODE_ENV !== "production";
const basePath = process.argv[2] || process.env.NANOCL_REGISTRY_PATH || "/folder";
const latestVersionArg = process.argv[3] || process.env.NANOCL_LATEST_VERSION || "v0.18";

const app = next({ dev });
const handle = app.getRequestHandler();

registry.initRegistry(basePath, latestVersionArg);

app.prepare().then(() => {
  const server = express();
  // Helper to detect nanocl clients
  function isNanoclClient(req) {
    const ua = String(req.headers["user-agent"] || "").toLowerCase();
    return ua.includes("nanocl");
  }
  server.use("/public", express.static(path.join(__dirname, './public')))
  // Local logo settings can reference any asset in the public directory.
  server.use(express.static(path.join(__dirname, './public'), { index: false, redirect: false }))
  // Keep Next assets and crawler/social routes out of the Statefile rewrites.
  server.use((req, res, next) => {
    if (
      /^\/(?:_next|social|fonts|seo|logos)\//.test(req.path) ||
      ["/robots.txt", "/sitemap.xml", "/manifest.webmanifest", "/favicon.png",
        "/logo3.png", "/icon", "/apple-icon", "/apple-touch-icon.png",
        "/icon-192.png", "/icon-512.png"].includes(req.path)
    ) return handle(req, res);
    next();
  });
  // Home renders the latest version page without redirecting
  server.get("/", (req, res) => {
    const version = registry.getLatestVersion();
    const entry = registry.getVersion(version);
    if (!entry) res.status(404);
    const data = JSON.stringify(entry);
    return handle(req, res, { pathname: `/${version}`, query: { data, home: "1" } });
  });
  // Version main page: /v0.16
  server.get("/:version", (req, res) => {
    const { version } = req.params;
    const entry = registry.getVersion(version);
    if (!entry) res.status(404);
    const data = JSON.stringify(entry);
    return handle(req, res, { pathname: `/${version}`, query: { data } });
  });
  // Tag page: /tag/security -> uses latest version by default
  server.get("/tag/:tag", (req, res) => {
    const { tag } = req.params;
    const version = registry.getLatestVersion();
    const items = registry.getByTag(version, tag);
    if (!items.length) res.status(404);
    const data = JSON.stringify(items);
    return handle(req, res, {
      pathname: `/tag/${tag}`,
      query: { version, data },
    });
  });
  server.get("/:version/:statefile/:statefile_version", (req, res) => {
    res.vary("User-Agent");
    const { version, statefile, statefile_version } = req.params;
    const hooked_version = statefile_version.replace(/\.yaml$/, "").replace(/\.yml$/, "");
    const entry = registry.getStatefileVersion(version, statefile, hooked_version);
    if (isNanoclClient(req)) {
      if (!entry) {
        return res.status(404).json({ msg: "Not found" });
      }
      res.setHeader("Content-Type", "text/yaml; charset=utf-8");
      return res.send(entry.yamlText);
    }
    if (!entry) res.status(404);
    return handle(req, res, {
      pathname: `/${version}/${statefile}`,
      query: { entry: JSON.stringify(entry) },
    });
  });
  // Statefile page or raw YAML depending on User-Agent
  // /v0.16/certbot
  server.get("/:version/:statefile", (req, res) => {
    res.vary("User-Agent");
    const { version, statefile } = req.params;
    const hooked_statefile = statefile.replace(/\.yaml$/, "").replace(/\.yml$/, "");
    const entry = registry.getStatefile(version, hooked_statefile);
    if (isNanoclClient(req)) {
      if (!entry) {
        return res.status(404).json({ msg: "Not found" });
      }
      res.setHeader("Content-Type", "text/yaml; charset=utf-8");
      return res.send(entry.yamlText);
    }
    if (!entry) res.status(404);
    return handle(req, res, {
      pathname: `/${version}/${statefile}`,
      query: { entry: JSON.stringify(entry) },
    });
  });
  // Fallback to Next handler
  server.all("/{*any}", (req, res) => handle(req, res));
  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Nanocl Registry ready on http://localhost:${port}`);
  });
});
