import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./App.css";
import { useCart } from "./CartContext";
import { PRODUCTS } from "./productsData";

function ProductsPageIntro() {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false);
        }, 850);

        return () => clearTimeout(timer);
    }, []);

    if (!visible) return null;

    return (
        <div className="products-page-intro">

            <div className="products-page-intro-bg" />

            <div className="products-page-intro-glow" />

            <div className="products-page-intro-logo">
                IDEAL.
            </div>

        </div>
    );
}

export default function Products() {
    const { count } = useCart();

    return (
        <div className="page products-page">
            <ProductsPageIntro />

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
                        <a href="#all-products">Shop</a>
                    </nav>

                    <Link to="/checkout" className="nav-cta cart-cta">
                        Pre-order
                        {count > 0 && <span className="cart-badge">{count}</span>}
                    </Link>
                </div>
            </header>

            <div className="tech-grid-overlay product-grid" />

            <main className="products-main-page">
                <section className="products-hero">
                    <div className="container">
                        <div className="products-hero-card glass-card">
                            <p className="eyebrow">2026 COLLECTION</p>

                            <h1 className="products-hero-title">
                                Choose your <span>IDEAL</span> style.
                            </h1>

                            <p className="products-hero-subtitle">
                                Explore the full collection of premium sunglasses built
                                for clarity, comfort, glare control, and a sharper daily look.
                            </p>

                            <div className="products-hero-actions">
                                <a href="#all-products" className="primary-cta">
                                    Browse collection
                                </a>

                                <Link to="/specs" className="secondary-cta">
                                    View specs
                                </Link>
                            </div>

                            <div className="products-hero-meta">
                                <span>UV400 protection</span>
                                <span>Triple AR coating</span>
                                <span>48 g feather-weight frame</span>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="products-listing" id="all-products">
                    <div className="container">
                        <div className="angles-header products-section-head">
                            <p className="eyebrow angles-eyebrow">ALL PRODUCTS</p>
                            <h2>Find the one that fits your vision.</h2>
                            <p className="angles-subtitle">
                                Three signature variants, one premium experience.
                            </p>
                        </div>

                        <div className="suggestions-grid">
                            {PRODUCTS.map((product) => (
                                <div key={product.id} className="suggestion-card glass-card">
                                    <img
                                        src={product.suggestionImage}
                                        alt={product.label}
                                    />

                                    <div className="suggestion-body">
                                        <h4>{product.label}</h4>
                                        <p>{product.suggestionDesc}</p>

                                        <div className="suggestion-meta">
                                            <span>${product.price}</span>

                                            <Link
                                                to={`/product/${product.id}`}
                                                className="suggestion-view"
                                            >
                                                View
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}