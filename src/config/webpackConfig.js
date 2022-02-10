const webpackConfigTemplate = require('../template/webpackConfigTemplate')
const path = require("path")
const fs = require('fs')

module.exports = () => {
  // 从template读取配置文件
  let webpackConfig
  try {
    const webpackConfigModule = require(path.resolve(process.cwd(), 'webpack-config.js'))
    webpackConfig = webpackConfigModule(webpackConfigTemplate)
  } catch (e) {
    webpackConfig = webpackConfigTemplate
  }
  processEntry(webpackConfig)
  return webpackConfig
}

/**
 * 配置webpack多入口配置
 */
function processEntry(webpackConfig) {
  const entries = fs.readdirSync(path.resolve(process.cwd(), 'src/content-script'))
  const entryMap = {}
  if (entries.length === 0) {
    throw new Error("folder 'content-script' is empty! If you don't use 'content-script' in your extension, this template is useless for you!")
  }
  for (let i = 0; i < entries.length; i++) {
    entryMap[entries[i]] = {
      import: path.resolve(process.cwd(), 'src/content-script', entries[i], 'index'),
      chunkLoading: false
    }
  }
  webpackConfig.entry = entryMap

}
