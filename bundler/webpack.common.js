const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCSSExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");

module.exports = {
  // src目录下的script文件为打包入口文件
  entry: path.resolve(__dirname, "../src/script.js"),
  output: {
    hashFunction: "xxhash64", // 指定生成文件名时所使用的哈希算法
    filename: "bundle.[contenthash].js", // 打包出来的文件名
    path: path.resolve(__dirname, "../dist"), // 在哪个目录下输出打包文件
  },
  devtool: "source-map", // 用于将编译后的代码映射回原始代码，方便调试。（开发模式下，但是我看了一下生产环境下的配置没有覆盖回来 ??）
  plugins: [
    // 将文件或目录从源位置复制到目标位置。针对静态资源
    new CopyWebpackPlugin({
      patterns: [{ from: path.resolve(__dirname, "../static") }],
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "../src/index.html"),
      minify: true,
    }),
    new MiniCSSExtractPlugin(),
  ],

  // resolve: {
  //     fallback: {
  //         "fs": false
  //     },
  // },

  module: {
    rules: [
      // HTML
      {
        test: /\.(html)$/,
        use: ["html-loader"],
      },

      // JS
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ["babel-loader"],
      },

      // CSS
      {
        test: /\.css$/,
        use: [MiniCSSExtractPlugin.loader, "css-loader"],
      },

      // Images
      {
        test: /\.(jpg|png|gif|svg)$/,
        type: "asset/resource",
        generator: {
          filename: "assets/images/[hash][ext]",
        },
      },

      // Fonts
      {
        test: /\.(ttf|eot|woff|woff2)$/,
        type: "asset/resource",
        generator: {
          filename: "assets/fonts/[hash][ext]",
        },
      },

      // Shaders
      {
        test: /\.(glsl|vs|fs|vert|frag)$/,
        type: "asset/source",
        generator: {
          filename: "assets/images/[hash][ext]",
        },
      },

      // MP3
      {
        test: /\.(mp3)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              outputPath: "assets/audios/",
            },
          },
        ],
      },
    ],
  },
};
