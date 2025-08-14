const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const Dotenv = require("dotenv-webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
    entry: "./src/script.js", // starting file
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, "dist"),
        publicPath: "./",
        clean: true, // cleans dist folder before build
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"], // for CSS
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/index.html",
        }),
        new Dotenv(),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, "src/assets"), // source folder
                    to: "assets", // destination folder in /dist
                },
            ],
        }),
    ],
    devServer: {
        static: "./dist", // folder to serve
        hot: true, // enable Hot Module Replacement
        open: true, // opens browser automatically
    },
    mode: "development",
};
