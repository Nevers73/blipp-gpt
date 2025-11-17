import { publicProcedure } from "../../../create-context.js";
import nuances from "../../../../data/nuances.json" assert { type: "json" };
import { z } from "zod";

export const getCouleurById = publicProcedure
  .input(
    z.object({
      id: z.union([z.string(), z.number()]),
    })
  )
  .query(({ input }) => {
    const idNum = Number(input.id);

    console.log("🔍 GET BY ID → reçu :", input.id, "→ converti :", idNum);

    const couleur = nuances.find((c) => Number(c.id) === idNum);

    if (!couleur) {
      console.log("❌ Aucune teinte trouvée pour ID :", idNum);
      throw new Error("Couleur not found");
    }

    return { couleur };
  });
