// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import { configure } from '@testing-library/react';

// Set up React Testing Library
configure({
  testIdAttribute: 'data-testid',
});

// Mock for window.matchMedia which is not available in Jest environment
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock for Material-UI useMediaQuery
jest.mock('@mui/material/useMediaQuery', () => {
  return jest.fn().mockImplementation(query => {
    if (query === '(min-width:600px)') return true;
    if (query === '(min-width:960px)') return true;
    if (query === '(min-width:1280px)') return false;
    return false;
  });
});

// Suppress React 18 console errors/warnings
const originalConsoleError = console.error;
console.error = (...args) => {
  if (/Warning.*not wrapped in act/.test(args[0])) {
    return;
  }
  originalConsoleError(...args);
}; 