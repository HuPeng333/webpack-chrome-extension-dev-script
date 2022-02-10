const fs = require('fs')
const fsUtils = require('../util/fsUtils')
const path = require('path')
const objectUtils = require('../util/objectUtils')

const pluginName = 'ConsoleLogOnBuildWebpackPlugin';


let manifestTemplate = {
  name: '',
  version: '',
  manifest_version: 3,
  description: '',
  action: {
    default_popup: 'popup/index.html'
  },
  permissions: [],
  content_scripts: [],
  options_ui: {
    page: 'options/index.html'
  }
}

class ConsoleLogOnBuildWebpackPlugin {

  constructor(options = {}) {
    this.popupPath = 'popup'
    this.publicPath = 'public'
    this.optionsPath = 'options'
    if (options.manifestConfig) {
      manifestTemplate = objectUtils.deepCombineObject(manifestTemplate, options.manifestConfig)
    }
    this.manifestConfig = options.manifestConfig ? options.manifestConfig : {}
  }

  apply(compiler) {
    this.loadPackageJson(compiler)
    const BASE_SRC_URL = path.resolve(compiler.context, 'src')

    compiler.hooks.afterEmit.tap(pluginName, (compilation) => {
      try {
        fsUtils.copyDirSync(path.resolve(BASE_SRC_URL, this.popupPath), path.resolve(compiler.outputPath, this.popupPath))
      } catch (e) {
        manifestTemplate.action = ''
      }

      try {
        // public文件夹
        fsUtils.copyDirSync(path.resolve(BASE_SRC_URL, this.publicPath), path.resolve(compiler.outputPath, this.publicPath))
      } catch (e) {
      }

      try {
        // options文件夹
        fsUtils.copyDirSync(path.resolve(BASE_SRC_URL, this.optionsPath), path.resolve(compiler.outputPath, this.optionsPath))
      } catch (e) {
        manifestTemplate.options_ui = ''
      }

      // 多模块配置
      Object.keys(compiler.options.entry).forEach(moduleName => {
        let matches
        if (this.manifestConfig.content_scripts && this.manifestConfig.content_scripts[moduleName]) {
          matches = this.manifestConfig.content_scripts[moduleName]
        } else {
          matches = ['<all_urls>']
          compilation.warnings.push(`content-script '${moduleName}' don't specific the matches in the 'manifestConfig.json', it will use '<all_urls>' instead`)
        }
        manifestTemplate.content_scripts.push({
          matches,
          js: [`content-script/${moduleName}/index.js`],
          css: [`content-script/${moduleName}/index.css`]
        })
      })

      fs.writeFileSync(`${compiler.outputPath}/manifest.json`, JSON.stringify(manifestTemplate))
    })
  }

  loadPackageJson ({context}) {
    const data = JSON.parse(fs.readFileSync(path.resolve(context, 'package.json'), 'utf-8'))
    manifestTemplate.name = data.name
    manifestTemplate.version = data.version
    manifestTemplate.description = data.description
  }
}


module.exports = ConsoleLogOnBuildWebpackPlugin
