module.exports = {
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': '<rootDir>/src/frontend/__mocks__/styleMock.js',
    '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/src/frontend/__mocks__/fileMock.js',
    'src/frontend/src/utils/a11yUtils': '<rootDir>/src/frontend/__mocks__/a11yUtilsMock.js',
    'src/frontend/components/common/ResponsiveTypography': '<rootDir>/src/frontend/__mocks__/responsiveTypographyMock.js'
  },
  setupFilesAfterEnv: [
    '<rootDir>/src/frontend/setupTests.js',
    '<rootDir>/src/frontend/jest.setup.js'
  ],
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