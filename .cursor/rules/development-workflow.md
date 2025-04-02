# Development Workflow Guidelines

## Product Requirements Documentation (PRD)

### PRD Creation Requirements
- Create a complete PRD before starting any implementation
- PRDs must be stored in the `/docs/prd/` directory
- Name PRDs clearly to indicate their scope (e.g., `user-authentication-flow.md`)
- All PRDs must be approved before implementation begins

### PRD Content Requirements
Every PRD must include:
```
# Feature Name

## Overview
Brief description of the feature and its purpose

## User Stories
- As a [user type], I want [goal] so that [benefit]
- ...

## Functional Requirements
1. Detailed description of each requirement
2. ...

## Technical Requirements
- Database schema changes
- API endpoints
- Service integrations
- ...

## Implementation Details
- Component structure
- Key algorithms
- Data flow
- ...

## Acceptance Criteria
- [ ] Criteria 1
- [ ] Criteria 2
- ...

## Dependencies
- Other features or systems this depends on
- ...

## Out of Scope
- What is explicitly not included
- ...
```

### PRD Validation
- Before starting implementation, verify the PRD is complete
- If the PRD is incomplete, complete it before proceeding
- Reference the specific PRD in commit messages and documentation

## Progress Tracking

### Work Breakdown
- Break down features into small, trackable tasks
- Keep task scope limited to 1-2 hours of work when possible
- Create clear milestones for larger features

### Implementation Status Documentation
- Document the current status in a `STATUS.md` file in the feature directory
- Update status after each significant implementation step
- Status levels: Not Started, In Progress, Ready for Review, Complete
- Include blockers and next steps in status updates

### Progress Recording Format
```
## [Feature Name] - [Date]
Status: [Current Status]

### Completed
- [Item 1]
- [Item 2]
...

### In Progress
- [Item 3] - [% complete]
...

### Blockers
- [Blocker 1]
...

### Next Steps
1. [Step 1]
2. [Step 2]
...
```

## Development Steps

### Planning Phase
1. Create detailed PRD
2. Break down into tasks
3. Identify dependencies
4. Create initial status document

### Implementation Phase
1. Start with the minimal viable implementation
2. Implement one task at a time
3. Update progress documentation after each task
4. Write tests alongside implementation
5. Document code as it is written

### Review Phase
1. Self-review against PRD requirements
2. Verify all acceptance criteria are met
3. Ensure documentation is complete
4. Run all tests
5. Update status to Ready for Review

## Memory Management

### Bug Tracking
- Document all bugs in a dedicated `BUGS.md` file
- Include reproduction steps, root cause, and fix details
- Reference related code files and PRD requirements

### Bug Documentation Format
```
## [Bug Title] - [Date]

### Description
Brief description of the bug

### Reproduction Steps
1. Step 1
2. Step 2
...

### Root Cause
Explanation of what caused the bug

### Fix Implementation
How the bug was fixed, including code changes

### Prevention Strategy
How to prevent similar bugs in the future
```

### Knowledge Preservation
- When discovering a pattern or solution, document it in a shared knowledge base
- For complex implementations, create a `DECISIONS.md` file explaining architectural choices
- Reference previous bugs and solutions when implementing similar features 