---
name: ESM server imports need .js extension
description: When running TypeScript server with tsx/ESM (node --import tsx/esm), all local imports need .js extensions
---
This project runs the Express server with `node --import tsx/esm server/index.ts`.
All local relative imports in server code must use `.js` extensions:
- WRONG: `import { db } from "./db"` → ERR_MODULE_NOT_FOUND
- CORRECT: `import { db } from "./db.js"` ✓

Also: path aliases like `@shared/*` don't work with tsx/ESM — use relative paths like `../../../shared/models/auth.js`.

**Why:** Node ESM resolution doesn't rewrite extensions. tsx handles TS→JS but respects the import specifier literally.
**How to apply:** Any time server-side TypeScript files are added or modified in this project.
