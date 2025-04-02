# Memory Management and Bug Tracking

## Bug Memory System

### Bug Documentation Repository
- All identified bugs must be documented in `/docs/bugs/` directory
- Create a separate markdown file for each significant bug
- Use naming convention: `YYYY-MM-DD-short-bug-description.md`
- Tag bugs with categories for easy reference

### Bug Documentation Format
```
# Bug: [Bug Title]

## Date Identified
YYYY-MM-DD

## Status
[Open/Fixed/Won't Fix]

## Severity
[Critical/High/Medium/Low]

## Affected Components
- Component 1
- Component 2

## Description
Detailed description of the bug

## Reproduction Steps
1. Step 1
2. Step 2
...

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Root Cause Analysis
Explanation of what caused the bug

## Fix Implementation
How the bug was fixed, including code changes

## Prevention Strategy
How to prevent similar bugs in the future

## Related Issues
Links to related bugs or issues
```

### Bug Category Index
- Maintain a `bug-index.md` file categorizing all bugs
- Group bugs by component, severity, and root cause patterns
- Include links to individual bug reports
- Update index when new bugs are added or statuses change

## Knowledge Persistence

### Pattern Recognition Repository
- Document recurring patterns in `/docs/patterns/`
- Include both positive patterns to follow and anti-patterns to avoid
- Link patterns to concrete examples in the codebase
- Update patterns as the codebase evolves

### Pattern Documentation Format
```
# Pattern: [Pattern Name]

## Type
[Design Pattern/Anti-Pattern/Implementation Pattern]

## Context
When and where this pattern applies

## Problem
What problem this pattern addresses

## Solution
How the pattern solves the problem

## Implementation
How to implement this pattern with code examples

## Consequences
Benefits and tradeoffs of using this pattern

## Examples in Codebase
- File 1: [Description]
- File 2: [Description]
```

### Decision Record Repository
- Document architectural decisions in `/docs/adr/`
- Use ADR (Architecture Decision Record) format
- Number ADRs sequentially
- Cross-reference ADRs with affected components

### Decision Record Format
```
# ADR-NNN: [Title]

## Date
YYYY-MM-DD

## Status
[Proposed/Accepted/Deprecated/Superseded]

## Context
What is the issue that we're seeing that is motivating this decision or change?

## Decision
What is the change that we're proposing and/or doing?

## Consequences
What becomes easier or more difficult to do because of this change?

## Alternatives Considered
What other approaches were considered and why were they rejected?

## Implementation
How should this decision be implemented?
```

## Active Memory Management

### Session Memory Requirements
During each development session:
- Reference relevant bug reports from previous sessions
- Review patterns applicable to current task
- Check ADRs related to components being modified
- Document new insights as they emerge

### Memory Refresh Protocol
Before starting work on any component:
```
1. Review bug history for the component
2. Check patterns relevant to the component
3. Examine ADRs affecting the component
4. Look at recent changes to the component
5. Understand dependencies and interfaces
```

### Component Context Building
For each component:
- Document core responsibilities and boundaries
- List known issues and quirks
- Identify performance considerations
- Note testing requirements
- Link to related components and dependencies

## Long-Term Knowledge Management

### Codebase Evolution History
- Maintain a chronological record of significant changes
- Document major refactorings and their motivations
- Track API changes and deprecations
- Note performance improvements and their impacts

### Technical Debt Registry
- Document known technical debt in `/docs/tech-debt/`
- Prioritize debt items by impact and effort
- Include proposed remediation strategies
- Update when debt is addressed or created

### Technical Debt Entry Format
```
# Technical Debt: [Description]

## Location
Files or components affected

## Nature of Debt
What compromise was made and why

## Impact
How this debt affects development, performance, or maintenance

## Remediation Strategy
How this could be fixed properly

## Priority
[High/Medium/Low]

## Estimated Effort
[Large/Medium/Small]
```

## Bug Prevention System

### Common Bug Patterns
- Document recurring bug patterns and prevention tactics
- Link similar bugs to identify systemic issues
- Create checklists for bug-prone areas
- Develop automated tests targeting common bug classes

### Pre-Implementation Checklist
Before implementing new features:
- [ ] Review similar features for known issues
- [ ] Check edge cases and failure modes
- [ ] Identify potential race conditions or concurrency issues
- [ ] Consider input validation requirements
- [ ] Plan error handling strategy

### Post-Fix Verification
After fixing a bug:
- [ ] Document the fix completely
- [ ] Create tests verifying the fix
- [ ] Check similar code for the same issue
- [ ] Update related documentation
- [ ] Consider preventative measures for similar bugs 