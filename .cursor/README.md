# Cursor AI Rules and Configuration

This directory contains configurations and rules that govern how Cursor AI assists with this project. These rules are designed to ensure that all code changes, suggestions, and assistance provided by Cursor AI align with the project's coding standards and best practices.

## Structure

- **config.json**: Main configuration file for Cursor AI
- **ai_instructions.md**: Global AI instructions for interpreting and applying rules
- **rules/**: Directory containing detailed rule sets
  - **hallucination-prevention.md**: Guidelines to prevent AI hallucination
  - **file-organization-guidelines.md**: Guidelines for file structure and organization
  - **clean-code-guidelines.md**: Guidelines for writing clean, maintainable code
  - **code-quality-standards.md**: Standards for ensuring high-quality code
  - **programming-style.md**: Consistent styling conventions
  - **comprehensive-documentation.md**: Detailed documentation requirements
  - **development-workflow.md**: Guidelines for the development process
  - **memory-management.md**: Guidelines for bug tracking and knowledge persistence
  - **web-search-and-mcp-tools.md**: Guidelines for web search and MCP tools usage
  - **code-review-checklist.md**: Items to check during code reviews
  - **documentation-requirements.md**: Guidelines for code documentation
  - **wsl-command-guidelines.md**: Guidelines for using Ubuntu WSL commands on Windows 11

## Critical Rules

1. **Hallucination Prevention**: The AI must verify files exist before referencing them and search the codebase before creating new components.

2. **File Organization**: All files must be under 500 lines, and the AI must never create duplicate files or functionality.

3. **Documentation Requirements**: Comprehensive documentation is required for all components following specific templates.

4. **Development Workflow**: Complete PRDs must be created before implementation, and progress must be tracked and documented.

5. **Memory Management**: Bugs and fixes must be thoroughly documented, and the AI should reference previous bugs and solutions.

6. **Web Search and Research**: The AI must use web search when encountering errors and for API documentation, and utilize MCP tools for complex research.

## Environment

This project is developed on Windows 11 but uses Ubuntu WSL for terminal commands. All terminal operations should follow the WSL command guidelines to ensure consistency across the team.

## Using Cursor with These Rules

Cursor AI will automatically reference these rules when:

1. Providing code suggestions
2. Generating new code
3. Modifying existing code
4. Answering questions about best practices
5. Performing code reviews
6. Executing terminal commands
7. Creating documentation
8. Planning feature implementation
9. Fixing bugs
10. Refactoring code
11. Researching errors and solutions
12. Implementing API integrations

## Preventing Hallucination and Duplication

One of the main focuses of these rules is to prevent the AI from:
- Creating duplicate files or functionality
- Referencing files that don't exist
- Making assumptions about project structure without verification
- Creating files larger than 500 lines
- Implementing functionality without proper documentation

The AI is required to verify file existence before making changes and to search for similar functionality before creating new components.

## Documentation and Memory System

These rules establish:
- A comprehensive documentation system for all code components
- A bug tracking and memory system to document fixes
- A pattern recognition system to identify recurring solutions
- A decision record system to document architectural choices
- Requirements for PRDs before implementing features

## Web Search and Research Protocol

The AI will use web search and MCP tools to:
- Research solutions for encountered errors with exact error messages
- Find and reference official API documentation before implementation
- Verify solutions from multiple reliable sources
- Document all findings with proper attribution
- Follow best practices for the specific platform or API
- Utilize appropriate MCP tools for complex problems

## How to Update Rules

When project standards change, you should update these rule files to keep Cursor AI in sync with your team's expectations:

1. Edit the relevant Markdown files in the `rules/` directory
2. If adding new rule files, update the `referencePaths` array in `config.json`
3. Update the priority order in `ai_instructions.md` if needed

## Rule Enforcement

The rules defined here are guidelines for Cursor AI and may not be automatically enforced at runtime. Pairing these Cursor rules with appropriate linting tools, testing frameworks, and CI/CD pipelines will create a comprehensive quality assurance system.

## Benefits of These Rules

- Ensures consistent code quality across the team
- Prevents duplication and file bloat
- Reduces review iterations and feedback cycles
- Automates adherence to project standards
- Makes onboarding easier for new team members
- Provides a single source of truth for project standards
- Establishes comprehensive documentation practices
- Creates a system for knowledge persistence
- Ensures proper error resolution through web research
- Promotes best practices for API implementations 