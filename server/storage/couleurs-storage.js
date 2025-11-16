// server/storage/couleurs-storage.js
import path from "path";
import { promises as fs } from "fs";

const DATA_DIR = path.join(process.cwd(), "server", "storage", "data");

// Fichiers JSON à charger
const FILES = {
  essentiel: "essentiel.json",
  universelle: "universelle.json",
  iconique: "iconique.json",
};

class CouleursStorage {
  constructor() {
    this.couleurs = [];
    this.categories = [];
    this.initialized = false;
  }

  // Charge un fichier JSON et applique une catégorie à chaque couleur
  async loadJsonFile(filename, categorie) {
    const filePath = path.join(DATA_DIR, filename);
    const raw = await fs.readFile(filePath, "utf-8");
    const json = JSON.parse(raw);

    // 🏷 Ajoute la catégorie à chaque couleur
    return json.map((c, i) => ({
      id: `${categorie}-${i + 1}`,
      categorie,
      ...c,
    }));
  }

  async initialize() {
    if (this.initialized) return;

    try {
      const essentiel = await this.loadJsonFile(FILES.essentiel, "essentiel");
      const universelle = await this.loadJsonFile(FILES.universelle, "universelle");
      const iconique = await this.loadJsonFile(FILES.iconique, "iconique");

      // Fusion de toutes les couleurs
      this.couleurs = [...essentiel, ...universelle, ...iconique];

      // Liste des catégories + nombre de couleurs
      this.categories = [
        { id: "essentiel", name: "Essentiel", count: essentiel.length },
        { id: "universelle", name: "Universelle", count: universelle.length },
        { id: "iconique", name: "Iconique", count: iconique.length },
      ];

      console.log("✔ Couleurs chargées :", this.couleurs.length);

      this.initialized = true;
    } catch (err) {
      console.error("❌ ERREUR chargement couleurs :", err);
      throw err;
    }
  }

  getAll() {
    return this.couleurs;
  }

  getCategories() {
    return this.categories;
  }

  getByCategorie(cat) {
    return this.couleurs.filter((x) => x.categorie === cat);
  }

  getById(id) {
    return this.couleurs.find((x) => x.id === id);
  }

  search(query) {
    const q = query.toLowerCase();
    return this.couleurs.filter(
      (c) =>
        c.nom?.toLowerCase().includes(q) ||
        c.hex?.toLowerCase().includes(q) ||
        c.categorie?.toLowerCase().includes(q)
    );
  }
}

export const couleursStorage = new CouleursStorage();
