import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "./App.css";
import { useCart } from "./CartContext";

/* intro بسيط لصفحة checkout */
function CheckoutIntro() {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false);
        }, 800);

        return () => clearTimeout(timer);
    }, []);

    if (!visible) return null;

    return (
        <div className="checkout-intro">
            <div className="checkout-intro-bg" />
            <div className="checkout-intro-glow" />
            <div className="checkout-intro-lock">
                <div className="checkout-lock-shackle" />
                <div className="checkout-lock-body" />
            </div>
        </div>
    );
}

export default function Checkout() {
    const { items, removeItem, updateQuantity, count } = useCart();

    const [form, setForm] = useState({
        name: "",
        email: "",
        address: "",
        city: "",
        country: "",
        card: "",
        expiry: "",
        cvc: "",
    });

    const subtotal = useMemo(() => {
        return items.reduce((acc, item) => {
            const price = Number(item.price) || 0;
            const quantity = Number(item.quantity) || 1;
            return acc + price * quantity;
        }, 0);
    }, [items]);

    const shipping = subtotal > 0 ? 15 : 0;
    const total = subtotal + shipping;

    const handleChange = (e) => {
        const { name, value } = e.target;

        let nextValue = value;

        if (name === "card") {
            nextValue = value
                .replace(/\D/g, "")
                .slice(0, 16)
                .replace(/(.{4})/g, "$1 ")
                .trim();
        }

        if (name === "expiry") {
            nextValue = value
                .replace(/\D/g, "")
                .slice(0, 4);

            if (nextValue.length > 2) {
                nextValue = `${nextValue.slice(0, 2)}/${nextValue.slice(2)}`;
            }
        }

        if (name === "cvc") {
            nextValue = value.replace(/\D/g, "").slice(0, 4);
        }

        setForm((prev) => ({
            ...prev,
            [name]: nextValue,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!items.length) {
            alert("Your cart is empty.");
            return;
        }

        alert("Order confirmed successfully.");
    };

    return (
        <div className="page checkout-page">
            <CheckoutIntro />

            <header className="nav">
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
                    </nav>

                    <Link to="/checkout" className="nav-cta cart-cta">
                        Checkout
                        {count > 0 && <span className="cart-badge">{count}</span>}
                    </Link>
                </div>
            </header>

            <div className="tech-grid-overlay checkout-grid-overlay" />

            <main className="checkout-wrap">
                <div className="container checkout-grid checkout-grid-premium">
                    <section className="glass-card checkout-card checkout-form-card">
                        <div className="checkout-heading">
                            <p className="eyebrow">SECURE CHECKOUT</p>
                            <h1 className="checkout-title">Complete your order</h1>
                            <p className="checkout-sub">
                                Fast checkout, secure payment, and premium worldwide shipping.
                            </p>
                        </div>

                        <form className="checkout-form-premium" onSubmit={handleSubmit}>
                            <div className="checkout-section-title">Contact</div>

                            <div className="form-group">
                                <label>Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    placeholder="Your full name"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    placeholder="you@example.com"
                                    required
                                />
                            </div>

                            <div className="checkout-section-title">Shipping</div>

                            <div className="form-group">
                                <label>Address</label>
                                <input
                                    type="text"
                                    name="address"
                                    value={form.address}
                                    onChange={handleChange}
                                    placeholder="Street address"
                                    required
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>City</label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={form.city}
                                        onChange={handleChange}
                                        placeholder="City"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Country</label>
                                    <input
                                        type="text"
                                        name="country"
                                        value={form.country}
                                        onChange={handleChange}
                                        placeholder="Country"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="checkout-section-title">Payment</div>

                            <div className="form-group">
                                <label>Card Number</label>
                                <input
                                    type="text"
                                    name="card"
                                    value={form.card}
                                    onChange={handleChange}
                                    placeholder="1234 5678 9012 3456"
                                    required
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Expiry</label>
                                    <input
                                        type="text"
                                        name="expiry"
                                        value={form.expiry}
                                        onChange={handleChange}
                                        placeholder="MM/YY"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>CVC</label>
                                    <input
                                        type="text"
                                        name="cvc"
                                        value={form.cvc}
                                        onChange={handleChange}
                                        placeholder="123"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="checkout-trust-row">
                                <div className="trust-pill">
                                    <span className="trust-dot" />
                                    Encrypted payment
                                </div>
                                <div className="trust-pill">
                                    <span className="trust-dot" />
                                    Secure checkout
                                </div>
                                <div className="trust-pill">
                                    <span className="trust-dot" />
                                    Fast shipping
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="primary-cta checkout-confirm"
                                disabled={!items.length}
                            >
                                Confirm Order · ${total}
                            </button>
                        </form>
                    </section>

                    <aside className="glass-card checkout-card summary-card premium-summary-card">
                        <div className="summary-header">
                            <h3>Order Summary</h3>
                            <span>{count} item{count !== 1 ? "s" : ""}</span>
                        </div>

                        {items.length === 0 ? (
                            <div className="empty-cart">
                                <p>Your cart is empty.</p>
                                <Link to="/products" className="secondary-cta">
                                    View products
                                </Link>
                            </div>
                        ) : (
                            <>
                                <div className="cart-list premium-cart-list">
                                    {items.map((item) => (
                                        <div className="cart-item premium-cart-item" key={item.id}>
                                            <div className="cart-thumb">
                                                <img src={item.image} alt={item.title} />
                                            </div>

                                            <div className="cart-content">
                                                <div className="cart-name">{item.title}</div>
                                                <div className="cart-meta">{item.variant}</div>

                                                <div className="cart-controls">
                                                    <div className="qty">
                                                        <span>Qty</span>
                                                        <input
                                                            type="number"
                                                            min="1"
                                                            value={item.quantity}
                                                            onChange={(e) =>
                                                                updateQuantity(item.id, Number(e.target.value))
                                                            }
                                                        />
                                                    </div>

                                                    <button
                                                        type="button"
                                                        className="link-danger"
                                                        onClick={() => removeItem(item.id)}
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="cart-price">
                                                ${(Number(item.price) || 0) * (Number(item.quantity) || 1)}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="summary-divider" />

                                <div className="summary-row">
                                    <span>Subtotal</span>
                                    <span>${subtotal}</span>
                                </div>

                                <div className="summary-row">
                                    <span>Shipping</span>
                                    <span>${shipping}</span>
                                </div>

                                <div className="summary-divider" />

                                <div className="summary-row total">
                                    <span>Total</span>
                                    <span>${total}</span>
                                </div>

                                <p className="summary-note">
                                    Taxes and duties are calculated at delivery where applicable.
                                </p>
                            </>
                        )}
                    </aside>
                </div>
            </main>
        </div>
    );
}
