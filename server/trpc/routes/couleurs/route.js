import { router } from "../../../create-context.js";

import { findClosestCouleur } from "./find-closest/route.js";
import { getCouleurById } from "./get-by-id/route.js";

export const couleursRouter = router({
  findClosest: findClosestCouleur,
  getById: getCouleurById,
});
