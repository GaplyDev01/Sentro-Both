# Jest Testing Setup for News Impact Platform

## Overview

This document outlines the Jest testing configuration that has been set up for the News Impact Platform project. The configuration enables testing of React components, services, and utilities with proper support for modern JavaScript features, JSX, and DOM manipulation.

## Configuration Files

### 1. Jest Configuration (jest.config.js)

The Jest configuration file has been set up with the following key settings:

```javascript
module.exports = {
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': '<rootDir>/src/frontend/__mocks__/styleMock.js',
    '\\.(png|jpg|jpeg|gif|svg)$': '<rootDir>/src/frontend/__mocks__/fileMock.js',
  },
  setupFilesAfterEnv: ['<rootDir>/src/frontend/setupTests.js'],
  testPathIgnorePatterns: ['/node_modules/'],
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
};
```

This configuration:
- Uses the JSDOM environment for testing components that interact with the DOM
- Defines the source directory for tests
- Sets up mocks for CSS and asset files
- Configures test setup files
- Defines the transformation for JS and JSX files

### 2. Babel Configuration (babel.config.js)

The Babel configuration enables modern JavaScript features and JSX syntax:

```javascript
module.exports = {
  presets: [
    '@babel/preset-env',
    ['@babel/preset-react', { runtime: 'automatic' }]
  ],
  plugins: [
    '@babel/plugin-transform-runtime'
  ]
};
```

### 3. Mock Files

We created the following mock files to support testing:

- **styleMock.js**: Empty module for CSS imports
- **fileMock.js**: Module that returns a file name string for asset imports

### 4. Test Setup (setupTests.js)

The setup file includes configuration for React Testing Library, custom assertions, and browser API mocks:

```javascript
// React Testing Library setup
import '@testing-library/jest-dom';

// Mock for localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

// Mock for matchMedia
window.matchMedia = jest.fn().mockImplementation(query => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: jest.fn(),
  removeListener: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  dispatchEvent: jest.fn(),
}));

// Assign mocks to global object
Object.defineProperty(window, 'localStorage', { value: localStorageMock });
```

## Dependencies Installed

The following dependencies were installed to support testing:

```bash
npm install --save-dev @babel/preset-env @babel/preset-react @babel/plugin-transform-runtime
npm install --save @babel/runtime
npm install --save-dev @testing-library/react @testing-library/jest-dom
npm install --save-dev jest-environment-jsdom
```

## Issues Resolved

1. **ES Module and JSX Syntax Support**
   - Added Babel configuration to transform modern JavaScript and JSX syntax for Jest

2. **Test Environment**
   - Installed and configured jest-environment-jsdom for DOM testing

3. **Router Nesting Conflicts**
   - Fixed issue with nested React Router instances by mocking the Router components in tests

4. **Component Test Assertions**
   - Updated component tests to use proper assertions for Material-UI components

5. **Mock Setup**
   - Created proper mocks for CSS, image files, and browser APIs (localStorage, matchMedia)

## Testing Components

The tests are organized as follows:

- Component tests: `src/frontend/src/components/**/__tests__/*.test.js`
- App tests: `src/frontend/src/__tests__/*.test.js`
- Service tests: `src/frontend/services/__tests__/*.test.js`

## Running Tests

Tests can be run using the following npm script:

```bash
npm test
```

To run tests with coverage reporting:

```bash
npm test -- --coverage
```

## Future Improvements

1. Increase test coverage for components and services
2. Add integration tests for key user flows
3. Set up end-to-end testing with Cypress
4. Implement snapshot testing for UI components

## Conclusion

The Jest testing setup is now complete and functioning correctly. All tests are passing and the configuration supports testing React components with proper handling of modern JavaScript features and DOM interactions. 