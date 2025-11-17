import { publicProcedure } from "../../../create-context.js";
import { z } from "zod";
import fs from "fs";
import path from "path";

// Chemin vers nuances.json
const nuancesPath = path.join(process.cwd(), "server/data/nuances.json");
const nuances = JSON.parse(fs.readFileSync(nuancesPath, "utf8"));

/* ------------------------- LAB UTILS --------------------------*/
function rgbToLab(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  r = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
  g = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
  b = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;

  const x =
    (r * 0.4124564 +
      g * 0.3575761 +
      b * 0.1804375) /
    0.95047;
  const y = r * 0.2126729 + g * 0.7151522 + b * 0.072175;
  const z =
    (r * 0.0193339 +
      g * 0.119192 +
      b * 0.9503041) /
    1.08883;

  const fx = x > 0.008856 ? Math.cbrt(x) : (7.787 * x) + 16 / 116;
  const fy = y > 0.008856 ? Math.cbrt(y) : (7.787 * y) + 16 / 116;
  const fz = z > 0.008856 ? Math.cbrt(z) : (7.787 * z) + 16 / 116;

  return { L: 116 * fy - 16, A: 500 * (fx - fy), B: 200 * (fy - fz) };
}

function deltaE(l1, l2) {
  return Math.sqrt(
    (l1.L - l2.L) ** 2 +
    (l1.A - l2.A) ** 2 +
    (l1.B - l2.B) ** 2
  );
}

/* ---------------------------------------------------------
   🔥 GET COULEUR BY ID (fix Render)
----------------------------------------------------------*/
export const getCouleurById = publicProcedure
  .input(z.object({ id: z.number() }))
  .query(async ({ input }) => {
    const nuance = nuances[input.id - 1]; // index 0 → id 1
    if (!nuance) return { couleur: null };

    return {
      couleur: {
        id: input.id,
        hex: nuance["Couleur HEX"],
        nom: nuance["Nom BLiiP"],

        gouttesA: nuance["Gouttes A"] ?? 0,
        gouttesB: nuance["Gouttes B"] ?? 0,
        gouttesC: nuance["Gouttes C"] ?? 0,
        gouttesD: nuance["Gouttes D"] ?? 0,
        gouttesE: nuance["Gouttes E"] ?? 0,
        gouttesF: nuance["Gouttes F"] ?? 0,
        gouttesG: nuance["Gouttes G"] ?? 0,
        gouttesH: nuance["Gouttes H"] ?? 0,
        gouttesI: nuance["Gouttes I"] ?? 0,
      }
    };
  });

/* ---------------------------------------------------------
   🔥 FIND CLOSEST
----------------------------------------------------------*/
export const findClosestCouleur = publicProcedure
  .input(z.object({ hex: z.string() }))
  .query(async ({ input }) => {
    const hex = input.hex.replace("#", "");

    if (hex.length !== 6) return { couleurs: [] };

    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    const scanned = rgbToLab(r, g, b);

    const distances = nuances.map((nuance, index) => {
      const lab = {
        L: Number(nuance.L),
        A: Number(nuance.A),
        B: Number(nuance.B),
      };

      return {
        id: index + 1,
        nom: nuance["Nom BLiiP"],
        hex: nuance["Couleur HEX"],

        gouttesA: nuance["Gouttes A"] ?? 0,
        gouttesB: nuance["Gouttes B"] ?? 0,
        gouttesC: nuance["Gouttes C"] ?? 0,
        gouttesD: nuance["Gouttes D"] ?? 0,
        gouttesE: nuance["Gouttes E"] ?? 0,
        gouttesF: nuance["Gouttes F"] ?? 0,
        gouttesG: nuance["Gouttes G"] ?? 0,
        gouttesH: nuance["Gouttes H"] ?? 0,
        gouttesI: nuance["Gouttes I"] ?? 0,

        delta: deltaE(scanned, lab),
      };
    });

    distances.sort((a, b) => a.delta - b.delta);

    return { couleurs: distances.slice(0, 3) };
  });
