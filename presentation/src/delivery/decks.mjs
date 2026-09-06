/** Delivery metadata is declarative; the bundler contains no topic-specific logic. */
export const deliveries = [
  {
    id: "bonds-foundations",
    title: "Fundamentos de los bonos",
    entry: "src/offline.tsx",
    page: "dist/index.html",
    file: "fundamentos-bonos.html",
    assets: {
      OFFLINE_SKYLINE: {
        path: "public/assets/financial-skyline.webp",
        mime: "image/webp",
      },
    },
  },
  {
    id: "regression-intro",
    title: "Del dato a una predicción",
    entry: "src/decks/regression/offline.tsx",
    page: "dist/regression/index.html",
    file: "regresion-visual.html",
    assets: {},
  },
];
