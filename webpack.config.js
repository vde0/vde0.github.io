module.exports = {
    entry: './src/index.js',
    module: {
        rules: [
            { test: /\.css$/, use: ['style-loader', 'css-loader'] },
            { test: /\.js$/, use: 'babel-loader' },
            {
                test: /\.(png|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
            },
            {
                test: /\.svg$/,
                type: 'asset/resource',
                generator: {
                    filename: 'icons/' + '[name].[contenthash][ext]',
                },
            },
        ]
    },
    devServer: {
        static: {
            directory: __dirname + '/docs/'
        },
        compress: true,
        port: 9000
    },
    output: {
        path: __dirname + '/docs/',
        filename: 'index_bundle.js',
        assetModuleFilename: 'imgs/' + '[name].[contenthash][ext]',
    },
    mode: process.env.NODE_ENV === 'production' ? 'production' : 'development'
};