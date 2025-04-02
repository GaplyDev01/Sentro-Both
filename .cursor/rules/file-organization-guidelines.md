# File Organization Guidelines

## File Uniqueness Requirements

### One File Per Function/Component
- Each discrete functional unit must exist in exactly one file
- Never create duplicate files with similar functionality
- Before creating a new file, always search the codebase for existing implementations
- Use the file naming convention to clearly indicate the file's purpose

### File Location Validation
- Before creating a new file, use `grep_search` or `codebase_search` to verify no similar file exists
- Check multiple directories where a file might logically be placed
- If uncertainty exists about file placement, examine similar components for precedent
- Never create a new directory for a file if a suitable directory already exists

### Directory Structure
- Follow existing project directory structure
- Place files in the most specific applicable directory
- Group related files in the same directory
- Use standard directory names (e.g., `components`, `utils`, `services`, etc.)

## File Size Limits

### Maximum File Size
- Keep all files under 500 lines of code
- If a file approaches 500 lines, consider refactoring into multiple files
- Extract utility functions, helpers, and types into separate files

### Code Organization Within Files
- Order imports logically (external first, then internal, then relative)
- Group related functions/methods together
- Keep the main export/component at the bottom of the file
- Use clear section markers for large files

## Prevention of Duplication

### Before Creating Files
- Required verification steps before creating any new file:
  1. Search for files with similar names using `file_search`
  2. Search for similar functionality using `codebase_search`
  3. Check similar directories for precedent

### Code Reuse
- Extract common functionality into shared utilities
- Use existing utilities instead of creating new ones
- Reference existing types and interfaces rather than redefining
- Consolidate similar code paths

## Hallucination Prevention

### Reality Checks
- Never reference files or directories that don't exist
- Before suggesting changes to a file, verify the file exists
- Use `list_dir` to confirm directory contents before operations
- When referencing code patterns, confirm they exist with `grep_search`

### Searching Before Creating
- Always use `codebase_search` before creating new utilities, components, or services
- Search for existing implementations of functions before writing new ones
- Look for existing patterns and follow them

### Concrete Path References
- Always use actual file paths, not hypothetical ones
- Verify paths with tools before referring to them in instructions
- Never assume directory structure without checking

## Implementation Checks

### File Existence Verification Protocol
Before creating a new file:
```
1. Identify the intended functionality
2. Search for existing implementations:
   - Use codebase_search for similar functionality
   - Use grep_search for similar file names
   - Use file_search for similar paths
3. Check logical locations where such a file might exist
4. Only proceed with file creation if no duplicate is found
```

### Duplication Prevention Protocol
When implementing new functionality:
```
1. First check if functionality exists elsewhere
2. Look for similar implementations to refactor/extend
3. Create utilities for common operations
4. If similar functions exist, extract patterns
5. Never copy-paste significant code blocks
``` 