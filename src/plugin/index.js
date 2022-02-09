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
  content_scripts: [
    {
      matches: [],
      js: ['content-script/index.js'],
      css: ['content-script/index.css']
    }
  ],
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
    if (manifestTemplate.content_scripts_matches) {
      if (Array.isArray(manifestTemplate.content_scripts_matches)) {
        manifestTemplate.content_scripts[0].matches = manifestTemplate.content_scripts[0].matches.concat(manifestTemplate.content_scripts_matches)
      } else {
        throw new Error('content_scripts_matches must be a Array')
      }
      manifestTemplate.content_scripts_matches = undefined
    }
    if (manifestTemplate.content_scripts[0].matches.length === 0) {
      console.warn('these is no "content_scripts_matches" property in "manifestConfig.json", so it will use "<all_urls>" instead')
      manifestTemplate.content_scripts[0].matches[0] = '<all_urls>'
    }
  }

  apply(compiler) {
    this.loadPackageJson(compiler)
    const BASE_SRC_URL = path.resolve(compiler.context, 'src')

    compiler.hooks.afterEmit.tap(pluginName, () => {
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
        console.log(e)
      }

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
