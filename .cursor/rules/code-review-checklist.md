# Code Review Checklist

## Functionality
- [ ] Code works as specified in requirements
- [ ] Edge cases are handled properly
- [ ] Error scenarios are properly handled
- [ ] Performance considerations are addressed
- [ ] Security vulnerabilities are addressed
- [ ] Accessibility requirements are met

## Code Quality
- [ ] No magic numbers or hardcoded values
- [ ] Variables, functions, and classes have meaningful names
- [ ] Functions follow single responsibility principle
- [ ] Comments explain why, not what
- [ ] No code duplication (DRY)
- [ ] No commented-out code
- [ ] Complex conditionals are extracted into well-named functions
- [ ] Code follows project's style guide

## Testing
- [ ] Unit tests cover the new functionality
- [ ] Tests include edge cases
- [ ] Tests for error conditions are included
- [ ] Tests are meaningful and not just for coverage
- [ ] Mocks and stubs are used appropriately
- [ ] All tests pass

## Architecture
- [ ] Code is properly organized
- [ ] Dependencies are properly managed
- [ ] Interfaces are clean and well-defined
- [ ] Proper separation of concerns
- [ ] Appropriate design patterns are used
- [ ] Components are loosely coupled

## Performance
- [ ] No unnecessary computations
- [ ] Efficient data structures are used
- [ ] Network requests are optimized
- [ ] Rendering performance is considered
- [ ] Memory usage is optimized
- [ ] Proper use of caching where appropriate

## Security
- [ ] Input validation is implemented
- [ ] Output is properly escaped
- [ ] No sensitive information in logs
- [ ] Authentication and authorization checks
- [ ] Protection against common vulnerabilities (XSS, CSRF, etc.)
- [ ] Secure practices for data storage

## Documentation
- [ ] Code is self-documenting with good naming
- [ ] Complex algorithms or business rules are documented
- [ ] Public APIs have documentation
- [ ] README is updated if needed
- [ ] Deprecation notes added for changed APIs

## Version Control
- [ ] Commits are small and focused
- [ ] Commit messages are clear and descriptive
- [ ] No unnecessary files are included
- [ ] No sensitive data or credentials in the commits
- [ ] Proper branch naming convention is followed

## Project-Specific
- [ ] Follows the established architectural patterns
- [ ] Uses the project's utilities and shared components
- [ ] Consistent with existing code patterns
- [ ] Meets the specific requirements for the project domain 