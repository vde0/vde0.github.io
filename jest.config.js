module.exports = {
    preset: 'ts-jest',              // Используем ts-jest для компиляции TypeScript в JavaScript
    testEnvironment: 'jest-environment-jsdom',       // Настроим окружение для работы с DOM (важно для тестирования компонентов React)
    setupFilesAfterEnv: [
      '@testing-library/jest-dom' // Подключаем дополнительные matchers для Jest DOM
    ],
    transform: {
      '^.+\\.tsx?$': 'ts-jest',    // Преобразуем файлы .ts и .tsx с помощью ts-jest
    },
    // Если нужно, укажи корневую папку для Jest
    rootDir: './src/',
    moduleNameMapper: {
      // Это нужно, если используешь пути для импорта (например, абсолютные пути)
      // '^src/(.*)$': '<rootDir>/src/$1'
      "^@components/(.*)$": "<rootDir>/components/$1",
      "^@containers/(.*)$": "<rootDir>/containers/$1",
      "^@store(/.*)?$": "<rootDir>/store$1",
      "^@utils$": "<rootDir>/utils/",
      "^@test-utils$": "<rootDir>/test-utils/",
      "^@hooks$": "<rootDir>/hooks/",
      "^@types$": "<rootDir>/@types/",
    },
    testMatch: [
      '<rootDir>/**/*.test.tsx',  // Определяем шаблон для поиска тестов
      '<rootDir>/**/*.test.ts'
    ],
  };
  