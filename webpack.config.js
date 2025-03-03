const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');


module.exports = (env, argv) => {

  const isProduction = argv.mode === "production";

  return {
    entry: './src/index.tsx', // Указываем точку входа
    output: {
      filename: 'bundle.js', // Название итогового бандла
      path: path.resolve(__dirname, 'docs') // Папка для собранных файлов
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './public/index.html', // Путь к вашему HTML шаблону
      }),
      // Плагин для извлечения CSS в продакшн
      isProduction && new MiniCssExtractPlugin({
        filename: '[name].[contenthash].css',  // Имя файла для стилей
      }),
    ].filter(Boolean),  // Убираем undefined (если не в продакшн),
    resolve: {
      extensions: ['.ts', '.js', '.tsx'] // Указываем расширения, которые Webpack будет обрабатывать
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/, // Обрабатываем все файлы с расширением .ts
          use: 'ts-loader', // Используем ts-loader для компиляции TypeScript в JavaScript
          exclude: /node_modules/ // Исключаем папку node_modules
        },
        {
          test: /\.css$/,  // Обработка файлов CSS
          use: [
            isProduction 
            ? MiniCssExtractPlugin.loader  // Для продакшн
            : 'style-loader',  // Для разработки
            'css-loader',  // Обработка CSS
            'postcss-loader',  // Обработка через PostCSS (для Tailwind, Autoprefixer и других плагинов)
          ],
        },
      ]
    },
    devServer: {
      static: path.join(__dirname, 'docs'), // Указываем папку для сервера
      compress: true,
      port: 9000
    }
  }
};