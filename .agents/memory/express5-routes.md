---
name: Express 5 wildcard routes
description: Express 5 changed how wildcard routes are defined — old syntax causes PathError crashes
---
Express 5 uses `{*param}` for catch-all routes. The old patterns no longer work:
- WRONG: `app.get('/objects/*', ...)` → "Missing parameter name"
- WRONG: `app.get('/objects/:path(*)', ...)` → "Unexpected ("
- CORRECT: `app.get('/objects/{*path}', ...)` ✓

**Why:** Express 5 upgraded path-to-regexp which is stricter about route patterns.
**How to apply:** Whenever writing wildcard/catch-all Express routes in this project (which uses express@5).
