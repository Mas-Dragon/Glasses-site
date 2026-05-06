import React from "react";
import "./IntroScreen.css";

export default function IntroScreen({ phase, type = "home" }) {
    return (
        <div className={`intro-screen intro-phase-${phase} intro-${type}`}>
            <div className="intro-bg" />

            {type === "home" && (
                <>
                    <div className="intro-ring intro-ring-top" />
                    <div className="intro-ring intro-ring-bottom" />
                    <div className="intro-logo">IDEAL.</div>
                </>
            )}

            {type === "products" && (
                <>
                    <div className="intro-products-sweep" />
                    <div className="intro-products-sweep intro-products-sweep-2" />
                    <div className="intro-products-glow" />
                    <div className="intro-logo intro-logo-mini">COLLECTION</div>
                </>
            )}

            {type === "specs" && (
                <>
                    <div className="intro-specs-grid" />
                    <div className="intro-specs-ring" />
                    <div className="intro-specs-ring intro-specs-ring-2" />
                    <div className="intro-logo intro-logo-mini">SPECS</div>
                </>
            )}

            {type === "checkout" && (
                <>
                    <div className="intro-checkout-glow" />
                    <div className="intro-checkout-lock">
                        <div className="intro-checkout-lock-shackle" />
                        <div className="intro-checkout-lock-body" />
                    </div>
                    <div className="intro-logo intro-logo-mini">SECURE CHECKOUT</div>
                </>
            )}
        </div>
    );
}
