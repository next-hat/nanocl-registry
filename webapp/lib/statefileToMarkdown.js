const yaml = require("js-yaml")

function tableCell(value, literal = false) {
  const text = String(value)
  if (literal) {
    const encoded = text
      // Comments interrupt GFM autolinks without adding visible characters.
      .replace(/[^\r\n]/gu, (character) => {
        const entity = `&#${character.codePointAt(0)};`
        return /[.:@]/.test(character) ? `<!-- -->${entity}` : entity
      })
      .replace(/\r\n?|\n/g, "<br />")
    return `<code>${encoded}</code>`
  }
  // GFM consumes one escape before a pipe, even inside code spans. Protect the
  // affected spans and leave existing Markdown escapes intact elsewhere.
  const cell = text.replace(/<([A-Za-z][A-Za-z0-9+.-]*:[^<>\s]+)>/g, (match, url) => {
    if (!url.includes("|")) return match
    const label = url.replace(/[\\[\]`*_~]/g, "\\$&")
    return `[${label}](<${url.replace(/\|/g, "%7C")}>)`
  }).replace(
    /<\/?[A-Za-z][A-Za-z0-9-]*(?:[ \t][^>\n]*)?\/?>|(?<![\\`])((?:\\\\)*)(`+)(?!`)([\s\S]*?)(?<!`)\2(?!`)/g,
    (match, escapes, delimiter, content) => {
      if (!delimiter) return match.replace(/\|/g, "&#124;")
      let code = content.replace(/\r\n?|\n/g, " ")
      if (!content.includes("\\|")) return escapes + delimiter + code + delimiter
      if (code.startsWith(" ") && code.endsWith(" ") && /[^ ]/.test(code)) {
        code = code.slice(1, -1)
      }
      return escapes + tableCell(code, true)
    },
  )
  return cell
    .replace(/\\.|\|/g, (match) => match === "|" ? "\\|" : match)
    .replace(/\r\n?|\n/g, "<br />")
}

/**
 * Convert a statefile JSON object and raw YAML text into Markdown documentation
 * @param {Object} statefile - Parsed JSON object of the statefile
 * @param {string} rawYaml - The raw YAML content of the statefile
 * @param {string} source - Optional source name for the statefile
 * @returns {string} - Markdown string
 */
function statefileToMarkdown(statefile, source = "statefile.yaml") {
  // Convert stripped state back to YAML (simply reusing rawYaml here, could use js-yaml if you want)
  const data = yaml.load(statefile.yamlText)
  const metadata = data.Metadata || {}
  const rawYaml = yaml.dump({ ...data, Metadata: undefined })
  let renderLocally = "## Render locally\n\nRender this Statefile and save the result to `Statefile.yml` for review before applying it.\n\n"
  if (data.Args?.length) {
    renderLocally += "Pass any required Statefile arguments after `--`.\n\n"
  }
  renderLocally += `\`\`\`sh\nnanocl state render -s ${source} -o Statefile.yml\n\`\`\`\n\n`
  let markdown = "# Statefile Manual\n\n"
  if (metadata.ManContent) {
    markdown +=
      metadata.ManContent + `\n${renderLocally}## Content\n\`\`\`yaml\n${rawYaml}\n\`\`\`\n`
    return markdown
  }
  const description = metadata.LongAbout || metadata.About
  if (description) {
    markdown += `## Description\n${description}\n\n`
  }
  markdown += `## Synopsis\n\n\`\`\`sh\nnanocl state apply -s ${source} -- [--help] ARGUMENTS\nnanocl state rm -s ${source} -- [--help] ARGUMENTS\n\`\`\`\n\n`
  if (data.Args && data.Args.length > 0) {
    markdown += "## Arguments\n\n| Argument | Type | Description | Default |\n| --- | --- | --- | --- |\n"
    for (const a of data.Args) {
      const status = `${a.Required ? "Required" : "Optional"}${a.Multiple ? " · Multiple values" : ""}`
      const argument = `${tableCell(`--${a.Name}`, true)}<br /><small>${status}</small>`
      const description = a.Description ? tableCell(a.Description) : "—"
      const def = a.Default !== undefined ? tableCell(a.Default, true) : "—"
      markdown += `| ${argument} | ${tableCell(a.Kind, true)} | ${description} | ${def} |\n`
    }
    markdown += "\n"
  }
  markdown += `${renderLocally}## Content\n\`\`\`yaml\n${rawYaml}\n\`\`\`\n`
  return markdown
}

module.exports = {
  statefileToMarkdown,
}
