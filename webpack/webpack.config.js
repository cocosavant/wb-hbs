var HtmlWebpackPlugin = require('html-webpack-plugin');
var package   = require('../package.json');
var CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin');
var path = require("path");
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var SassLintPlugin = require('sasslint-webpack-plugin');

module.exports = {
  entry: {
    app: "./src/js/app.js",
    vendor: Object.keys(package.dependencies),
    settings: "./src/js/settings.js",
    hbsTest: "./src/js/components/hbsTest.js"
  },

  output: {
    path: path.join(__dirname, "../dist/"),
    filename: "js/[name].bundle.js",
  },

  devServer: {
    contentBase: path.join(__dirname, "../dist/"),
    port: 9000
  },

  watch:true,
  resolve: {
    extensions: [".js", ".json", '.hbs']
  },

  module:{
    rules:[
      {
        test: /\.(s*)css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader','sass-loader']
        })
      },
      {
        test: /\.(png|jp(e*)g|svg)$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 8000, // Convert images < 8kb to base64 strings
            name: 'img/[name].[ext]'
          }
        }]
      },
      {
        test: /\.hbs$/,
        use: [{loader: "handlebars-loader"}]
      },
      {
        test: /\.json$/,
        use: [{loader: "json-loader"}]
      }
    ],
  },

  plugins: [
    new ExtractTextPlugin({filename:'css/app.bundle.css'}),
    new SassLintPlugin({
      configFile: '.sass-lint.yml',
      context: ['inherits from webpack'],
      ignoreFiles: [],
      ignorePlugins: [],
      glob: '**/*.s?(a|c)ss',
      quiet: false,
      failOnWarning: false,
      failOnError: false,
      testing: false,
      files: [{
        include: 'scss/**/*.s+(a|c)ss',
        ignore:
          - 'scss/vendor/**/*.*'
      }]
    }),
    new CommonsChunkPlugin({
        name: 'shared',
        minChunks: 2
    }),
    new CopyWebpackPlugin([
      {from:'src/assets/img',to:'img'}
    ]),
    new HtmlWebpackPlugin({
      hash: false,
      title: 'My Awesome application',
      myPageHeader: 'Hello World',
      template: './src/markup/index.html',
      chunks: ['vendor', 'shared', 'app'],
      path: path.join(__dirname, "../dist/"),
      filename: 'index.html' //relative to root of the application
    }),
    new HtmlWebpackPlugin({
      hash: false,
      title: 'My Awesome application',
      myPageHeader: 'Settings',
      template: './src/markup/index.html',
      chunks: ['vendor', 'shared', 'settings'],
      path: path.join(__dirname, "../dist/"),
      filename: 'settings.html'
    })
  ]
}
