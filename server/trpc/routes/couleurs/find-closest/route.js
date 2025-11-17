import { publicProcedure } from "../../../create-context.js";
import { z } from "zod";
import fs from "fs";
import path from "path";

// Chemin vers nuances.json
const nuancesPath = path.join(process.cwd(), "server/data/nuances.json");
const nuances = JSON.parse(fs.readFileSync(nuancesPath, "utf8"));

/* ---------------------------
   RGB → Lab
---------------------------- */
function rgbToLab(r, g, b) {
  r /= 255; g /= 255; b /= 255;

  r = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
  g = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
  b = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;

  const x = (r * 0.4124564 + g * 0.3575761 + b * 0.1804375) / 0.95047;
  const y = (r * 0.2126729 + g * 0.7151522 + b * 0.0721750);
  const z = (r * 0.0193339 + g * 0.1191920 + b * 0.9503041) / 1.08883;

  const fx = x > 0.008856 ? Math.cbrt(x) : (7.787 * x) + 16/116;
  const fy = y > 0.008856 ? Math.cbrt(y) : (7.787 * y) + 16/116;
  const fz = z > 0.008856 ? Math.cbrt(z) : (7.787 * z) + 16/116;

  return {
    L: (116 * fy) - 16,
    A: 500 * (fx - fy),
    B: 200 * (fy - fz)
  };
}

/* ---------------------------
   DeltaE 76
---------------------------- */
function deltaE(lab1, lab2) {
  return Math.sqrt(
    (lab1.L - lab2.L) ** 2 +
    (lab1.A - lab2.A) ** 2 +
    (lab1.B - lab2.B) ** 2
  );
}

/* ---------------------------
   FIND CLOSEST — TOP 3
---------------------------- */
export const findClosestCouleur = publicProcedure
  .input(z.object({ hex: z.string() }))
  .query(async ({ input }) => {

    // Nettoyage HEX
    let hexClean = input.hex.replace("#", "").trim();
    if (hexClean.length !== 6) return { couleurs: [] };

    const r = parseInt(hexClean.substring(0, 2), 16);
    const g = parseInt(hexClean.substring(2, 4), 16);
    const b = parseInt(hexClean.substring(4, 6), 16);

    const scannedLab = rgbToLab(r, g, b);

    // Liste des distances
    const distances = nuances.map((nuance) => {
      const lab = {
        L: nuance.lab_l,
        A: nuance.lab_a,
        B: nuance.lab_b
      };

      return {
        ...nuance,
        delta: deltaE(scannedLab, lab)
      };
    });

    // Tri par similarité
    const sorted = distances.sort((a, b) => a.delta - b.delta);

    // Top 3
    return {
      couleurs: sorted.slice(0, 3)
    };
  });
