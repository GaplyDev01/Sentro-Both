# Cursor Rules

This directory contains rules and guidelines for Cursor IDE to follow when assisting with this project. These rules are derived from our project's clean code and code quality guidelines.

## Rule Categories

- [Hallucination Prevention](.cursor/rules/hallucination-prevention.md) - Guidelines to prevent AI hallucination
- [File Organization Guidelines](.cursor/rules/file-organization-guidelines.md) - Guidelines for file structure and organization
- [Clean Code Guidelines](.cursor/rules/clean-code-guidelines.md) - Rules for writing clean, maintainable code
- [Code Quality Standards](.cursor/rules/code-quality-standards.md) - Standards for ensuring high-quality code
- [Programming Style](.cursor/rules/programming-style.md) - Consistent styling conventions
- [Comprehensive Documentation](.cursor/rules/comprehensive-documentation.md) - Detailed documentation requirements
- [Development Workflow](.cursor/rules/development-workflow.md) - Guidelines for the development process
- [Memory Management](.cursor/rules/memory-management.md) - Guidelines for bug tracking and knowledge persistence
- [Web Search and MCP Tools](.cursor/rules/web-search-and-mcp-tools.md) - Guidelines for web search and MCP tools usage
- [Code Review Checklist](.cursor/rules/code-review-checklist.md) - Items to check during code reviews
- [Documentation Requirements](.cursor/rules/documentation-requirements.md) - Guidelines for code documentation
- [WSL Command Guidelines](.cursor/rules/wsl-command-guidelines.md) - Guidelines for using Ubuntu WSL on Windows 11

## Critical Rules

### Preventing Hallucination and Duplication
- Always verify files exist before referencing them
- Search for existing implementations before creating new ones
- Keep all files under 500 lines
- Never create duplicate files or functionality
- Follow established directory structures
- Create comprehensive documentation for all components

### Development Process Requirements
- Create complete PRDs before implementation
- Track progress and document status
- Document bugs and their fixes thoroughly
- Follow memory management protocols
- Reference previous bugs and solutions

### Error and API Handling
- Use web search for resolving errors with exact error messages
- Research official API documentation before implementation
- Document findings from web searches in comments with sources
- Verify solutions from multiple sources
- Utilize MCP tools for complex research and problem-solving

## Environment Requirements

- **Operating System**: Windows 11
- **Terminal Environment**: Ubuntu WSL
- **Path Conventions**: Use Linux path conventions for terminal commands, Windows path conventions for file references
- **File Size Limit**: Maximum 500 lines per file
- **Research Tools**: Use web search and MCP tools for error resolution and API research

## Global Guidance

All rules in this directory should be applied following the meta-instructions in [AI Instructions](../.cursor/ai_instructions.md). These meta-instructions explain how to interpret and prioritize rules when there are conflicts or ambiguities.

These rules should be followed when writing, modifying, or reviewing code in this project. 