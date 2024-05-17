module.exports = {
    entry: './src/index.js',
    output: {
        path: __dirname + '/docs/',
        filename: 'index_bundle.js',
        assetModuleFilename: 'imgs/' + '[name].[contenthash][ext]',
    },
    module: {
        rules: [
            { test: /\.css$/, use: ['style-loader', 'css-loader'] },
            { test: /\.js$/, use: 'babel-loader' },
            {
                test: /\.(png|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
            },
            {
                test: /\.svg$/i,
                issuer: /\.[jt]sx?$/,
                use: ['@svgr/webpack'],
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
    mode: process.env.NODE_ENV === 'production' ? 'production' : 'development'
};