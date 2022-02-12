const contentScriptOutputFolderName = 'content-script'
const backgroundOutputFolderName = 'background'
const popupOutputFolderName = 'popup'
const publicOutputFolderName = 'public'
const optionsOutputFolderName = 'options'

const contentScriptOutputPath = (compiler) => {
  return `${compiler.outputPath}/${contentScriptOutputFolderName}`
}

const backgroundOutputPath = (compiler) => {
  return `${compiler.outputPath}/${backgroundOutputFolderName}`
}
const contentScriptEntryFolder = () => {
  return `${process.cwd()}/src/${contentScriptOutputFolderName}`
}
const backgroundEntryFolder = () => {
  return `${process.cwd()}/src/${backgroundOutputFolderName}`
}



module.exports.contentScriptOutputFolderName = contentScriptOutputFolderName
module.exports.backgroundOutputFolderName = backgroundOutputFolderName
module.exports.backgroundOutputPath = backgroundOutputPath
module.exports.contentScriptOutputPath = contentScriptOutputPath
module.exports.popupOutputFolderName = popupOutputFolderName
module.exports.publicOutputFolderName = publicOutputFolderName
module.exports.optionsOutputFolderName = optionsOutputFolderName
module.exports.contentScriptEntryFolder = contentScriptEntryFolder
module.exports.backgroundEntryFolder = backgroundEntryFolder
