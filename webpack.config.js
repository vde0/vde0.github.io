const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

const NGROK_URL = process.env.NGROK;


module.exports = (env, argv) => {

  const isProduction = argv.mode === "production";

  return {
    entry: './src/index.tsx', // Указываем точку входа
    output: {
      filename: 'bundle.js', // Название итогового бандла
      path: path.resolve(__dirname, 'docs'), // Папка для собранных файлов
      publicPath: '/',
    },
    devServer: {
      static: path.join(__dirname, 'docs'),
      // compress: true,
      hot: true,
      port: 9000,
      liveReload: true, // Включаем перезагрузку страницы при изменениях
      headers: {
        'Access-Control-Allow-Origin': '*', // Разрешаем все источники
      },
      client: {
        webSocketURL: NGROK_URL
          ? `wss://${NGROK_URL}/ws` // WebSocket URL для ngrok
          : 'wss://localhost:9000/ws',
      },
      server: {
        type: "https",
        options: {
          key: 'ssl/private.key',
          cert: 'ssl/certificate.crt',
        },
      },
      watchFiles: {
        paths: ['docs/**/*'],
        options: {
          poll: true, // Включаем polling для отслеживания изменений
        },
      },
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
      extensions: ['.ts', '.js', '.tsx'], // Указываем расширения, которые Webpack будет обрабатывать
      plugins: [new TsconfigPathsPlugin()]
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
  }
};