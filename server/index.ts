import express from "express";
import { createServer } from "http";
import { setupAuth } from "./replit_integrations/auth/index.js";
import { registerObjectStorageRoutes } from "./replit_integrations/object_storage/index.js";
import { registerAdminAuthRoutes } from "./adminAuth.js";
import { registerRoutes } from "./routes.js";

const app = express();
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: false }));

async function main() {
  await setupAuth(app);
  registerAdminAuthRoutes(app);
  registerObjectStorageRoutes(app);
  registerRoutes(app);

  const server = createServer(app);
  const PORT = parseInt(process.env.PORT || "5001");
  server.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

main().catch(console.error);
