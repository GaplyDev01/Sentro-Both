# Clean Code Guidelines

## Constants Over Magic Numbers
- Replace all hard-coded values with named constants
- Use descriptive constant names that clearly explain the value's purpose
- Keep constants organized at the top of the file or in a dedicated constants file
- Examples:
  - ✓ `const MAX_RETRIES = 3;`
  - ✗ `if (attempts > 3)`

## Meaningful Names
- Variables, functions, and classes must reveal their purpose
- Names should explain why something exists and how it's used
- Avoid abbreviations unless they're universally understood
- Examples:
  - ✓ `getUserData()`, `isUserActive`
  - ✗ `getData()`, `active`

## Smart Comments
- Don't comment on what the code does - make the code self-documenting
- Use comments to explain why something is done a certain way
- Document APIs, complex algorithms, and non-obvious side effects
- Examples:
  - ✓ `// Using local storage to persist state across page refreshes`
  - ✗ `// Get user data`

## Single Responsibility
- Each function should do exactly one thing
- Functions should be small and focused
- If a function needs a comment to explain what it does, it should be split
- Keep functions under 20-30 lines when possible

## DRY (Don't Repeat Yourself)
- Extract repeated code into reusable functions
- Share common logic through proper abstraction
- Maintain single sources of truth
- If code is duplicated in more than one place, it should be extracted

## Clean Structure
- Keep related code together
- Organize code in a logical hierarchy
- Use consistent file and folder naming conventions
- Group related functionality in the same modules

## Encapsulation
- Hide implementation details
- Expose clear interfaces
- Move nested conditionals into well-named functions
- Use appropriate access modifiers (private, protected, public)

## Code Quality Maintenance
- Refactor continuously
- Fix technical debt early
- Leave code cleaner than you found it
- Address compiler warnings and linter issues

## Testing
- Write tests before fixing bugs
- Keep tests readable and maintainable
- Test edge cases and error conditions
- Aim for comprehensive test coverage

## Version Control
- Write clear commit messages
- Make small, focused commits
- Use meaningful branch names
- Keep pull requests small and focused 