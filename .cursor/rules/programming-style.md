# Programming Style Guide

## Naming Conventions
- Use camelCase for variables and functions
- Use PascalCase for classes, interfaces, and type names
- Use ALL_CAPS for constants
- Use descriptive, intention-revealing names
- Prefix boolean variables with `is`, `has`, `should`, etc.
- Prefix functions that return boolean with `is`, `has`, `should`, etc.

## Formatting
- Indent with 2 spaces (no tabs)
- Line length should be maximum 80 characters
- Use semicolons at the end of statements
- End files with a newline
- Remove trailing whitespace
- Use single quotes for strings consistently
- Always use curly braces for blocks, even single-line blocks

## Organization
- Import statements should be sorted and grouped:
  1. External libraries
  2. Internal modules
  3. Relative imports
- Group related functions together
- Order methods consistently (e.g., lifecycle methods first, then event handlers, etc.)
- Keep files under 300 lines if possible
- Break large components into smaller ones

## JavaScript/TypeScript Specific
- Use `const` by default, `let` when reassignment is needed, never use `var`
- Use template literals instead of string concatenation
- Use arrow functions for callbacks
- Use async/await instead of raw promises when possible
- Use destructuring for objects and arrays
- Use spread operator rather than Object.assign
- Use optional chaining and nullish coalescing operators for safer code
- Always specify return types for functions in TypeScript
- Prefer interfaces over type aliases for object definitions

## CSS/Styling
- Use CSS-in-JS or CSS modules to avoid global style conflicts
- Follow a consistent naming convention for CSS classes
- Use responsive design principles
- Keep selectors simple and avoid deep nesting
- Use variables for colors, fonts, and other repeated values

## React Specific (if applicable)
- Use functional components with hooks instead of class components
- Keep components pure when possible
- Destructure props in function parameters
- Use proper key props in lists
- Memoize callbacks and derived values as needed
- Follow the React component file structure convention

## Error Handling
- Use try/catch blocks for error-prone code
- Provide informative error messages
- Log errors appropriately
- Avoid silent failures
- Handle all promise rejections

## Security
- Sanitize all user inputs
- Avoid eval() and other unsafe functions
- Prevent XSS vulnerabilities
- Use HTTPS for all requests
- Keep dependencies updated to avoid security vulnerabilities 