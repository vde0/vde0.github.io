const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.tsx', // Указываем точку входа
  output: {
    filename: 'bundle.js', // Название итогового бандла
    path: path.resolve(__dirname, 'docs') // Папка для собранных файлов
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html', // Путь к вашему HTML шаблону
    }),
  ],
  resolve: {
    extensions: ['.ts', '.js', '.tsx'] // Указываем расширения, которые Webpack будет обрабатывать
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/, // Обрабатываем все файлы с расширением .ts
        use: 'ts-loader', // Используем ts-loader для компиляции TypeScript в JavaScript
        exclude: /node_modules/ // Исключаем папку node_modules
      }
    ]
  },
  devServer: {
    static: path.join(__dirname, 'docs'), // Указываем папку для сервера
    compress: true,
    port: 9000
  }
};