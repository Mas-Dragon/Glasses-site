// src/Landing.js
import React, { Suspense, useRef, useState, useEffect, useMemo } from "react";
import "./App.css";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, useGLTF } from "@react-three/drei";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import * as THREE from "three";
import { Link } from "react-router-dom";
import IntroScreen from "./IntroScreen";

/* ================== 3D MODEL ================== */

function GlassesModel({ variantLook, scrollProgress = 0 }) {
    const ref = useRef();
    const { scene } = useGLTF("/glasses.glb");

    const introProgress = useRef(0);

    const targetFrame = useRef(new THREE.Color(variantLook.frame));
    const targetLens = useRef(new THREE.Color(variantLook.lens));
    const currentFrame = useRef(new THREE.Color(variantLook.frame));
    const currentLens = useRef(new THREE.Color(variantLook.lens));

    useEffect(() => {
        targetFrame.current.set(variantLook.frame);
        targetLens.current.set(variantLook.lens);
    }, [variantLook.frame, variantLook.lens]);

    const variantSettings = useMemo(
        () => [
            {
                rotation: { x: 0.04, y: 0.28, z: 0.0 },
                position: { x: 1.55, y: -0.18, z: 0 },
                scale: 5.2,
            },
            {
                rotation: { x: 0.16, y: -0.2, z: 0.03 },
                position: { x: 1.42, y: -0.2, z: 0 },
                scale: 5.08,
            },
            {
                rotation: { x: -0.08, y: 0.38, z: -0.025 },
                position: { x: 1.52, y: -0.16, z: 0 },
                scale: 5.12,
            },
        ],
        []
    );

    const getScrollDrivenSettings = (progress) => {
        const clamped = THREE.MathUtils.clamp(progress, 0, 1);

        const maxIndex = variantSettings.length - 1;
        const scaled = clamped * maxIndex;

        const fromIndex = Math.floor(scaled);
        const toIndex = Math.min(fromIndex + 1, maxIndex);
        const mix = scaled - fromIndex;

        const from = variantSettings[fromIndex];
        const to = variantSettings[toIndex];

        return {
            rotation: {
                x: THREE.MathUtils.lerp(from.rotation.x, to.rotation.x, mix),
                y: THREE.MathUtils.lerp(from.rotation.y, to.rotation.y, mix),
                z: THREE.MathUtils.lerp(from.rotation.z, to.rotation.z, mix),
            },
            position: {
                x: THREE.MathUtils.lerp(from.position.x, to.position.x, mix),
                y: THREE.MathUtils.lerp(from.position.y, to.position.y, mix),
                z: THREE.MathUtils.lerp(from.position.z, to.position.z, mix),
            },
            scale: THREE.MathUtils.lerp(from.scale, to.scale, mix),
        };
    };

    const applyLook = (obj, lensGlow = 0) => {
        if (!obj) return;

        obj.traverse((child) => {
            if (!child.isMesh) return;

            const mat = child.material;
            if (!mat) return;

            const name = (mat.name || child.name || "").toLowerCase();

            const isLens =
                name.includes("lens") ||
                name.includes("glass") ||
                name.includes("lenses");

            const isFrame =
                name.includes("frame") ||
                name.includes("body") ||
                name.includes("plastic") ||
                name.includes("metal");

            const pickLens = isLens && !isFrame;

            if (mat.color) {
                mat.color.copy(pickLens ? currentLens.current : currentFrame.current);
            }

            if (pickLens) {
                mat.transparent = true;
                mat.opacity = 0.25;
                mat.ior = 1.4;

                mat.roughness = 0.08;
                mat.metalness = 0.04;
                mat.envMapIntensity = 0.95 + lensGlow * 0.9;
                mat.emissiveIntensity = 0.01 + lensGlow * 0.08;

                if ("emissive" in mat) {
                    mat.emissive = mat.emissive || new THREE.Color("#ffffff");
                    mat.emissive.set("#ffffff");
                    mat.emissiveIntensity = 0.02 + lensGlow * 0.16;
                }
            } else {
                mat.roughness = 0.35;
                mat.metalness = 0.18;
                mat.envMapIntensity = 0.9;
            }

            mat.needsUpdate = true;
        });
    };

    useFrame((state, delta) => {
        if (!ref.current) return;

        const settings = getScrollDrivenSettings(scrollProgress);

        currentFrame.current.lerp(targetFrame.current, 0.08);
        currentLens.current.lerp(targetLens.current, 0.08);

        const time = state.clock.getElapsedTime();
        const mouseX = state.mouse.x;
        const mouseY = state.mouse.y;

        const mouseAmount = Math.min(1, Math.abs(mouseX) * 0.9 + Math.abs(mouseY) * 0.8);
        const breathingGlow = (Math.sin(time * 1.4) + 1) * 0.5;
        const lensGlow = THREE.MathUtils.clamp(0.18 + mouseAmount * 0.45 + breathingGlow * 0.12, 0, 1);

        applyLook(ref.current, lensGlow);

        const introDuration = 1.3;

        if (introProgress.current < 1) {
            introProgress.current += delta / introDuration;
            const t = Math.min(introProgress.current, 1);
            const ease = 1 - Math.pow(1 - t, 3);

            ref.current.position.x = THREE.MathUtils.lerp(3.3, settings.position.x, ease);
            ref.current.position.y = THREE.MathUtils.lerp(0.7, settings.position.y, ease);
            ref.current.position.z = THREE.MathUtils.lerp(0.35, settings.position.z, ease);

            const scale = THREE.MathUtils.lerp(5.35, settings.scale, ease);
            ref.current.scale.set(scale, scale, scale);

            ref.current.rotation.y = THREE.MathUtils.lerp(
                settings.rotation.y + 0.8,
                settings.rotation.y,
                ease
            );

            ref.current.rotation.x = THREE.MathUtils.lerp(
                settings.rotation.x + 0.18,
                settings.rotation.x,
                ease
            );

            ref.current.rotation.z = THREE.MathUtils.lerp(0.08, settings.rotation.z, ease);
            return;
        }

        const scrollTiltX = scrollProgress * 0.08;
        const scrollTiltY = (scrollProgress - 0.5) * 0.12;
        const scrollDepth = scrollProgress * 0.12;

        const targetRotY =
            settings.rotation.y +
            scrollTiltY +
            Math.sin(time * 0.55) * 0.045 +
            mouseX * 0.08;

        const targetRotX =
            settings.rotation.x +
            scrollTiltX +
            Math.cos(time * 0.75) * 0.02 +
            mouseY * 0.04;

        const targetRotZ =
            settings.rotation.z +
            Math.sin(time * 0.45) * 0.01;

        const targetPosX = settings.position.x + Math.sin(time * 0.35) * 0.03;
        const targetPosY = settings.position.y + Math.cos(time * 0.7) * 0.025;
        const targetPosZ = settings.position.z + scrollDepth;

        ref.current.rotation.y = THREE.MathUtils.lerp(ref.current.rotation.y, targetRotY, 0.06);
        ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, targetRotX, 0.06);
        ref.current.rotation.z = THREE.MathUtils.lerp(ref.current.rotation.z, targetRotZ, 0.06);

        ref.current.position.x = THREE.MathUtils.lerp(ref.current.position.x, targetPosX, 0.08);
        ref.current.position.y = THREE.MathUtils.lerp(ref.current.position.y, targetPosY, 0.08);
        ref.current.position.z = THREE.MathUtils.lerp(ref.current.position.z, targetPosZ, 0.08);

        const newScale = THREE.MathUtils.lerp(ref.current.scale.x, settings.scale, 0.08);
        ref.current.scale.set(newScale, newScale, newScale);
    });

    return <primitive ref={ref} object={scene} position={[3.3, 0.7, 0.35]} scale={5.35} />;
}

function GlassesScene({ variantLook, scrollProgress }) {
    return (
        <Canvas
            camera={{ position: [0, -0.55, 4.5], fov: 32 }}
            shadows
            dpr={[1, 2]}
            style={{ background: "transparent" }}
            gl={{ alpha: true, antialias: true }}
        >
            <ambientLight intensity={0.78} />
            <directionalLight position={[3, 2, 3]} intensity={1.1} />
            <directionalLight position={[-3, 1, 2]} intensity={0.42} />
            <pointLight position={[0, 1, 3]} intensity={0.55} />
            <pointLight position={[1.8, 0.4, 2.6]} intensity={0.35} />
            <Environment preset="city" />

            <Suspense fallback={null}>
                <GlassesModel
                    variantLook={variantLook}
                    scrollProgress={scrollProgress}
                />
            </Suspense>
        </Canvas>
    );
}

/* ================== TECH BLUEPRINT ================== */

const blueprintPins = [
    { id: "uv", title: "UV400 barrier", desc: "Blocks 100% of UVA & UVB rays.", top: "3%", left: "39%" },
    { id: "ar", title: "Triple AR layer", desc: "Reduces glare and enhances clarity.", top: "33%", left: "42%" },
    { id: "hinge", title: "Lightweight hinge", desc: "Feather-light and durable design.", top: "60%", left: "36%" },
];

function TechBlueprintSection() {
    const [activePin, setActivePin] = useState("uv");
    const sectionRef = useRef(null);

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"],
    });

    const imageY = useTransform(scrollYProgress, [0, 1], [30, -30]);
    const gridY = useTransform(scrollYProgress, [0, 1], [-20, 20]);

    return (
        <section className="tech-blueprint" id="tech" ref={sectionRef}>
            <div className="tech-blueprint-bg" />
            <motion.div className="tech-grid-overlay" style={{ y: gridY }} />

            <div className="tech-blueprint-inner">
                <p className="bp-heading">TECHNOLOGY</p>

                <div className="bp-meta-strip">
                    <div>UV400 · 100% UVA/UVB</div>
                    <div>Triple AR · 3× coating</div>
                    <div>48 g · Feather-light</div>
                </div>

                <motion.div
                    className="bp-visual"
                    initial={{ opacity: 0, scale: 0.96, filter: "blur(10px)" }}
                    whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                    transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                    viewport={{ once: true, amount: 0.5 }}
                >
                    <div className={`bp-spot bp-spot-${activePin}`} />

                    <motion.img
                        src="/glasses-blueprint.png"
                        alt="Glasses technology blueprint"
                        className="bp-image"
                        style={{ y: imageY }}
                    />

                    {blueprintPins.map((pin, index) => (
                        <motion.div
                            key={pin.id}
                            className={`bp-pin ${activePin === pin.id ? "active" : ""}`}
                            style={{ top: pin.top, left: pin.left }}
                            onMouseEnter={() => setActivePin(pin.id)}
                            initial={{ opacity: 0, y: 6 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.45, delay: 0.35 + index * 0.2, ease: "easeOut" }}
                            viewport={{ once: true, amount: 0.6 }}
                        >
                            <div className="bp-dot" />
                            <motion.span
                                className="bp-line"
                                initial={{ scaleX: 0 }}
                                whileInView={{ scaleX: 1 }}
                                transition={{ duration: 0.45, delay: 0.45 + index * 0.2, ease: "easeOut" }}
                                viewport={{ once: true, amount: 0.6 }}
                            />
                            <div className="bp-label">
                                <motion.h4
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    transition={{ duration: 0.3 }}
                                    viewport={{ once: true }}
                                >
                                    {pin.title.split("").map((char, i) => (
                                        <motion.span
                                            key={i}
                                            initial={{ opacity: 0, y: 4 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.05 * i, duration: 0.25 }}
                                            viewport={{ once: true }}
                                        >
                                            {char}
                                        </motion.span>
                                    ))}
                                </motion.h4>

                                <motion.p
                                    initial={{ width: 0 }}
                                    whileInView={{ width: "100%" }}
                                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                                    style={{ overflow: "hidden", whiteSpace: "nowrap" }}
                                    viewport={{ once: true }}
                                >
                                    {pin.desc}
                                </motion.p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}

/* ================== COMPARISON ================== */

function LensComparisonSection() {
    const [value, setValue] = useState(50);
    const stageRef = useRef(null);
    const [gridPos, setGridPos] = useState({ x: 80, y: 50 });

    const startDrag = (clientX) => {
        if (!stageRef.current) return;
        const rect = stageRef.current.getBoundingClientRect();
        const x = clientX - rect.left;
        const percent = (x / rect.width) * 100;
        setValue(Math.min(100, Math.max(0, percent)));
    };

    const handleDividerPointerDown = (e) => {
        e.preventDefault();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        startDrag(clientX);

        const move = (moveEvent) => {
            const moveX = moveEvent.touches ? moveEvent.touches[0].clientX : moveEvent.clientX;
            startDrag(moveX);
        };

        const up = () => {
            window.removeEventListener("mousemove", move);
            window.removeEventListener("mouseup", up);
            window.removeEventListener("touchmove", move);
            window.removeEventListener("touchend", up);
        };

        window.addEventListener("mousemove", move);
        window.addEventListener("mouseup", up);
        window.addEventListener("touchmove", move);
        window.addEventListener("touchend", up);
    };

    const handleMouseMove = (e) => {
        if (!stageRef.current) return;
        const rect = stageRef.current.getBoundingClientRect();
        const y = ((e.clientY - rect.top) / rect.height) * 100;

        setGridPos({
            x: value,
            y: Math.min(100, Math.max(0, y)),
        });
    };

    const handleMouseLeave = () => setGridPos({ x: 80, y: 50 });

    return (
        <section className="comparison-section" id="comparison">
            <div
                className="tech-grid-overlay"
                style={{
                    "--grid-x": `${value}%`,
                    "--grid-y": `${gridPos.y}%`,
                }}
            />

            <div className="comparison-inner">
                <div className="comparison-header">
                    <p className="comparison-eyebrow">REAL-WORLD VIEW</p>
                    <h2>See the difference.</h2>
                    <p className="comparison-subtitle">
                        Drag the divider to compare a standard lens with IDEAL coated optics.
                    </p>
                </div>

                <div
                    className="comparison-stage"
                    ref={stageRef}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                >
                    <div className="comparison-layer comparison-before">
                        <img src="/comparison-base1.png" alt="Standard lens view" className="comparison-image" />
                    </div>

                    <div
                        className="comparison-layer comparison-after"
                        style={{ clipPath: `inset(0 ${100 - value}% 0 0)` }}
                    >
                        <img src="/comparison-base2.png" alt="IDEAL lens view" className="comparison-image" />
                    </div>

                    <div className="comparison-glow" style={{ left: `${value}%` }} />
                    <div className="comparison-drag-hint">
                        <span className="drag-pill">↔ Drag to compare</span>
                    </div>


                    <div
                        className="comparison-divider"
                        style={{ left: `${value}%` }}
                        onMouseDown={handleDividerPointerDown}
                        onTouchStart={handleDividerPointerDown}
                    >
                        <button type="button" className="comparison-handle" aria-label="Drag to compare lenses">
                            <span className="bar" />
                            <span className="bar" />
                        </button>
                    </div>

                    <div className="comparison-badge comparison-badge-left">
                        <span className="badge-title">SUN IDEAL</span>
                        <span className="badge-sub">More glare · harsher light</span>
                    </div>

                    <div className="comparison-badge comparison-badge-right">
                        <span className="badge-title">WITH IDEAL</span>
                        <span className="badge-sub">Reduced glare · richer contrast</span>
                    </div>
                </div>

                <div className="comparison-stats">
                    <div className="stat-item">
                        <div className="stat-icon">☀</div>
                        <div className="stat-text">
                            <span className="stat-value">−30%</span>
                            <span className="stat-label">Glare</span>
                        </div>
                    </div>

                    <div className="stat-item">
                        <div className="stat-icon">◎</div>
                        <div className="stat-text">
                            <span className="stat-value">+18%</span>
                            <span className="stat-label">Contrast</span>
                        </div>
                    </div>

                    <div className="stat-item">
                        <div className="stat-icon">✓</div>
                        <div className="stat-text">
                            <span className="stat-value">48g</span>
                            <span className="stat-label">Comfort</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

/* ================== ANGLES ================== */

const anglesData = [
    {
        id: "front",
        title: "Front view",
        desc: "Balanced proportions, clean silhouette.",
        img: "/angles-front.png",
        productId: "classic",
        productTitle: "Classic Black",
        productTagline: "Front-balanced proportions with a clean premium silhouette.",
    },
    {
        id: "three-quarter",
        title: "3/4 angle",
        desc: "Shows lens depth and curvature.",
        img: "/angles-front.png",
        productId: "classic",
        productTitle: "Classic Black",
        productTagline: "Curvature and lens depth tuned for a sharper premium look.",
    },
    {
        id: "side",
        title: "Side profile",
        desc: "Feather-light temples with clean line.",
        img: "/angles-front.png",
        productId: "classic",
        productTitle: "Classic Black",
        productTagline: "Slim temples and a lightweight side profile for all-day comfort.",
    },
    {
        id: "folded",
        title: "Folded view",
        desc: "Slim footprint, pocket-friendly design.",
        img: "/angles-front.png",
        productId: "classic",
        productTitle: "Classic Black",
        productTagline: "Compact folded form designed for portability and protection.",
    },
    {
        id: "lens",
        title: "Lens detail",
        desc: "Coated optics with deep contrast.",
        img: "/angles-front.png",
        productId: "classic",
        productTitle: "Classic Black",
        productTagline: "Deep contrast optics with anti-glare coating and cleaner vision.",
    },
    {
        id: "hinge",
        title: "Hinge detail",
        desc: "Lightweight hinge, solid feel.",
        img: "/angles-front.png",
        productId: "classic",
        productTitle: "Classic Black",
        productTagline: "Durable hinge construction with a refined premium feel.",
    },
];

function AnglesSection() {
    const sectionRef = useRef(null);

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"],
    });

    const gridY = useTransform(scrollYProgress, [0, 1], [20, -20]);

    return (
        <section className="angles" ref={sectionRef}>
            <div className="container">
                <div className="angles-header">
                    <p className="eyebrow angles-eyebrow">REAL-WORLD ANGLES</p>
                    <h2>Every angle. Same clarity.</h2>
                    <p className="angles-subtitle">
                        Explore the frame from every side – front, profile, and every detail in between.
                    </p>
                </div>

                <motion.div className="angles-grid" style={{ y: gridY }}>
                    {anglesData.map((angle, index) => (
                        <Link
                            key={angle.id}
                            to={`/product/${angle.productId}`}
                            state={{
                                selectedAngle: angle,
                            }}
                            className="angle-card-link"
                        >
                            <motion.article
                                className="angle-card"
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{
                                    duration: 0.55,
                                    delay: 0.15 + index * 0.08,
                                    ease: [0.22, 1, 0.36, 1],
                                }}
                                viewport={{ once: true, amount: 0.35 }}
                            >
                                <div className="angle-media">
                                    <img src={angle.img} alt={angle.title} loading="lazy" />
                                    <div className="angle-gold-shimmer" />
                                </div>
                                <h3>{angle.title}</h3>
                                <p>{angle.desc}</p>
                            </motion.article>
                        </Link>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}

/* ================== MAIN APP ================== */

export default function Landing() {
    const [activeVariant, setActiveVariant] = useState(0);

    const variants = [
        {
            name: "Classic Black",
            title: "Unmatched Vision",
            desc: "Ultra-light performance sunglasses with anti-glare coated lenses designed for daily precision.",
        },
        {
            name: "Desert Sand",
            title: "Soft Desert Finish",
            desc: "Matte-coated lightweight frame with warm lens tint for outdoor creators.",
        },
        {
            name: "Night Drive",
            title: "Night Clarity",
            desc: "Yellow lens variant optimized for low-light environments and night sessions.",
        },
    ];

    const bgGradients = [
        "radial-gradient(circle at top, #2b2b2b 0%, #050505 55%, #000000 100%)",
        "radial-gradient(circle at top, #775231 0%, #7a4f2a 45%, #0e0704 100%)",
        "radial-gradient(circle at top, #4b3b88 0%, #141325 50%, #050308 100%)",
    ];

    const variantClasses = ["variant-classic", "variant-desert", "variant-night"];

    const variantLooks = [
        { frame: "#0f0f10", lens: "#2b2b2b" },
        { frame: "#0f0f10", lens: "#6a4a2a" },
        { frame: "#1a1a1a", lens: "#3b306b" },
    ];

    const [showIntro, setShowIntro] = useState(true);
    const [introPhase, setIntroPhase] = useState("enter");
    const [heroReady, setHeroReady] = useState(false);

    useEffect(() => {
        const phase2 = setTimeout(() => {
            setIntroPhase("handoff");
        }, 1150);

        const hero = setTimeout(() => {
            setHeroReady(true);
        }, 1250);

        const remove = setTimeout(() => {
            setShowIntro(false);
        }, 1600);

        return () => {
            clearTimeout(phase2);
            clearTimeout(hero);
            clearTimeout(remove);
        };
    }, []);

    return (
        <>
            {showIntro && <IntroScreen phase={introPhase} />}

            <div
                className={`page ${variantClasses[activeVariant]}`}
                style={{ background: bgGradients[activeVariant] }}
            >
                <header className="nav">
                    <div className="container nav-inner">
                        <div className="logo">IDEAL.</div>

                        <nav className="nav-links">
                            <Link to="/products">Products</Link>
                            <Link to="/specs">Specs</Link>
                            <a href="#shop">Shop</a>
                        </nav>

                        <Link to="/checkout" className="nav-cta">
                            Pre-order
                        </Link>
                    </div>
                </header>

                <main className="hero">
                    <div className="hero-3d-bg">
                        <GlassesScene
                            activeVariant={activeVariant}
                            variantLook={variantLooks[activeVariant]}
                        />
                    </div>

                    <div className="hero-inner">
                        <section className="hero-text">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeVariant}
                                    initial={{ opacity: 0, x: -40, filter: "blur(8px)" }}
                                    animate={
                                        heroReady
                                            ? { opacity: 1, x: 0, filter: "blur(0px)" }
                                            : { opacity: 0, x: -40, filter: "blur(8px)" }
                                    }
                                    exit={{ opacity: 0, x: 40, filter: "blur(8px)" }}
                                    transition={{ duration: 0.5, ease: "easeInOut" }}
                                >
                                    <p className="eyebrow">NEW · 2026 COLLECTION</p>

                                    <h1>
                                        {variants[activeVariant].title.split(" ")[0]}{" "}
                                        <span>{variants[activeVariant].title.split(" ").slice(1).join(" ")}</span>
                                    </h1>

                                    <p className="subtitle">{variants[activeVariant].desc}</p>

                                    <div className="hero-actions">
                                        <Link to="/checkout" className="primary-cta">
                                            Pre-order now
                                        </Link>
                                        <Link to="/specs" className="secondary-cta">
                                            View specs
                                        </Link>
                                    </div>

                                    <div className="hero-meta">
                                        <span>✓ 4K-grade coated lenses</span>
                                        <span>✓ 48 g feather-weight frame</span>
                                        <span>✓ UV400 &amp; blue-light filter</span>
                                    </div>
                                </motion.div>
                            </AnimatePresence>

                            <div className="variant-tabs">
                                {variants.map((v, index) => (
                                    <button
                                        key={v.name}
                                        className={`variant-tab ${index === activeVariant ? "active" : ""}`}
                                        onClick={() => setActiveVariant(index)}
                                    >
                                        {v.name}
                                    </button>
                                ))}
                            </div>
                        </section>
                    </div>

                    <section className="feature-section" id="features">
                        <div className="feature-marquee-mask">
                            <div className="feature-marquee-track">
                                {[...Array(2)].map((_, groupIndex) => (
                                    <div className="feature-marquee-row" key={groupIndex}>
                                        <div className="feature-item">
                                            <span className="feature-icon">◉</span>
                                            <div className="feature-copy">
                                                <h4>4K-Grade Lenses</h4>
                                                <p>Crystal-clear coated optics with anti-glare finish.</p>
                                            </div>
                                        </div>

                                        <div className="feature-item">
                                            <span className="feature-icon">◎</span>
                                            <div className="feature-copy">
                                                <h4>Feather-Weight</h4>
                                                <p>Only 48 g for all-day comfort and focus.</p>
                                            </div>
                                        </div>

                                        <div className="feature-item">
                                            <span className="feature-icon">✦</span>
                                            <div className="feature-copy">
                                                <h4>UV400 + Blue Light</h4>
                                                <p>Maximum protection for screens and sunlight.</p>
                                            </div>
                                        </div>

                                        <div className="feature-item">
                                            <span className="feature-icon">☾</span>
                                            <div className="feature-copy">
                                                <h4>Night Drive</h4>
                                                <p>Tuned for low-light contrast and clarity.</p>
                                            </div>
                                        </div>

                                        <div className="feature-item">
                                            <span className="feature-icon">✧</span>
                                            <div className="feature-copy">
                                                <h4>Polarized Shield</h4>
                                                <p>Cuts harsh reflections for cleaner outdoor vision.</p>
                                            </div>
                                        </div>

                                        <div className="feature-item">
                                            <span className="feature-icon">▣</span>
                                            <div className="feature-copy">
                                                <h4>Triple AR Coating</h4>
                                                <p>Reduces glare and keeps contrast deeper and sharper.</p>
                                            </div>
                                        </div>

                                        <div className="feature-item">
                                            <span className="feature-icon">⟡</span>
                                            <div className="feature-copy">
                                                <h4>Premium Hinge</h4>
                                                <p>Solid feel with lightweight long-wear comfort.</p>
                                            </div>
                                        </div>

                                        <div className="feature-item">
                                            <span className="feature-icon">◌</span>
                                            <div className="feature-copy">
                                                <h4>Balanced Fit</h4>
                                                <p>Designed for daily wear with a stable medium fit.</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                </main>

                <TechBlueprintSection />
                <LensComparisonSection />
                <AnglesSection />

                <section className="next-section" id="shop">
                    <div className="tech-grid-overlay" />

                    <div className="container">
                        <div className="next-inner">
                            <h2>Experience the sharpest vision.</h2>

                            <p>
                                Pre-order IDEAL now and get launch pricing on the full 2026 collection,
                                with worldwide shipping and a 30-day comfort guarantee on every frame.
                            </p>

                            <div className="next-actions">
                                <Link to="/products" className="next-primary">
                                    Browse the 2026 collection
                                </Link>

                                <Link to="/specs" className="next-secondary">
                                    View full specs
                                </Link>
                            </div>

                            <div className="next-meta">
                                <span>30-day comfort guarantee</span>
                                <span>Worldwide shipping</span>
                                <span>Secure checkout</span>
                            </div>
                        </div>
                    </div>
                </section>

                <footer className="site-footer">
                    <div className="container footer-inner">
                        <div className="footer-left">
                            <span className="footer-logo">IDEAL.</span>
                            <span className="footer-copy">© 2026 IDEAL. All rights reserved.</span>
                        </div>

                        <nav className="nav-links">
                            <Link to="/products">Products</Link>
                            <Link to="/specs">Specs</Link>
                            <a href="#shop">Shop</a>
                        </nav>
                    </div>
                </footer>
            </div>
        </>
    );
}