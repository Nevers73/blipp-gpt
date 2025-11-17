import { Hono } from "hono";
import { cors } from "hono/cors";
import { trpcServer } from "@hono/trpc-server";
import { appRouter } from "./trpc/app-router.js";
import { createContext } from "./trpc/create-context.js";
import superjson from "superjson";

const app = new Hono();

// --- CORS GLOBAL (FULLY FIXED FOR EXPO + TRPC + RENDER) ---
app.use(
  "*",
  cors({
    origin: "*", // autoriser toutes les origines
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: [
      "content-type",
      "authorization",
      "x-session-id",
      "x-trpc-source",
    ],
    exposeHeaders: ["content-type"],
    maxAge: 86400,
  })
);

// --- TRPC SUR /api ---
app.use(
  "/api/*",
  trpcServer({
    router: appRouter,
    createContext,
    transformer: superjson,
  })
);

// Test endpoint
app.get("/", (c) => c.text("🔥 Backend TRPC + Hono OK"));

export default app;
