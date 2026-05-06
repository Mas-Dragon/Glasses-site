// src/Product.js
import React, { useMemo, useState, useEffect } from "react";
import { Link, useLocation, useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import "./App.css";
import { useCart } from "./CartContext";
import { PRODUCTS } from "./productsData";

export default function Product() {
    const { addItem, count } = useCart();
    const location = useLocation();
    const navigate = useNavigate();
    const { productId } = useParams();

    const selectedAngle = location.state?.selectedAngle || null;

    const initialProductIndex = useMemo(() => {
        const foundIndex = PRODUCTS.findIndex((p) => p.id === productId);
        return foundIndex >= 0 ? foundIndex : 0;
    }, [productId]);

    const [variantIndex, setVariantIndex] = useState(initialProductIndex);
    const [activeImage, setActiveImage] = useState(0);

    useEffect(() => {
        const foundIndex = PRODUCTS.findIndex((p) => p.id === productId);
        setVariantIndex(foundIndex >= 0 ? foundIndex : 0);
        setActiveImage(0);
    }, [productId]);

    const product = PRODUCTS[variantIndex];

    const dynamicTitle =
        selectedAngle?.productTitle || product.productTitle || product.name;

    const dynamicTagline =
        selectedAngle?.productTagline || product.productTagline || product.name;

    const dynamicMainImage = selectedAngle?.img || product.images[activeImage];

    const dynamicSectionTitle =
        selectedAngle?.title || product.detailTitle || "What you feel";

    const dynamicSectionDesc =
        selectedAngle?.desc ||
        product.detailDesc ||
        "Matte finish, balanced fit, and a lens coating tuned to reduce glare while keeping deep blacks and richer contrast.";

    const savings = useMemo(() => {
        return Math.max(0, product.compareAt - product.price);
    }, [product.compareAt, product.price]);

    const handleAddToCart = () => {
        addItem({
            id: `ideal-${product.id}`,
            title: product.name,
            variant: product.label,
            price: Number(product.price),
            image: product.images[0],
        });
    };

    const handleSuggestedView = (targetId) => {
        navigate(`/product/${targetId}`);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const thumbs = [
        dynamicMainImage,
        product.images[1],
        product.images[2],
    ];

    return (
        <div
            className={`page product-page ${product.accent}`}
            style={{ background: product.gradient }}
        >
            <header className="nav product-nav">
                <div className="container nav-inner">
                    <Link
                        to="/"
                        className="logo"
                        style={{ textDecoration: "none", color: "inherit" }}
                    >
                        IDEAL.
                    </Link>

                    <nav className="nav-links">
                        <Link to="/products">Products</Link>
                        <Link to="/specs">Specs</Link>
                        <a href="#details">Details</a>
                    </nav>

                    <Link to="/checkout" className="nav-cta cart-cta">
                        Pre-order
                        {count > 0 && <span className="cart-badge">{count}</span>}
                    </Link>
                </div>
            </header>

            <div className="tech-grid-overlay product-grid" />

            <main className="product-main">
                <div className="container product-shell">
                    <section className="product-gallery">
                        <div className="product-media glass-card">
                            <AnimatePresence mode="wait">
                                <motion.img
                                    key={`${product.id}-${activeImage}-${thumbs[activeImage]}`}
                                    src={thumbs[activeImage]}
                                    alt={dynamicTitle}
                                    className="product-hero-img"
                                    initial={{ opacity: 0, scale: 0.98, filter: "blur(10px)" }}
                                    animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                                    exit={{ opacity: 0, scale: 1.02, filter: "blur(10px)" }}
                                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                                />
                            </AnimatePresence>

                            <div className="product-glow" />
                        </div>

                        <div className="product-thumbs">
                            {thumbs.map((src, i) => (
                                <button
                                    key={src + i}
                                    className={`thumb ${i === activeImage ? "active" : ""}`}
                                    onClick={() => setActiveImage(i)}
                                    type="button"
                                    aria-label={`Open image ${i + 1}`}
                                >
                                    <img src={src} alt="" />
                                </button>
                            ))}
                        </div>

                        <div className="product-mini-specs">
                            {product.bullets.map((t) => (
                                <div key={t} className="mini-pill">
                                    <span className="mini-dot" />
                                    <span>{t}</span>
                                </div>
                            ))}
                        </div>

                        <div className="product-suggestions">
                            <p className="suggestions-title">Recommended styles</p>

                            <div className="suggestions-grid">
                                {PRODUCTS.map((item) => (
                                    <div key={item.id} className="suggestion-card glass-card">
                                        <img src={item.suggestionImage} alt={item.label} />

                                        <div className="suggestion-body">
                                            <h4>{item.label}</h4>
                                            <p>{item.suggestionDesc}</p>

                                            <div className="suggestion-meta">
                                                <span>${item.price}</span>

                                                <button
                                                    type="button"
                                                    className="suggestion-view"
                                                    onClick={() => handleSuggestedView(item.id)}
                                                >
                                                    View
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    <section className="product-info">
                        <motion.div
                            className="product-info-card glass-card"
                            initial={{ opacity: 0, y: 18, filter: "blur(10px)" }}
                            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        >
                            <p className="eyebrow">PRODUCT</p>

                            <h1 className="product-title">
                                {dynamicTitle.split(" ")[0]}{" "}
                                <span>{dynamicTitle.split(" ").slice(1).join(" ")}</span>
                            </h1>

                            <p className="product-tagline">{dynamicTagline}</p>

                            <div className="product-rating">
                                <span className="stars">★★★★★</span>
                                <span className="rating-text">
                                    {product.rating} · {product.reviews} reviews
                                </span>
                            </div>

                            <div className="product-price-row">
                                <div className="price">
                                    <span className="now">${product.price}</span>
                                    <span className="was">${product.compareAt}</span>
                                </div>
                                <div className="save">Save ${savings}</div>
                            </div>

                            <div className="product-variants">
                                <p className="variant-label">Color</p>
                                <div className="variant-buttons">
                                    {PRODUCTS.map((v, idx) => (
                                        <button
                                            key={v.id}
                                            type="button"
                                            onClick={() => {
                                                navigate(`/product/${v.id}`);
                                                setVariantIndex(idx);
                                                setActiveImage(0);
                                            }}
                                            className={`variant-btn ${v.id === product.id ? "active" : ""}`}
                                        >
                                            <span className="variant-swatch" />
                                            {v.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="product-actions">
                                <button
                                    type="button"
                                    className="primary-cta product-buy"
                                    onClick={handleAddToCart}
                                >
                                    Pre-order now
                                </button>

                                <Link to="/specs" className="secondary-cta product-specs">
                                    View specs
                                </Link>
                            </div>

                            <div className="product-shipping">
                                <div className="ship-item">
                                    <span className="ship-icon">✓</span> 30-day comfort guarantee
                                </div>
                                <div className="ship-item">
                                    <span className="ship-icon">✓</span> Worldwide shipping
                                </div>
                                <div className="ship-item">
                                    <span className="ship-icon">✓</span> Secure checkout
                                </div>
                            </div>
                        </motion.div>

                        <div className="product-details" id="details">
                            <div className="detail-card glass-card">
                                <h3>{dynamicSectionTitle}</h3>
                                <p>{dynamicSectionDesc}</p>
                            </div>

                            <div className="detail-card glass-card">
                                <h3>What you get</h3>
                                <p>
                                    Premium case, microfiber cloth, and a build designed for daily
                                    outdoor + screen use.
                                </p>
                            </div>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}