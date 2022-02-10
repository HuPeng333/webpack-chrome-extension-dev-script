const webpackConfigTemplate = require('../template/webpackConfigTemplate')
const path = require("path")
module.exports = () => {
  // 从template读取配置文件
  try {
    const webpackConfigModule = require(path.resolve(process.cwd(), 'webpack-config.js'))
    return webpackConfigModule(webpackConfigTemplate)
  } catch (e) {
    return webpackConfigTemplate
  }
}
