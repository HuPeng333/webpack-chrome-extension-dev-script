const fs = require('fs')
const path = require('path')

module.exports.copyDirSync = (src, dest) => {
  let files
  files = fs.readdirSync(src)
  files.forEach((item) => {
    const itemPath = path.join(src, item)
    const itemStat = fs.statSync(itemPath)
    const savedPath = path.join(dest, itemPath.replace(src, ''))
    const savedDir = savedPath.substring(0, savedPath.lastIndexOf('\\'))
    if (itemStat.isFile()) {
      if (!fs.existsSync(savedDir)) {
        fs.mkdirSync(savedDir, {recursive: true});
      }
      const data = fs.readFileSync(itemPath)
      fs.writeFileSync(savedPath, data);
    } else if (itemStat.isDirectory()) {
      copyDirSync(itemPath, path.join(savedDir, item));
    }
  });
}

