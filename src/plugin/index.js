const fs = require('fs')
const fsUtils = require('../util/fsUtils')
const path = require('path')
const objectUtils = require('../util/objectUtils')
const manifestTemplate = require('../template/manifestTemplate')
const constant = require('../constant')
const pluginName = 'ConsoleLogOnBuildWebpackPlugin';



class ConsoleLogOnBuildWebpackPlugin {

  constructor(options = {}) {
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
        fsUtils.copyDirSync(path.resolve(BASE_SRC_URL, constant.popupOutputFolderName), path.resolve(compiler.outputPath, constant.popupOutputFolderName))
      } catch (e) {
        this.manifestTemplate.action = undefined
      }

      try {
        // public文件夹
        fsUtils.copyDirSync(path.resolve(BASE_SRC_URL, constant.publicOutputFolderName), path.resolve(compiler.outputPath, constant.publicOutputFolderName))
      } catch (e) {
      }

      try {
        // options文件夹
        fsUtils.copyDirSync(path.resolve(BASE_SRC_URL, constant.optionsOutputFolderName), path.resolve(compiler.outputPath, constant.optionsOutputFolderName))
      } catch (e) {
        this.manifestTemplate.options_ui = undefined
      }

      // 多模块配置
      loadContentScriptConfig(this.manifestConfig, this.manifestTemplate,compilation, compiler)
      loadBackgroundConfig(this.manifestTemplate, compilation, compiler)
      // 保存配置
      fs.writeFileSync(`${compiler.outputPath}/manifest.json`, JSON.stringify(this.manifestTemplate))
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
function loadContentScriptConfig(manifestConfig, manifestTemplate, compilation, compiler) {
  if (!fs.existsSync(constant.contentScriptOutputPath(compiler))) {
    return
  }
  manifestTemplate.content_scripts = []
  const contentScriptModules = fs.readdirSync(constant.contentScriptOutputPath(compiler))
  contentScriptModules.forEach(moduleName => {
    let matches
    // 获取manifestConfig中的配置
    if (manifestConfig.content_scripts_matches && manifestConfig.content_scripts_matches[moduleName]) {
      matches = manifestConfig.content_scripts_matches[moduleName]
    } else {
      matches = ['<all_urls>']
      compilation.warnings.push(`content-script '${moduleName}' not specific the matches in the 'manifestConfig.json', it will use '<all_urls>' instead`)
    }
    const hasCss = fs.existsSync(`${constant.contentScriptOutputPath(compiler)}/${moduleName}/index.css`)
    manifestTemplate.content_scripts.push({
      matches,
      js: [`${constant.contentScriptOutputFolderName}/${moduleName}/index.js`],
      css: hasCss ? [`${constant.contentScriptOutputFolderName}/${moduleName}/index.css`] : undefined
    })
  })
  // 避免写入配置文件
  manifestTemplate.content_scripts_matches = undefined
}

/**
 * 加载backgroundJs
 * @param manifestTemplate
 * @param compilation
 * @param compiler
 */
function loadBackgroundConfig(manifestTemplate, compilation, compiler) {
  if (!fs.existsSync(`${compiler.outputPath}/background.js`)) {
    return
  }
  if (!manifestTemplate.background) {
    manifestTemplate.background = {}
  }
  manifestTemplate.background.service_worker = `background.js`

}


module.exports = ConsoleLogOnBuildWebpackPlugin
