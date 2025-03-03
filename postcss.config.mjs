export default {
    plugins: {
      "@tailwindcss/postcss": {}, // Подключаем Tailwind CSS
      "@fullhuman/postcss-purgecss": {
        content: [
          './src/**/*.{html,js,jsx,ts,tsx,vue}'],  // Указываем, какие файлы будут сканироваться на наличие классов
        defaultExtractor: content => content.match(/[A-Za-z0-9-_:/]+/g) || [],  // Извлечение классов
      },
      autoprefixer: {},  // Автопрефиксация для совместимости с браузерами
      cssnano: { preset: "default" },  // Минификация CSS
    },
  };

