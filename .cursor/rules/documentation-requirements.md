# Documentation Requirements

## Code Documentation

### Functions and Methods
- Document the purpose of each function or method
- Document parameters and return values with types
- Document exceptions that might be thrown
- Document side effects
- Example:
  ```javascript
  /**
   * Fetches user data from the API
   * @param {string} userId - The ID of the user to fetch
   * @returns {Promise<UserData>} A promise resolving to the user data
   * @throws {ApiError} If the API request fails
   */
  async function fetchUserData(userId) {
    // Implementation
  }
  ```

### Classes
- Document the purpose of each class
- Document properties and their types
- Document public methods (see function documentation)
- Document inheritance relationships if applicable

### Constants and Configuration
- Document the purpose of constants
- Document the valid values and their meanings
- Document the default values

### Complex Algorithms
- Document the approach used
- Document any assumptions made
- Document time and space complexity
- Document references to research papers or external sources if applicable

## Project Documentation

### README
- Project name and description
- Setup instructions
- Usage examples
- Configuration options
- Contributing guidelines
- License information

### Architecture Documentation
- High-level architecture overview
- Component relationships
- Data flow diagrams
- API documentation
- Database schema

### Workflow Documentation
- Development workflow
- Testing strategy
- Deployment process
- Monitoring and maintenance procedures

## Commenting Guidelines

### Do Comment
- Why decisions were made
- Complex business logic
- Non-obvious optimizations
- Workarounds for bugs or limitations
- References to relevant tickets or discussions

### Don't Comment
- What the code does (should be self-evident)
- Obvious implementations
- Information that will quickly become outdated
- Commented-out code (delete it instead)

## Documentation Maintenance
- Update documentation when code changes
- Remove outdated documentation
- Ensure examples still work
- Add new documentation for new features
- Review documentation periodically 