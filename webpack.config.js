const path = require('path')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const ChromeExtensionDevPlugin = require('./src/plugin/index.js')
const fs = require('fs')
const webpack = require('webpack')

function readManifest(path) {
  return JSON.parse(fs.readFileSync(path, 'utf-8'))
}

module.exports = {
  entry: path.resolve(process.cwd(), 'src/content-script/index'),
  output: {
    path: path.resolve(process.cwd(), 'dist'),
    filename: "content-script/index.js",
    libraryTarget: "window",
    clean: true,
    publicPath: "./"
  },
  mode: "production",
  plugins: [
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1,
    }),
    new MiniCssExtractPlugin({
      filename: 'content-script/index.css',
      runtime: false
    }),
    new ChromeExtensionDevPlugin({
      manifestConfig: readManifest(path.resolve(process.cwd(), 'manifestConfig.json'))
    })
  ],
  module: {
    rules: [
      {
        test:/\.css$/,
        use:[
          {
          loader: MiniCssExtractPlugin.loader,
          options: {
            esModule: false
          }
        },
          {
          loader: 'css-loader',
          options: {
            esModule: false,
          }
        }],
      }
    ]
  }
}
