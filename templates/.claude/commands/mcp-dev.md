# /mcp-dev — Develop MCP Server Tools

Build and test MCP server endpoints and tools.

## Usage

```
/mcp-dev [tool or server description]
```

## Process

1. **Design** tool interface (name, description, input schema)
2. **Implement** server with @modelcontextprotocol/sdk
3. **Validate** inputs with Zod schemas
4. **Test** tool handlers with unit tests
5. **Integration test** protocol communication
6. **Review** security and error handling
