import { Hono } from "hono";
import { trpcServer } from "@hono/trpc-server";
import { appRouter } from "./trpc/app-router.js";
import { createContext } from "./trpc/create-context.js";

const app = new Hono();

// Vérification simple
app.get("/", (c) => c.text("🚀 Hono + TRPC backend running !"));

// Route TRPC ✔️
app.use(
  "/api/trpc/*",
  trpcServer({
    router: appRouter,
    createContext,
  })
);

export default app;
