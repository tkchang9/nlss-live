var path = require('path');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var extractSass = new ExtractTextPlugin({
    filename: "styles.css"
});

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: 'dist/'
    },
    module: {
        loaders: [
            {
                test: /\.html$/,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]',
                    publicPath: './'
                }
            },
            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    use: ['css-loader', 'sass-loader']
                })
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                  loader: 'babel-loader'
                }
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2)$/,
                loader: 'file-loader',
                options: {
                    name: 'fonts/[name].[ext]',
                    publicPath: './'
                }
            }
        ]
    },
    plugins: [
        extractSass
    ],
    devtool: 'inline-source-map'
};