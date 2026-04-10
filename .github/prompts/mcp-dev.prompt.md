---
mode: agent
description: "Build MCP server tools with proper validation and testing"
tools:
  - read_file
  - create_file
  - replace_string_in_file
  - grep_search
  - file_search
  - run_in_terminal
  - manage_todo_list
---

# MCP Server Development Pipeline

Build and test an MCP server with tools, resources, and prompts.

## Instructions

1. **Design** — Define tool names, descriptions, and input schemas
2. **Scaffold** — Create server with @modelcontextprotocol/sdk
3. **Implement** — Build tool handlers with Zod validation
4. **Test** — Unit tests for each tool handler
5. **Integration Test** — Protocol communication tests
6. **Security** — No secrets in responses, rate limiting, input sanitization
7. **Document** — Tool descriptions, usage examples, configuration

Build MCP server: $input
