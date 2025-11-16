import { Hono } from "hono";
import { cors } from "hono/cors";
import { trpcServer } from "@hono/trpc-server";
import { appRouter } from "./app-router.js";
import { createContext } from "./create-context.js";
import superjson from "superjson";

const app = new Hono();

// --- CORS obligatoire (sinon erreurs dans la console OVH) ---
app.use(
  "*",
  cors({
    origin: "*",
    allowMethods: ["GET", "POST", "OPTIONS"],
    allowHeaders: ["content-type", "x-session-id"],
  })
);

// --- TRPC mounted correctly ---
app.use(
  "/api/trpc/*",
  trpcServer({
    router: appRouter,
    createContext,
    transformer: superjson,
  })
);

// Route de test
app.get("/", (c) => c.text("🔥 Backend TRPC + Hono OK"));

export default app;
