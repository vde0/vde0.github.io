const HtmlWebpackPlugin = require('html-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const webpack = require('webpack');
const path = require('path');

module.exports = (env, argv) => {
	const isProduction = argv.mode === 'production';
	console.log('SIGNAL WP:', process.env.SIGNAL, typeof process.env.SIGNAL);

	return {
		devtool: 'eval-source-map', // Лёгкие исходные карты для дев-сборки
		entry: ['webpack-hot-middleware/client', './src/index.tsx'], // Указываем точку входа
		output: {
			filename: '[name].[contenthash].js', // Название итогового бандла
			path: path.resolve(__dirname, 'docs'), // Папка для собранных файлов
			publicPath: '/',
		},
		cache: {
			type: 'filesystem', // Использование файловой системы для кэширования
		},
		watchOptions: {
			ignored: /node_modules/, // Игнорирование определённых файлов
			aggregateTimeout: 300, // Ожидание 300 мс до запуска нового бандла
			poll: 1000, // Поллинг файлов каждые 1000 мс
		},
		plugins: [
			new webpack.HotModuleReplacementPlugin(),
			new webpack.DefinePlugin({
				'process.env.SIGNAL': JSON.stringify(process.env.SIGNAL), // Передача переменной
			}),
			new HtmlWebpackPlugin({
				template: './public/index.html', // Путь к вашему HTML шаблону
			}),
			new webpack.ProvidePlugin({
				process: 'process/browser',
			}),
			// Плагин для извлечения CSS в продакшн
			isProduction &&
				new MiniCssExtractPlugin({
					filename: '[name].[contenthash].css', // Имя файла для стилей
					buildDependencies: {
						config: [__filename], // Перезагружать только при изменении конфигурации
					},
				}),
		].filter(Boolean), // Убираем undefined (если не в продакшн),
		optimization: {
			minimize: true,
			splitChunks: {
				chunks: 'all', // Разделяем все типы чанков (модули, страницы и т.д.)
			},
		},
		resolve: {
			extensions: ['.ts', '.js', '.tsx'], // Указываем расширения, которые Webpack будет обрабатывать
			plugins: [new TsconfigPathsPlugin()],
			fallback: {
				events: require.resolve('events/'),
				stream: require.resolve('stream-browserify'),
				process: require.resolve('process/browser'),
			},
		},
		module: {
			rules: [
				{
					test: /\.(png|jpe?g|gif|svg|webp)$/i,
					type: 'asset/resource', // или 'asset/inline' или 'asset'
				},
				{
					test: /\.tsx?$/, // Обрабатываем все файлы с расширением .ts
					use: 'ts-loader', // Используем ts-loader для компиляции TypeScript в JavaScript
					exclude: /node_modules/, // Исключаем папку node_modules
				},
				{
					test: /\.css$/, // Обработка файлов CSS
					use: [
						isProduction
							? MiniCssExtractPlugin.loader // Для продакшн
							: 'style-loader', // Для разработки
						'css-loader', // Обработка CSS
						'postcss-loader', // Обработка через PostCSS (для Tailwind, Autoprefixer и других плагинов)
					],
				},
			],
		},
	};
};
