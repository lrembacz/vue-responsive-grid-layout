var path = require('path')
var webpack = require('webpack')

const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
 
module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, '../dist'),
    publicPath: '/dist/',
    filename: 'vue-responsive-grid-layout.min.js',
    library: 'VueResponsiveGridLayout',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  externals: {
    "vue": "Vue",
  },
  module: {
    rules: [{
      test: /\.vue$/,
      loader: 'vue-loader',
    }, {
      test: /\.js$/,
      loader: 'babel-loader',
      exclude: /node_modules/
    }, ]
  },
  plugins: [new UglifyJSPlugin()]
}