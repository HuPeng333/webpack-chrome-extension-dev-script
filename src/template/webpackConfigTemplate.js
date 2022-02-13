const path = require('path')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const ChromeExtensionDevPlugin = require("../plugin/index.js")
const templateUtils = require('../util/templateUtils')

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
      manifestConfig: templateUtils.loadManifest()
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
