module.exports = {
    plugins: [
      require('tailwindcss'),  // Подключаем Tailwind CSS
      require('autoprefixer'),  // Автопрефиксация для совместимости с браузерами
      require('cssnano')({ preset: 'default' }),  // Минификация CSS
      require('@fullhuman/postcss-purgecss')({
        content: ['./src/**/*.{html,js,jsx}'],  // Указываем, какие файлы будут сканироваться на наличие классов
        defaultExtractor: content => content.match(/[A-Za-z0-9-_:/]+/g) || [],  // Извлечение классов
      }),
    ],
  };