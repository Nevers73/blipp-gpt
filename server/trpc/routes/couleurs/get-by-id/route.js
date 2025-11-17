import { publicProcedure } from "../../../create-context.js";
import { z } from "zod";
import fs from "fs";
import path from "path";

const nuancesPath = path.join(process.cwd(), "server/data/nuances.json");
const nuances = JSON.parse(fs.readFileSync(nuancesPath, "utf8"));

export const getCouleurById = publicProcedure
  .input(z.object({ id: z.string() }))
  .query(async ({ input }) => {
    const index = Number(input.id) - 1; // 🧠 index dans le tableau

    const found = nuances[index];

    if (!found) {
      throw new Error("Couleur not found");
    }

    return {
      couleur: {
        id: input.id, // on renvoie l’ID virtuel
        nom: found["Nom BLiiP"],
        hex: found["Couleur HEX"],
        ...found, // retourne toutes les gouttes
      },
    };
  });
