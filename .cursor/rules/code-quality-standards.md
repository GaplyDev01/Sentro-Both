# Code Quality Standards

## Verification Requirements
- Always verify information before presenting it
- Do not make assumptions or speculate without clear evidence
- Check all API responses and database queries for proper error handling
- Validate all inputs at every boundary

## Implementation Approach
- Make changes file by file and methodically
- Focus on one component or feature at a time
- Commit incremental changes rather than large batches
- Test each change individually before moving to the next

## Communication Style
- Never use apologies in code, comments, or documentation
- Don't include understanding feedback in comments or documentation
- Focus on technical facts and implementation details
- Keep language clear, precise, and professional

## Code Modification Rules
- Don't suggest whitespace changes unless specifically requested
- Never invent changes beyond what is explicitly requested
- Don't remove unrelated code or functionalities
- Pay careful attention to preserving existing structures
- Provide all edits in a single chunk for each file

## Implementation Verification
- Don't ask to verify implementations that are visible in the provided context
- Don't suggest updates to files when no modifications are needed
- Always reference real files, not placeholders
- Don't discuss current implementation unless specifically requested

## Quality Assurance
- All code must pass linting without warnings
- Maintain consistent coding style
- Ensure proper error handling throughout
- Optimize for both performance and readability
- Keep cyclomatic complexity low
- Avoid deep nesting of control structures
- Limit function parameter count to 3 or fewer when possible

## Robustness
- Handle edge cases explicitly
- Implement proper error recovery
- Design for graceful degradation
- Add appropriate logging for debugging
- Consider security implications of all code

## Maintainability
- Keep dependencies up to date
- Document technical debt when it can't be immediately addressed
- Use design patterns appropriately
- Maintain backward compatibility when possible
- Support easy refactoring through loosely coupled components 