const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = [
  {
    entry: './src/js/main.js',
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'build'),
    },
    module: {
      rules: [],
    },
    plugins: [
      new UglifyJsPlugin(),
      new HtmlWebpackPlugin({
        inject: false,
        filename: 'index.html',
        template: path.resolve(__dirname, 'src/index.html'),
        options: {
          lib: 'uldu',
        }
      }),
      new CopyWebpackPlugin([
        {
          from: 'src',
          to: '',
          ignore: ['*.js', '*.html', '*.tmpl'],
        },
      ]),
    ]
  },
  {
    entry: ['./src/js/polyfills.js', './src/js/main.js'],
    output: {
      filename: 'bundle-es2015.js',
      path: path.resolve(__dirname, 'build'),
    },
    module: {
      rules: [{
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: require.resolve('babel-loader'),
        options: {compact: true}
      }]
    },
    plugins: [
      new UglifyJsPlugin(),
      new HtmlWebpackPlugin({
        inject: false,
        filename: 'index-es2015.html',
        template: path.resolve(__dirname, 'src/index-es2015.html'),
        options: {
          lib: 'uldu',
        }
      }),
    ]
  }
];
