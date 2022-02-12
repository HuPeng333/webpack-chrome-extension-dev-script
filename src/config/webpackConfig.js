const webpackConfigTemplate = require('../template/webpackConfigTemplate')
const path = require("path")
const fs = require('fs')
const constant = require("../constant")

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

  let entryMap = {}

  entryMap = Object.assign(entryMap, loadContentScriptEntry())
  entryMap = Object.assign(entryMap, loadBackgroundEntry())

  webpackConfig.entry = entryMap
}

function loadContentScriptEntry() {
  const entryMap = {}
  if (!fs.existsSync(constant.contentScriptEntryFolder())) {
    return entryMap
  }
  const entries = fs.readdirSync(path.resolve(process.cwd(), 'src/content-script'))
  for (let i = 0; i < entries.length; i++) {
    entryMap[entries[i]] = {
      import: path.resolve(process.cwd(), 'src/content-script', entries[i], 'index'),
      filename: 'content-script/[name]/index.js',
      chunkLoading: false
    }
  }
  return entryMap
}
function loadBackgroundEntry() {
  const entryMap = {}
  if (!fs.existsSync(constant.backgroundEntryFolder())) {
    return entryMap
  }
  entryMap.background = {
    import: path.resolve(process.cwd(), 'src/background', 'index'),
    filename: 'background.js',
    chunkLoading: false
  }
  // 多入口有点不太合理
  // const entries = fs.readdirSync(path.resolve(process.cwd(), 'src/background'))
  // for (let i = 0; i < entries.length; i++) {
  //   entryMap[entries[i]] = {
  //     import: path.resolve(process.cwd(), 'src/background', entries[i], 'index'),
  //     filename: 'background/[name]/index.js',
  //     chunkLoading: false
  //   }
  // }
  return entryMap
}
