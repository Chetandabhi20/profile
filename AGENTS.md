# Agent Rules — Project Mind Map Protocol

> **Every AI agent working on this project MUST follow these rules.**

---

## 1. The "Read-First" Protocol (Context Optimization)

- **Never** scan or read the entire codebase when asked an architectural, debugging, or feature-planning question.
- **Always** read `.antigravity_map.yaml` in the project root **first**.
- Identify the exact file path(s) relevant to the user's request from the YAML map, and **only read those specific files**.
- If `.antigravity_map.yaml` does not exist, immediately generate it by scanning the project's existing structure before proceeding with any user request.

## 2. The "Update-on-Write" Protocol (Agent-Managed Synchronization)

- Whenever you **create a new file**, **delete a file**, or **significantly refactor an existing file**, you are strictly required to update `.antigravity_map.yaml` as part of your task completion.
- Update the file summary in `.antigravity_map.yaml` to reflect the current state of the project before presenting your final answer or artifact to the user.
- Do not ask the user for permission to update the map; maintain it silently and autonomously in parallel with development.

---

## 3. The YAML Schema Standard (`.antigravity_map.yaml`)

Whenever you create or update the mind map, you **MUST** adhere strictly to the following YAML schema:

```yaml
project_name: "String (Name of the project or workspace)"
last_updated: "YYYY-MM-DD"
overview: "One-sentence high-level summary of the project architecture."

modules:
  - path: "relative/path/to/file.ext"
    purpose: "One-sentence explanation of what this file is responsible for."
    exports:
      - "MainClassOrFunction1"
      - "MainClassOrFunction2"
    dependencies:
      - "relative/path/to/dependency.ext"
```

### Field Definitions

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `project_name` | string | ✅ | Name of the project or workspace |
| `last_updated` | string | ✅ | Date of last map update (`YYYY-MM-DD`) |
| `overview` | string | ✅ | One-sentence high-level summary of the project |
| `modules` | list | ✅ | Array of all tracked files/modules |
| `modules[].path` | string | ✅ | Relative path from project root |
| `modules[].purpose` | string | ✅ | One-sentence explanation of the file's responsibility |
| `modules[].exports` | list | ✅ | Key exports (functions, classes, components). Use `[]` if none |
| `modules[].dependencies` | list | ✅ | Relative paths to files this module imports from. Use `[]` if none |

### Rules

- **Do not** include `node_modules/`, `dist/`, `.git/`, or other generated/ignored directories.
- **Do** include config files (`package.json`, `vite.config.js`, etc.) that are relevant to understanding the project.
- Keep `purpose` descriptions concise — one sentence max.
- Always update `last_updated` when modifying the map.
