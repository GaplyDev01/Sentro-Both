module.exports = {
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': '<rootDir>/src/frontend/__mocks__/styleMock.js',
    '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/src/frontend/__mocks__/fileMock.js'
  },
  setupFilesAfterEnv: ['<rootDir>/src/frontend/setupTests.js'],
  testPathIgnorePatterns: ['/node_modules/'],
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest'
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(@babel/runtime)/)'
  ],
  moduleFileExtensions: ['js', 'jsx', 'json'],
  collectCoverageFrom: [
    'src/frontend/src/**/*.{js,jsx}',
    'src/frontend/components/**/*.{js,jsx}',
    '!src/frontend/src/**/*.d.ts',
    '!**/node_modules/**'
  ]
}; 