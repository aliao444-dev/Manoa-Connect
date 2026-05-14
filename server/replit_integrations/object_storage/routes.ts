import type { Express } from "express";

export function registerObjectStorageRoutes(app: Express): void {
  app.post("/api/uploads/request-url", (_req, res) => {
    res.status(503).json({ error: "File uploads are not configured on this deployment" });
  });

  app.get(/^\/objects\/(.+)/, (_req, res) => {
    res.status(503).json({ error: "Object storage is not configured on this deployment" });
  });
}
