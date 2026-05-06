// src/Specs.js
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./App.css";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, useGLTF } from "@react-three/drei";

/* intro خفيف خاص بصفحة specs */
function SpecsIntro() {

    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const t = setTimeout(() => {
            setVisible(false);
        }, 900);

        return () => clearTimeout(t);
    }, []);

    if (!visible) return null;

    return (
        <div className="specs-intro">

            <div className="specs-intro-bg" />

            <div className="specs-intro-ring" />

            <div className="specs-intro-logo">
                IDEAL.
            </div>

        </div>
    );
}

const specsGroups = [
    {
        title: "Lens",
        items: [
            ["Protection", "UV400 · 100% UVA/UVB"],
            ["Coating", "Triple AR anti-glare coating"],
            ["Clarity", "High-contrast tuned optics"],
            ["Use case", "Daily wear · driving · outdoor use"],
        ],
    },
    {
        title: "Frame",
        items: [
            ["Material", "Lightweight premium composite frame"],
            ["Weight", "48 g"],
            ["Hinge", "Durable comfort hinge"],
            ["Finish", "Matte performance finish"],
        ],
    },
    {
        title: "Comfort & Fit",
        items: [
            ["Fit", "Balanced medium fit"],
            ["Nose feel", "Stable all-day comfort"],
            ["Temple feel", "Low-pressure side grip"],
            ["Wear time", "Optimized for extended sessions"],
        ],
    },
];

const featureCards = [
    {
        title: "UV400 Shield",
        desc: "Blocks harmful UVA & UVB rays with full-spectrum outdoor protection.",
    },
    {
        title: "Triple AR Coating",
        desc: "Cuts glare and improves visual comfort in bright and reflective scenes.",
    },
    {
        title: "48g Frame",
        desc: "Feather-light construction designed to disappear during long wear.",
    },
    {
        title: "High Contrast Optics",
        desc: "Enhances scene separation, blacks, and perceived sharpness.",
    },
];

function GlassesModel() {
    const ref = React.useRef();
    const { scene } = useGLTF("/glasses.glb");

    useFrame((state) => {
        if (!ref.current) return;

        const time = state.clock.getElapsedTime();

        const targetRotY = -0.22 + Math.sin(time * 0.55) * 0.045;
        const targetRotX = 0.08 + Math.cos(time * 0.8) * 0.015;
        const targetPosY = -0.1 + Math.sin(time * 1.1) * 0.018;

        ref.current.rotation.y += (targetRotY - ref.current.rotation.y) * 0.05;
        ref.current.rotation.x += (targetRotX - ref.current.rotation.x) * 0.05;
        ref.current.position.y += (targetPosY - ref.current.position.y) * 0.06;
    });

    return (
        <primitive
            ref={ref}
            object={scene}
            scale={2.75}
            position={[0.02, -0.1, 0]}
            rotation={[0.08, -0.28, 0]}
        />
    );
}

export default function Specs() {
    return (
        <div className="page products-page variant-classic">

            <SpecsIntro />

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
                        <Link to="/checkout">Shop</Link>
                    </nav>

                    <Link to="/checkout" className="nav-cta">
                        Pre-order
                    </Link>
                </div>
            </header>

            <main className="specs-main">

                <section className="specs-hero container">
                    <div className="specs-hero-copy">
                        <p className="eyebrow">TECHNICAL DETAILS</p>
                        <h1 className="specs-title">
                            Built for <span>clarity</span>.
                        </h1>
                        <p className="specs-subtitle">
                            Everything from lens coating to frame weight is tuned for long-wear
                            comfort, glare reduction, and cleaner visual contrast.
                        </p>

                        <div className="specs-actions">
                            <Link to="/products" className="secondary-cta">
                                View products
                            </Link>
                            <Link to="/checkout" className="primary-cta">
                                Pre-order now
                            </Link>
                        </div>
                    </div>

                    <div className="specs-hero-card glass-card">
                        <div className="specs-3d">
                            <Canvas camera={{ position: [0, 0.2, 1.8], fov: 30 }}>
                                <ambientLight intensity={0.9} />
                                <directionalLight position={[3, 3, 3]} intensity={1.2} />

                                <GlassesModel />

                                <Environment preset="studio" />

                                <OrbitControls
                                    enableDamping
                                    enableZoom={false}
                                    enablePan={true}
                                    enableRotate={true}
                                />
                            </Canvas>
                        </div>
                    </div>
                </section>

                <section className="specs-features container">
                    <div className="specs-section-head">
                        <p className="eyebrow">PERFORMANCE</p>
                        <h2>What makes it different.</h2>
                    </div>

                    <div className="specs-feature-grid">
                        {featureCards.map((card) => (
                            <article key={card.title} className="specs-feature-card glass-card">
                                <div className="specs-feature-dot" />
                                <h3>{card.title}</h3>
                                <p>{card.desc}</p>
                            </article>
                        ))}
                    </div>
                </section>

                <section className="specs-table-section container">
                    <div className="specs-section-head">
                        <p className="eyebrow">FULL SPECS</p>
                        <h2>Technical breakdown.</h2>
                    </div>

                    <div className="specs-groups">
                        {specsGroups.map((group) => (
                            <div key={group.title} className="specs-group glass-card">
                                <div className="specs-group-head">
                                    <h3>{group.title}</h3>
                                </div>

                                <div className="specs-rows">
                                    {group.items.map(([label, value]) => (
                                        <div key={label} className="specs-row">
                                            <span className="specs-label">{label}</span>
                                            <span className="specs-value">{value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="specs-cta container">
                    <div className="specs-cta-card glass-card">
                        <h2>Ready to experience the sharpest vision?</h2>
                        <p>
                            Pre-order IDEAL now and get launch pricing, worldwide shipping,
                            and a 30-day comfort guarantee.
                        </p>

                        <div className="specs-actions">
                            <Link to="/checkout" className="primary-cta">
                                Go to checkout
                            </Link>
                            <Link to="/Products" className="secondary-cta">
                                Back to Products
                            </Link>
                        </div>
                    </div>
                </section>

            </main>
        </div>
    );
}
