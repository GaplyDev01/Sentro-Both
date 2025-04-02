# Web Search and MCP Tools Guidelines

## Web Search for Error Resolution

### Error Resolution Protocol
When encountering an error or exception:
```
1. First attempt to understand the error from the context and codebase
2. Use web_search with the exact error message and technology stack
3. Search for common solutions and best practices
4. Verify solutions against current codebase
5. Apply fixes with proper attribution to sources
```

### Search Term Construction
- Include exact error messages in quotes
- Add relevant technology versions
- Include platform-specific terms (e.g., "Windows 11", "Ubuntu WSL")
- Filter out application-specific data from error messages
- Use multiple searches to narrow down the issue

### Solution Verification
- Compare multiple sources to confirm validity of solutions
- Prioritize official documentation and recent posts
- Verify compatibility with project dependencies
- Test solutions in isolation when possible
- Document the source of the fix in comments

## API Documentation Search

### API Documentation Protocol
Before implementing API calls:
```
1. Search for official API documentation using web_search
2. Verify correct API versions matching project dependencies
3. Find platform-specific examples relevant to the project
4. Check for rate limits, authentication requirements, and best practices
5. Document API usage patterns with links to official resources
```

### API Call Implementation
- Always follow official documentation for endpoint structure
- Use platform-specific client libraries when available
- Include proper error handling for API responses
- Add retry logic for transient failures
- Log API request/response in development environments
- Document expected response formats

### API Research Approach
- Use precise search terms including API name and version
- Search for "[API name] + [platform/language] + examples"
- Look for official SDKs and client libraries
- Research common pitfalls and workarounds
- Find community-accepted best practices

## MCP Tools Usage

### MCP Function Calls
- Use `mcp_perplexity_deep_research_deep_research` for comprehensive research on complex topics
- Use `mcp_brave_search_brave_web_search` for general information gathering
- Use `mcp_brave_search_brave_local_search` for location-specific searches
- Use `mcp_sequential_thinking_sequentialthinking` to break down complex problems
- Use `mcp_think_think` to process complex information

### MCP Tools Protocol
Before implementing solutions:
```
1. Use appropriate MCP tools to research best practices
2. Verify information from multiple sources
3. Document findings in comments with sources
4. Apply research findings to implementation
5. Validate implementation against research
```

### MCP Tool Selection Guidelines
- For deep technical understanding: Use `mcp_perplexity_deep_research_deep_research`
- For general web information: Use `mcp_brave_search_brave_web_search`
- For complex reasoning: Use `mcp_sequential_thinking_sequentialthinking`
- For analyzing large code blocks: Use `mcp_think_think`
- For multi-step solutions: Combine tools as needed

### Research Documentation
- Document all web search findings in comments
- Include URLs to reference materials when possible
- Explain how findings influenced implementation decisions
- Note alternatives considered and why they were rejected
- Document any limitations or caveats of the implemented solution

## Web Search Best Practices

### Search Prioritization
- Official documentation > Community forums > Blog posts > Social media
- Recent content > Older content (especially for rapidly evolving technologies)
- Specific platform/version matches > Generic solutions
- Confirmed fixes > Workarounds > Hacks

### Handling Conflicting Information
- Prioritize multiple sources with the same solution
- Test solutions in isolation when possible
- Verify compatibility with project structure
- Document why a particular approach was chosen
- Note alternative approaches in comments

## Documentation of External Resources

### Resource Reference Format
Include in comments:
```
/* 
 * Reference: [Brief description]
 * Source: [URL]
 * Date Accessed: YYYY-MM-DD
 * Key Points:
 * - [Point 1]
 * - [Point 2]
 */
```

### Code Attribution
When code is adapted from external sources:
```
/* 
 * Adapted from: [Source name/URL]
 * Original: [Brief description of original code]
 * Changes: [Description of modifications made]
 * Reason: [Why this approach was chosen]
 */
``` 