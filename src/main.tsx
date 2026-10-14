import React, { useEffect, useMemo, useRef } from "react";
import { createRoot } from "react-dom/client";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Float, RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./index.css";

gsap.registerPlugin(ScrollTrigger);

function Contour({ offset }: { offset: number }) {
  const line = useMemo(() => {
    const points: THREE.Vector3[] = [];
    for (let i = 0; i <= 72; i += 1) {
      const x = -1.55 + (i / 72) * 3.1;
      const z = offset + Math.sin(x * 1.5 + offset * 2) * 0.1;
      const y = -0.355 + Math.sin(x * 1.7 + offset) * 0.045;
      points.push(new THREE.Vector3(x, y, z));
    }
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ color: "#d9db9a", transparent: true, opacity: 0.48 });
    return new THREE.Line(geometry, material);
  }, [offset]);
  return <primitive object={line} />;
}

function ParcelModel() {
  const group = useRef<THREE.Group>(null);
  useFrame(({ clock, pointer }) => {
    if (!group.current) return;
    const scroll = Math.min(1, window.scrollY / Math.max(1, document.body.scrollHeight - innerHeight));
    group.current.rotation.y += ((pointer.x * 0.16 + Math.sin(clock.elapsedTime * 0.18) * 0.08 + scroll * 0.12) - group.current.rotation.y) * 0.025;
    group.current.rotation.x += ((-0.12 - pointer.y * 0.06) - group.current.rotation.x) * 0.025;
    group.current.position.y = Math.sin(clock.elapsedTime * 0.7) * 0.035;
  });

  return (
    <group ref={group}>
      <Float speed={1} rotationIntensity={0.025} floatIntensity={0.08}>
        <RoundedBox args={[3.45, 0.18, 2.55]} radius={0.08} smoothness={3} position={[0, -0.47, 0]} castShadow receiveShadow>
          <meshStandardMaterial color="#243d31" roughness={0.42} metalness={0.18} />
        </RoundedBox>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.37, 0]} receiveShadow>
          <planeGeometry args={[3.24, 2.34, 32, 32]} />
          <meshStandardMaterial color="#627d5a" roughness={0.8} metalness={0.02} />
        </mesh>
        {Array.from({ length: 7 }, (_, i) => <Contour key={i} offset={-0.98 + i * 0.31} />)}
        {[-0.83, 0, 0.83].map((x) => (
          <mesh key={x} position={[x, -0.325, 0]}>
            <boxGeometry args={[0.018, 0.018, 2.22]} />
            <meshStandardMaterial color="#d6d49b" emissive="#6d7047" emissiveIntensity={0.18} />
          </mesh>
        ))}
        {[-0.39, 0.39].map((z) => (
          <mesh key={z} position={[0, -0.325, z]}>
            <boxGeometry args={[3.08, 0.018, 0.018]} />
            <meshStandardMaterial color="#d6d49b" emissive="#6d7047" emissiveIntensity={0.18} />
          </mesh>
        ))}
        <group position={[-0.82, -0.2, -0.66]}>
          <mesh position={[0, 0.19, 0]} castShadow><boxGeometry args={[0.43, 0.38, 0.38]} /><meshStandardMaterial color="#e2ddc9" roughness={0.63} /></mesh>
          <mesh position={[0, 0.4, 0]}><coneGeometry args={[0.34, 0.17, 4]} /><meshStandardMaterial color="#9b704d" roughness={0.66} /></mesh>
        </group>
        <group position={[0.71, -0.2, 0.63]}>
          <mesh position={[0, 0.23, 0]} castShadow><boxGeometry args={[0.5, 0.46, 0.42]} /><meshStandardMaterial color="#d8d5c6" roughness={0.6} /></mesh>
          <mesh position={[0, 0.48, 0]}><coneGeometry args={[0.39, 0.19, 4]} /><meshStandardMaterial color="#725e50" roughness={0.7} /></mesh>
        </group>
        <mesh position={[0.05, -0.12, 0.04]}>
          <sphereGeometry args={[0.085, 24, 24]} />
          <meshStandardMaterial color="#e5d15c" emissive="#e0c82c" emissiveIntensity={1.1} />
        </mesh>
        <mesh position={[0.05, -0.04, 0.04]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.19, 0.012, 8, 48]} />
          <meshStandardMaterial color="#e5d15c" emissive="#b29f31" emissiveIntensity={0.5} />
        </mesh>
      </Float>
    </group>
  );
}

function HeroScene() {
  return (
    <Canvas camera={{ position: [0, 2.25, 5.4], fov: 36 }} dpr={[1, 1.5]} gl={{ alpha: true, antialias: true }} shadows>
      <ambientLight intensity={1.2} />
      <directionalLight position={[3, 5, 4]} intensity={2.3} castShadow />
      <pointLight position={[-3, 2, -2]} color="#b0c47d" intensity={1.3} />
      <ParcelModel />
      <ContactShadows position={[0, -0.59, 0]} opacity={0.36} scale={5} blur={2.8} far={2.2} />
    </Canvas>
  );
}

function drawCraftFrame(canvas: HTMLCanvasElement, frame: number) {
  const rect = canvas.getBoundingClientRect();
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const width = Math.max(1, Math.round(rect.width * dpr));
  const height = Math.max(1, Math.round(rect.height * dpr));
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.fillStyle = "#14271f";
  ctx.fillRect(0, 0, rect.width, rect.height);
  const progress = frame / 99;
  const cx = rect.width * (0.48 + progress * 0.08);
  const cy = rect.height * 0.52;
  for (let ring = 0; ring < 15; ring += 1) {
    ctx.beginPath();
    const radius = 24 + ring * 23;
    for (let step = 0; step <= 120; step += 1) {
      const angle = (step / 120) * Math.PI * 2;
      const rough = 1 + Math.sin(angle * 3 + ring * 0.42 + progress * 4) * 0.08 + Math.cos(angle * 5 - progress * 5) * 0.035;
      const x = cx + Math.cos(angle) * radius * rough;
      const y = cy + Math.sin(angle) * radius * rough * 0.66;
      if (step === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = `rgba(204, 212, 155, ${0.07 + (ring % 4) * 0.018})`;
    ctx.lineWidth = 1;
    ctx.stroke();
  }
  const inset = Math.max(34, rect.width * 0.11);
  const top = rect.height * 0.22;
  const bottom = rect.height * 0.78;
  const skew = Math.sin(progress * Math.PI * 1.4) * rect.width * 0.05;
  const parcelCount = 3 + Math.floor(progress * 6);
  ctx.strokeStyle = "rgba(226, 213, 91, .82)";
  ctx.lineWidth = 1.2;
  ctx.strokeRect(inset + skew, top, rect.width - inset * 2, bottom - top);
  for (let i = 1; i < parcelCount; i += 1) {
    const x = inset + skew + ((rect.width - inset * 2) / parcelCount) * i;
    ctx.beginPath(); ctx.moveTo(x, top); ctx.lineTo(x - skew * 0.2, bottom); ctx.stroke();
  }
  ctx.beginPath(); ctx.arc(cx, cy, 6 + Math.sin(progress * Math.PI * 10) * 1.5, 0, Math.PI * 2);
  ctx.fillStyle = "#e2d55b"; ctx.fill();
}

function CraftSequence() {
  const section = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const target = canvas.current;
    if (!target) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const draw = (progress: number) => drawCraftFrame(target, Math.min(99, Math.max(0, Math.round(progress * 99))));
    draw(0.18);
    const trigger = ScrollTrigger.create({
      trigger: section.current,
      start: "top top",
      end: reduced ? "top top" : "bottom bottom",
      pin: false,
      scrub: reduced ? false : 1,
      onUpdate: (self) => draw(self.progress),
      onRefresh: (self) => draw(self.progress),
    });
    const resize = () => draw(trigger.progress);
    window.addEventListener("resize", resize);
    return () => { window.removeEventListener("resize", resize); trigger.kill(); };
  }, []);

  return (
    <section className="craft-sequence" ref={section} aria-labelledby="craft-sequence-title">
      <div className="craft-sequence-inner">
        <div className="craft-copy">
          <span className="craft-kicker">Lire · mesurer · concrétiser</span>
          <h2 id="craft-sequence-title">Du terrain<br />à votre <em>projet.</em></h2>
          <p>Chaque étape s’appuie sur une lecture précise du site et un accompagnement adapté à vos objectifs.</p>
          <div className="craft-frame"><b>ÉTUDE FONCIÈRE</b><span>01 — 04</span></div>
        </div>
        <div className="craft-canvas-wrap"><canvas ref={canvas} aria-label="Visualisation animée et illustrative d’un découpage de parcelle" /><span>VISUALISATION ILLUSTRATIVE · NON CADASTRALE</span></div>
      </div>
    </section>
  );
}

function installMotion() {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduceMotion) {
    gsap.fromTo(".title-line > span", { yPercent: 105, clipPath: "polygon(0 100%,100% 100%,100% 100%,0 100%)" }, {
      yPercent: 0, clipPath: "polygon(0 0,100% 0,100% 100%,0 100%)", duration: 1.05, stagger: 0.11, ease: "power4.out", delay: 0.16,
    });
    document.querySelectorAll(".site-content-shell h2, .craft-copy h2, .contact-info h2, .cta-content h2").forEach((title) => {
      gsap.fromTo(title, { letterSpacing: "0.06em", opacity: 0.92 }, {
        letterSpacing: "-0.04em", opacity: 1, ease: "none",
        scrollTrigger: { trigger: title, start: "top 88%", end: "top 35%", scrub: 0.7 },
      });
    });
    gsap.to(".hero h1 .title-line", {
      yPercent: (index) => [-3, -7, -11][index] ?? -5,
      ease: "none",
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 0.7 },
    });
    gsap.fromTo(".services-head h2", {
      transformPerspective: 1000, rotateX: 4, rotateY: -2, z: -25,
    }, {
      rotateX: 0, rotateY: 0, z: 0, ease: "none",
      scrollTrigger: { trigger: ".services", start: "top 90%", end: "top 36%", scrub: 0.8 },
    });
    document.querySelectorAll(".commitment, .process-step").forEach((item, index) => {
      gsap.fromTo(item, { y: 26, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.7, delay: (index % 4) * 0.05, ease: "power2.out",
        scrollTrigger: { trigger: item, start: "top 92%", toggleActions: "play none none reverse" },
      });
    });
  }

  const grid = document.querySelector<HTMLElement>("#service-grid");
  const section = document.querySelector<HTMLElement>("#services");
  if (!grid) return;
  const currentRange = document.querySelector<HTMLElement>("#service-slider-current");
  const progressFill = document.querySelector<HTMLElement>("#service-slider-progress");
  const previousButton = document.querySelector<HTMLButtonElement>('[data-service-scroll="-1"]');
  const nextButton = document.querySelector<HTMLButtonElement>('[data-service-scroll="1"]');
  const layout = () => {
    const card = grid.firstElementChild as HTMLElement | null;
    const gap = parseFloat(getComputedStyle(grid).columnGap || getComputedStyle(grid).gap || "0") || 0;
    const cardStride = card ? card.getBoundingClientRect().width + gap : Math.max(1, grid.clientWidth);
    const visible = Math.max(1, Math.floor((grid.clientWidth + gap) / cardStride));
    const maxStart = Math.max(0, grid.children.length - visible);
    return { visible, maxStart, pages: Math.max(1, Math.ceil(maxStart / visible)), cardStride };
  };
  const updateSliderStatus = (progress = grid.scrollLeft / Math.max(1, grid.scrollWidth - grid.clientWidth)) => {
    const { visible, maxStart } = layout();
    const startIndex = Math.min(maxStart, Math.round((Math.max(0, Math.min(1, progress)) * maxStart) / visible) * visible);
    const endIndex = Math.min(grid.children.length, startIndex + visible);
    if (currentRange) currentRange.textContent = `${String(startIndex + 1).padStart(2, "0")}–${String(endIndex).padStart(2, "0")}`;
    if (progressFill) progressFill.style.width = `${Math.max(0, Math.min(1, progress)) * 100}%`;
    if (previousButton) previousButton.disabled = progress <= 0.005;
    if (nextButton) nextButton.disabled = progress >= 0.995;
  };
  grid.addEventListener("scroll", () => updateSliderStatus(), { passive: true });
  window.addEventListener("resize", () => updateSliderStatus());
  updateSliderStatus();

  if (!reduceMotion && grid && section && window.innerWidth > 760) {
    const travel = () => Math.max(0, grid.scrollWidth - grid.clientWidth);
    grid.style.scrollSnapType = "none";
    const tween = gsap.to(grid, {
      scrollLeft: () => travel(), ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top top+=40",
        end: () => `+=${Math.max(800, travel())}`,
        pin: true,
        scrub: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => updateSliderStatus(self.progress),
        onRefresh: (self) => updateSliderStatus(self.progress),
      },
    });
    const trigger = tween.scrollTrigger;
    if (trigger) {
      (window as Window & { __serviceNavigate?: (direction: number) => void }).__serviceNavigate = (direction) => {
        const { maxStart, pages } = layout();
        const nextPage = Math.min(pages, Math.max(0, Math.round(trigger.progress * pages) + Math.sign(direction)));
        const next = maxStart === 0 ? 0 : nextPage / pages;
        const lenis = (window as Window & { __lenis?: Lenis }).__lenis;
        const destination = trigger.start + (trigger.end - trigger.start) * next;
        if (lenis) lenis.scrollTo(destination, { duration: 0.55 });
        else window.scrollTo({ top: destination, behavior: "smooth" });
      };
    }
  }
}

function Runtime() {
  useEffect(() => {
    const lenis = new Lenis({ duration: 1, smoothWheel: true, anchors: true });
    (window as Window & { __lenis?: Lenis }).__lenis = lenis;
    const update = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);
    lenis.on("scroll", ScrollTrigger.update);
    const refreshTimer = window.setTimeout(() => ScrollTrigger.refresh(), 300);
    installMotion();
    return () => {
      window.clearTimeout(refreshTimer);
      gsap.ticker.remove(update);
      lenis.destroy();
    };
  }, []);

  return null;
}

const heroMount = document.getElementById("hero-scene-root");
if (heroMount) createRoot(heroMount).render(<HeroScene />);
const craftMount = document.getElementById("craft-sequence-root");
if (craftMount) createRoot(craftMount).render(<CraftSequence />);
const runtimeMount = document.getElementById("editorial-runtime-root");
if (runtimeMount) createRoot(runtimeMount).render(<Runtime />);
