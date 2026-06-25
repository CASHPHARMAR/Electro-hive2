import express from "express";
import serverless from "serverless-http";
import { registerAdminAuthRoutes } from "../../server/adminAuth.js";
import { registerRoutes } from "../../server/routes.js";

const app = express();
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: false, limit: "50mb" }));
app.set("trust proxy", 1);

registerAdminAuthRoutes(app);
registerRoutes(app);

export const handler = serverless(app);
