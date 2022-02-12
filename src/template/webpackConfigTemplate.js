const path = require('path')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const ChromeExtensionDevPlugin = require('../plugin/index.js')
const fs = require('fs')

function readManifest(path) {
  return JSON.parse(fs.readFileSync(path, 'utf-8'))
}
const manifest = readManifest(path.resolve(process.cwd(), 'manifestConfig.json'))

module.exports = {
  output: {
    path: path.resolve(process.cwd(), 'dist'),
    filename: "content-script/[name]/index.js",
    clean: true,
    publicPath: './'
  },
  optimization: {
    runtimeChunk: false
  },
  mode: "production",
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'content-script/[name]/index.css',
      chunkFilename: 'content-script/[name]/index.css',
      runtime: false
    }),
    new ChromeExtensionDevPlugin({
      manifestConfig: manifest
    })
  ],
  module: {
    rules: [
      {
        test:/\.css$/,
        use:[
          {
          loader: MiniCssExtractPlugin.loader
        },
          {
          loader: 'css-loader'
        }],
      }
    ]
  }
}
