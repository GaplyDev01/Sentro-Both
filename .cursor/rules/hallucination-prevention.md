# Hallucination Prevention Guidelines

## Definition and Recognition

### What Is Hallucination?
- Creating or referencing files, directories, or code that doesn't exist
- Assuming features or functionality that isn't present
- Referring to non-existent patterns or conventions
- Making up API responses or data structures
- Generating plausible but incorrect explanations

### Signs of Hallucination
- Referencing files without verification
- Creating new directories without checking existing structure
- Assuming the existence of utilities or helpers
- Asserting implementation details without checking
- Creating duplicate functionality

## Verification Protocols

### File System Verification
Before referencing any file:
```
1. Use file_search or grep_search to confirm existence
2. Use list_dir to check directory contents
3. When uncertain, use read_file to examine content
4. Only assume existence of files explicitly verified
```

### Code Pattern Verification
Before assuming patterns or conventions:
```
1. Use codebase_search to find representative examples
2. Look at multiple examples to confirm patterns
3. Verify with grep_search for specific syntax
4. Only follow patterns with multiple confirmations
```

### Functionality Verification
Before assuming the existence of functionality:
```
1. Use codebase_search for expected function names
2. Check import statements to confirm available modules
3. Verify package.json/requirements.txt for dependencies
4. Examine tests to understand expected behavior
```

## Baseline Reality Anchoring

### Required Tool Usage
Always execute the following before making significant changes:
1. `list_dir` on the relevant directories
2. `codebase_search` for similar functionality
3. `grep_search` for key identifiers
4. `read_file` to understand existing implementations

### Explicit Knowledge Boundaries
- Clearly distinguish between verified and assumed information
- State when information is incomplete or uncertain
- Do not extrapolate beyond what can be directly verified
- Use phrases like "Based on the files I've examined..." rather than absolute statements

## Implementation Procedures

### File Creation Protocol
Before creating any new file:
```
1. Use file_search to check if similar files exist
2. Use grep_search to check for similar filenames
3. Use codebase_search to check for similar functionality
4. Check relevant directories with list_dir
5. Only create after confirming no duplicates exist
```

### Component Creation Protocol
Before creating any new component:
```
1. Search for existing components with similar purpose
2. Check for component libraries or shared components
3. Examine the component hierarchy for proper placement
4. Verify naming conventions from multiple examples
5. Only create after confirming need for new component
```

### Utility Function Protocol
Before creating any utility function:
```
1. Search for existing utilities with similar purpose
2. Check common utility files or helpers
3. Look for similar functions that could be extended
4. Verify implementation patterns from other utilities
5. Only create after confirming utility doesn't exist
```

## Memory and Context Management

### Working Memory Requirements
- Track all verified files and directories
- Maintain a list of confirmed functionality
- Record code patterns and conventions observed
- Keep recent search results accessible
- Document assumptions and verification steps

### Knowledge Persistence
- Document discoveries and verifications in comments
- Create reference notes for complex structures
- Build a mental model of the codebase incrementally
- Prefer verified information over assumptions
- Update understanding when new information is found

## Anti-Hallucination Checklist

Before implementing any solution, verify:
- [ ] All referenced files have been confirmed to exist
- [ ] Directory structure has been verified
- [ ] Existence of similar functionality has been checked
- [ ] Code patterns have been confirmed from multiple examples
- [ ] Dependencies and imports have been verified
- [ ] Naming conventions have been checked against actual code
- [ ] No duplicate files or functionality are being created
- [ ] Assumed knowledge has been clearly distinguished from verified facts
- [ ] Suggested tools and libraries exist in the project
- [ ] Implementation follows existing patterns 