const fs = require("fs")
const path = require("path")

module.exports.loadManifest = (p = path.resolve(process.cwd(), 'manifestConfig.json')) => {
  return JSON.parse(fs.readFileSync(p, 'utf-8'))
}
