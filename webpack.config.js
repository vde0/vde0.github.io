module.exports = {
    entry: './src/index.js',
    module: {
        rules: [
            { test: /\.css$/, use: ['style-loader', 'css-loader'] },
            { test: /\.js$/, use: 'babel-loader' },
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
        filename: 'index_bundle.js'
    },
    mode: process.env.NODE_ENV === 'production' ? 'production' : 'development'
};