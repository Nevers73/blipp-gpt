import { Hono } from "hono";
import { cors } from "hono/cors";
import { trpcServer } from "@hono/trpc-server";
import { appRouter } from "./trpc/app-router.js";
import { createContext } from "./trpc/create-context.js";
import superjson from "superjson";

const app = new Hono();

// --- CORS GLOBAL ---
app.use(
  "*",
  cors({
    origin: "*",
    allowMethods: ["GET", "POST", "OPTIONS"],
    allowHeaders: ["content-type", "x-session-id"],
  })
);

// --- TRPC MOUNTED ON /api ---
app.use(
  "/api/*",
  trpcServer({
    router: appRouter,
    createContext,
    transformer: superjson,
  })
);

// Route de test
app.get("/", (c) => c.text("🔥 Backend TRPC + Hono OK"));

export default app;
