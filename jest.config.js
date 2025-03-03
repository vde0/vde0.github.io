module.exports = {
    preset: 'ts-jest',              // Используем ts-jest для компиляции TypeScript в JavaScript
    testEnvironment: 'jest-environment-jsdom',       // Настроим окружение для работы с DOM (важно для тестирования компонентов React)
    setupFilesAfterEnv: [
      '@testing-library/jest-dom' // Подключаем дополнительные matchers для Jest DOM
    ],
    transform: {
      '^.+\\.tsx?$': 'ts-jest',    // Преобразуем файлы .ts и .tsx с помощью ts-jest
    },
    moduleNameMapper: {
      // Это нужно, если используешь пути для импорта (например, абсолютные пути)
      '^src/(.*)$': '<rootDir>/src/$1'
    },
    testMatch: [
      '<rootDir>/src/**/*.test.tsx',  // Определяем шаблон для поиска тестов
      '<rootDir>/src/**/*.test.ts'
    ],
  };
  