const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = [
  {
    mode: "production",
    entry: "./src/js/main.js",
    output: {
      filename: "bundle.js",
      path: path.resolve(__dirname, "build"),
    },
    module: {
      rules: [],
    },
    plugins: [
      new HtmlWebpackPlugin({
        inject: false,
        filename: "index.html",
        template: path.resolve(__dirname, "src/index.html"),
        options: {
          lib: "uldu",
        },
      }),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: "src/img/*.png",
            to: "img/[name].png",
          },
                    {
            from: "src/img/*.svg",
            to: "img/[name].svg",
          },
                    {
            from: "src/img/*.jpg",
            to: "img/[name].jpg",
          },
          {
            from: "src/css/*.css",
            to: "css/[name].css",
          },
        ],
      }),
    ],
  },
];
