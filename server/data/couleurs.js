// Node.js — NE PAS UTILISER export

const essentiel = require("./essentiel.js");
const iconique = require("./iconique.js");
const universelle = require("./universelle.js");

// Fusion des 3 catégories avec leur nom
const couleursMock = [
  ...essentiel.map((c, i) => ({
    ...c,
    id: `E${i + 1}`,
    categorie: "essentiel"
  })),

  ...iconique.map((c, i) => ({
    ...c,
    id: `I${i + 1}`,
    categorie: "iconique"
  })),

  ...universelle.map((c, i) => ({
    ...c,
    id: `U${i + 1}`,
    categorie: "universelle"
  })),
];

module.exports = { couleursMock };
