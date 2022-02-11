const fs = require('fs')
const fsUtils = require('../util/fsUtils')
const path = require('path')
const objectUtils = require('../util/objectUtils')
const manifestTemplate = require('../template/manifestTemplate')

const pluginName = 'ConsoleLogOnBuildWebpackPlugin';



class ConsoleLogOnBuildWebpackPlugin {

  constructor(options = {}) {
    this.popupPath = 'popup'
    this.publicPath = 'public'
    this.optionsPath = 'options'
    if (options.manifestConfig) {
      this.manifestTemplate = objectUtils.deepCombineObject(manifestTemplate, options.manifestConfig)
    }
    this.manifestConfig = options.manifestConfig ? options.manifestConfig : {}
  }

  apply(compiler) {
    loadPackageJson(compiler, this.manifestTemplate)
    const BASE_SRC_URL = path.resolve(compiler.context, 'src')

    compiler.hooks.afterEmit.tap(pluginName, (compilation) => {
      try {
        fsUtils.copyDirSync(path.resolve(BASE_SRC_URL, this.popupPath), path.resolve(compiler.outputPath, this.popupPath))
      } catch (e) {
        this.manifestTemplate.action = ''
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
        this.manifestTemplate.options_ui = ''
      }

      // 多模块配置
      writeManifestJson(this.manifestConfig, this.manifestTemplate,compilation, compiler)
    })

    let isFirst = true
    compiler.hooks.watchRun.tap(pluginName, () => {
      if (!isFirst) {
        console.log('detected file change, preparing hot update!')
      } else {
        isFirst = false
      }
    })
  }


}

/**
 * 加载package.json
 * @param context 传入compiler
 * @param manifestTemplate
 */
function loadPackageJson ({context}, manifestTemplate) {
  const data = JSON.parse(fs.readFileSync(path.resolve(context, 'package.json'), 'utf-8'))
  manifestTemplate.name = data.name
  manifestTemplate.version = data.version
  manifestTemplate.description = data.description
}

/**
 * 生成并保存manifestJson
 * @param manifestConfig 用户外部配置的config
 * @param manifestTemplate 模板
 * @param compilation
 * @param compiler
 */
function writeManifestJson(manifestConfig, manifestTemplate, compilation, compiler) {
  manifestTemplate.content_scripts = []
  Object.keys(compiler.options.entry).forEach(moduleName => {
    let matches
    if (manifestConfig.content_scripts_matches && manifestConfig.content_scripts_matches[moduleName]) {
      matches = manifestConfig.content_scripts_matches[moduleName]
    } else {
      matches = ['<all_urls>']
      compilation.warnings.push(`content-script '${moduleName}' don't specific the matches in the 'manifestConfig.json', it will use '<all_urls>' instead`)
    }
    const hasCss = fs.existsSync(`${compiler.outputPath}/content-script/${moduleName}/index.css`)
    manifestTemplate.content_scripts.push({
      matches,
      js: [`content-script/${moduleName}/index.js`],
      css: hasCss ? [`content-script/${moduleName}/index.css`] : undefined
    })
  })
  // 避免写入配置文件
  manifestTemplate.content_scripts_matches = undefined
  fs.writeFileSync(`${compiler.outputPath}/manifest.json`, JSON.stringify(manifestTemplate))
}


module.exports = ConsoleLogOnBuildWebpackPlugin
