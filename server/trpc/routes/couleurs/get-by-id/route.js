import { publicProcedure } from "../../../create-context.js";
import { z } from "zod";
import fs from "fs";
import path from "path";

const nuancesPath = path.join(process.cwd(), "server/data/nuances.json");
const nuances = JSON.parse(fs.readFileSync(nuancesPath, "utf8"));

export const getCouleurById = publicProcedure
  .input(z.object({ id: z.string() }))
  .query(async ({ input }) => {
    const idNum = Number(input.id);

    // Trouver la nuance avec son ID
    const found = nuances.find((n) => Number(n.id) === idNum);

    if (!found) {
      throw new Error("Couleur not found");
    }

    return {
      couleur: {
        id: String(found.id),
        nom: found["Nom BLiiP"],
        hex: found["Couleur HEX"],

        gouttesA: found["Gouttes A"] ?? 0,
        gouttesB: found["Gouttes B"] ?? 0,
        gouttesC: found["Gouttes C"] ?? 0,
        gouttesD: found["Gouttes D"] ?? 0,
        gouttesE: found["Gouttes E"] ?? 0,
        gouttesF: found["Gouttes F"] ?? 0,
        gouttesG: found["Gouttes G"] ?? 0,
        gouttesH: found["Gouttes H"] ?? 0,
        gouttesI: found["Gouttes I"] ?? 0,

        L: found.L,
        A: found.A,
        B: found.B,
      },
    };
  });
