import express from "express";
import { createServer } from "http";
import { registerAdminAuthRoutes } from "./adminAuth.js";
import { registerRoutes } from "./routes.js";

const app = express();
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: false }));
app.set("trust proxy", 1);

registerAdminAuthRoutes(app);
registerRoutes(app);

const server = createServer(app);
const PORT = parseInt(process.env.PORT || "5001");
server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
