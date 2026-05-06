// src/productsData.js

export const PRODUCTS = [
    {
        id: "classic",
        name: "IDEAL. Sunglasses",
        label: "Classic Black",
        accent: "variant-classic",
        gradient:
            "radial-gradient(circle at top, #2b2b2b 0%, #050505 55%, #000000 100%)",
        price: 149,
        compareAt: 199,
        rating: 4.8,
        reviews: 312,
        bullets: [
            "UV400 · 100% UVA/UVB",
            "Triple AR · anti-glare coating",
            "48g · feather-weight frame",
            "Premium hinge · durable feel",
        ],
        images: ["/angles-front.png", "/comparison-base2.png", "/comparison-base1.png"],
        suggestionImage: "/angles-front.png",
        suggestionDesc: "Clean everyday silhouette with deep contrast optics.",
        productTitle: "Classic Black",
        productTagline: "Clean everyday silhouette with deep contrast optics.",
        detailTitle: "Classic everyday clarity",
        detailDesc:
            "A balanced everyday frame with deep contrast optics, clean silhouette, and a timeless all-black finish.",
    },
    {
        id: "desert",
        name: "IDEAL. Sunglasses",
        label: "Desert Sand",
        accent: "variant-desert",
        gradient:
            "radial-gradient(circle at top, #775231 0%, #8a5b32 45%, #120805 100%)",
        price: 149,
        compareAt: 199,
        rating: 4.8,
        reviews: 312,
        bullets: [
            "UV400 · 100% UVA/UVB",
            "Triple AR · anti-glare coating",
            "48g · feather-weight frame",
            "Premium hinge · durable feel",
        ],
        images: ["/comparison-base2.png", "/angles-front.png", "/comparison-base1.png"],
        suggestionImage: "/comparison-base2.png",
        suggestionDesc: "Warm matte finish with a softer premium feel.",
        productTitle: "Desert Sand",
        productTagline: "Warm matte finish with a softer premium feel.",
        detailTitle: "Warm premium finish",
        detailDesc:
            "A softer warm-tone finish designed for a refined premium look with balanced comfort and light control.",
    },
    {
        id: "night",
        name: "IDEAL. Sunglasses",
        label: "Night Drive",
        accent: "variant-night",
        gradient:
            "radial-gradient(circle at top, #4b3b88 0%, #141325 50%, #050308 100%)",
        price: 149,
        compareAt: 199,
        rating: 4.8,
        reviews: 312,
        bullets: [
            "UV400 · 100% UVA/UVB",
            "Triple AR · anti-glare coating",
            "48g · feather-weight frame",
            "Premium hinge · durable feel",
        ],
        images: ["/comparison-base1.png", "/comparison-base2.png", "/angles-front.png"],
        suggestionImage: "/comparison-base1.png",
        suggestionDesc: "Optimized tint for low-light clarity and comfort.",
        productTitle: "Night Drive",
        productTagline: "Optimized tint for low-light clarity and comfort.",
        detailTitle: "Low-light precision",
        detailDesc:
            "Built for evening sessions and night driving with tuned tint, reduced glare, and more comfortable low-light vision.",
    },
];