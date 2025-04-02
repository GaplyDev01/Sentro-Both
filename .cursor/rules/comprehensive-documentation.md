# Comprehensive Documentation Guidelines

## Documentation Structure

### Required Documentation Files
Every project must include:
- `README.md` - Overview and getting started guide
- `ARCHITECTURE.md` - System architecture and data flow
- `API.md` - API documentation (if applicable)
- `/docs` directory with:
  - `/docs/prd/` - Product requirements documents
  - `/docs/adr/` - Architecture decision records
  - `/docs/guides/` - User and developer guides
  - `/docs/maintenance/` - Operational guides

### Component Documentation
Every component directory must include:
- `README.md` explaining the component's purpose and usage
- Comments in code following language-specific best practices
- Unit test explanations describing test cases

## Documentation Requirements by Type

### Code-Level Documentation
- **Functions/Methods**: Document purpose, parameters, return values, and exceptions
- **Classes**: Document purpose, properties, methods, and usage examples
- **Components**: Document props, state, and lifecycle behavior
- **Modules**: Document exports, dependencies, and usage patterns
- **Configuration**: Document all options, default values, and constraints

### System-Level Documentation
- **Architecture**: Document system components, interactions, and data flow
- **Data Models**: Document database schema, object models, and relationships
- **APIs**: Document endpoints, request/response formats, and authentication
- **Workflows**: Document business processes and user journeys
- **Integration Points**: Document external system dependencies and interfaces

### Operational Documentation
- **Setup**: Document environment setup, prerequisites, and configuration
- **Deployment**: Document deployment process and environments
- **Monitoring**: Document metrics, alerts, and troubleshooting steps
- **Maintenance**: Document regular maintenance tasks and procedures
- **Recovery**: Document backup/restore procedures and disaster recovery

## Documentation Completeness

### Required Documentation Elements
Every feature must have:
1. PRD with requirements and acceptance criteria
2. Code comments explaining complex logic
3. Component documentation with usage examples
4. Test coverage explanation
5. API documentation (if applicable)

### Documentation Verification Checklist
Before considering any feature complete, verify:
- [ ] PRD exists and is complete
- [ ] Code is thoroughly commented
- [ ] README files exist at appropriate levels
- [ ] API endpoints are documented
- [ ] Examples are provided for complex components
- [ ] Test scenarios are documented
- [ ] Diagrams exist for complex flows

## Documentation Standards

### Markdown Formatting
- Use proper headings (# for title, ## for sections, etc.)
- Use bullet points for lists
- Use code blocks for code examples
- Use tables for structured data
- Use emphasis and links appropriately

### Code Comments
- Add comments for "why" not "what"
- Document unexpected behavior or edge cases
- Explain complex algorithms with step-by-step comments
- Include references to relevant documentation
- Use JSDoc, docstrings, or similar language-specific standards

### Diagrams
- Include system diagrams for complex interactions
- Use sequence diagrams for multi-step processes
- Use flow charts for decision logic
- Use entity-relationship diagrams for data models
- Store diagrams as code (e.g., Mermaid, PlantUML) when possible

## Documentation Maintenance

### Update Triggers
Documentation must be updated when:
- A new feature is added
- An existing feature is modified
- A bug is fixed that changes behavior
- An API contract changes
- The system architecture changes

### Documentation Review Process
- Review documentation changes alongside code changes
- Verify documentation accuracy periodically
- Update outdated documentation proactively
- Archive obsolete documentation
- Reference version numbers in documentation when applicable

## Platform-Specific Documentation

### Component Mapping
- Document the purpose of each component in the system
- Map components to requirements
- Document component relationships and dependencies
- Maintain a component registry

### Feature Documentation
For each feature, document:
```
# Feature: [Feature Name]

## Purpose
What problem does this feature solve?

## User Interaction
How do users interact with this feature?

## Technical Implementation
How is this feature implemented at a high level?

## Components
- Component 1: [Description and purpose]
- Component 2: [Description and purpose]
...

## Data Flow
1. Step 1 of the data flow
2. Step 2 of the data flow
...

## Configuration
Any configuration options for this feature

## Limitations
Known limitations or constraints

## Future Enhancements
Planned improvements or extensions
```

### API Documentation Template
For each API endpoint:
```
## [HTTP Method] [Path]

**Purpose**: Description of what this endpoint does

**Authorization Required**: Yes/No

**Request Parameters**:
- `param1` (type): Description [required/optional]
- `param2` (type): Description [required/optional]
...

**Request Body**:
```json
{
  "field1": "example value",
  "field2": 123
}
```

**Response**:
```json
{
  "result": "success",
  "data": {
    "id": 123,
    "name": "Example"
  }
}
```

**Error Codes**:
- `400`: Invalid request parameters
- `401`: Unauthorized
- `404`: Resource not found
- `500`: Internal server error
...

**Examples**:
[Include curl or code examples]
``` 