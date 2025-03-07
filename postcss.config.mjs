export default {
    plugins: {
      "@tailwindcss/postcss": {}, // Подключаем Tailwind CSS
      autoprefixer: {},  // Автопрефиксация для совместимости с браузерами
      cssnano: { preset: "default" },  // Минификация CSS
    },
  };

