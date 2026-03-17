"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";

const TOTAL_FRAMES = 168;
const FRAME_EXT = "jpg";
const SEQUENCE_DIR = "/sequence/matcha";

const beats = [
  {
    range: [0, 0.22],
    title: "BOLD FUSION",
    subtitle: "The perfect collision of ceremonial matcha and dark roasted espresso.",
    tag: "ORIGIN STORY",
  },
  {
    range: [0.25, 0.47],
    title: "KINETIC CHILL",
    subtitle: "Crystalline ice cubes drift and rotate in a choreographed orbital ballet.",
    tag: "ICE DYNAMICS",
  },
  {
    range: [0.50, 0.72],
    title: "LIQUID ENERGY",
    subtitle: "High-velocity shots of matcha and crema, arrested in mid-air.",
    tag: "ERUPTION PHASE",
  },
  {
    range: [0.75, 0.97],
    title: "UNCOMPROMISED",
    subtitle: "Experience the peak of the fusion.",
    tag: "PEAK FORMATION",
  },
];

function getFrameUrl(index: number): string {
  return `${SEQUENCE_DIR}/frame_${index}.${FRAME_EXT}`;
}

export default function MatchaSequence() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const [loadProgress, setLoadProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeBeat, setActiveBeat] = useState<number | null>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Preload all frames
  useEffect(() => {
    let loaded = 0;
    const images: HTMLImageElement[] = new Array(TOTAL_FRAMES);

    const onLoad = () => {
      loaded++;
      setLoadProgress(Math.round((loaded / TOTAL_FRAMES) * 100));
      if (loaded === TOTAL_FRAMES) {
        setIsLoaded(true);
        // Draw first frame immediately
        drawFrame(0, images);
      }
    };

    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image();
      img.onload = onLoad;
      img.onerror = onLoad; // don't block on missing frames
      img.src = getFrameUrl(i);
      images[i] = img;
    }
    imagesRef.current = images;
  }, []);

  const drawFrame = useCallback((frameIndex: number, images?: HTMLImageElement[]) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const imgs = images ?? imagesRef.current;
    const img = imgs[Math.max(0, Math.min(frameIndex, TOTAL_FRAMES - 1))];
    if (!img?.complete || !img.naturalWidth) return;

    const { width, height } = canvas;
    ctx.clearRect(0, 0, width, height);

    // Cover-fit: centre the image, letterbox with black
    const imgAspect = img.naturalWidth / img.naturalHeight;
    const canvasAspect = width / height;
    let drawW: number, drawH: number, offsetX: number, offsetY: number;

    if (imgAspect > canvasAspect) {
      drawH = height;
      drawW = height * imgAspect;
      offsetX = (width - drawW) / 2;
      offsetY = 0;
    } else {
      drawW = width;
      drawH = width / imgAspect;
      offsetX = 0;
      offsetY = (height - drawH) / 2;
    }

    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, width, height);
    ctx.drawImage(img, offsetX, offsetY, drawW, drawH);
  }, []);

  // Scroll → frame
  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (progress) => {
      const targetFrame = Math.round(progress * (TOTAL_FRAMES - 1));
      if (targetFrame === currentFrameRef.current) return;
      currentFrameRef.current = targetFrame;

      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        if (isLoaded) drawFrame(targetFrame);
      });

      // Active beat detection
      const bIndex = beats.findIndex(
        (b) => progress >= b.range[0] && progress <= b.range[1]
      );
      setActiveBeat(bIndex === -1 ? null : bIndex);
    });
    return () => {
      unsubscribe();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [scrollYProgress, isLoaded, drawFrame]);

  // Canvas resize
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      if (isLoaded) drawFrame(currentFrameRef.current);
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [isLoaded, drawFrame]);

  // Parallax title opacity transforms per beat
  const opacityBeat0 = useTransform(scrollYProgress, [0, 0.18, 0.22, 0.25], [1, 1, 0.5, 0]);
  const opacityBeat1 = useTransform(scrollYProgress, [0.25, 0.30, 0.43, 0.47], [0, 1, 1, 0]);
  const opacityBeat2 = useTransform(scrollYProgress, [0.50, 0.55, 0.66, 0.72], [0, 1, 1, 0]);
  const opacityBeat3 = useTransform(scrollYProgress, [0.75, 0.80, 0.93, 0.97], [0, 1, 1, 0]);

  const beatOpacities = [opacityBeat0, opacityBeat1, opacityBeat2, opacityBeat3];

  return (
    <>
      {/* Loading Screen */}
      <AnimatePresence>
        {!isLoaded && (
          <motion.div
            className="loader-overlay"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
          >
            <motion.div className="loader-content">
              <div className="loader-icon">
                <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="30" cy="30" r="28" stroke="#A4C639" strokeWidth="1.5" strokeDasharray="4 4" />
                  <circle cx="30" cy="30" r="16" stroke="#A4C639" strokeWidth="1" opacity="0.5" />
                  <circle cx="30" cy="30" r="5" fill="#A4C639" />
                </svg>
              </div>
              <p className="loader-label">Chilling...</p>
              <div className="loader-bar-track">
                <motion.div
                  className="loader-bar-fill"
                  style={{ width: `${loadProgress}%` }}
                />
              </div>
              <p className="loader-percent">{loadProgress}%</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scroll Container — 6× viewport height for scroll room */}
      <div ref={containerRef} className="sequence-scroll-container">
        {/* Sticky viewport */}
        <div className="sequence-sticky">
          <canvas ref={canvasRef} className="sequence-canvas" />

          {/* Beat overlays */}
          {beats.map((beat, i) => (
            <motion.div
              key={i}
              className="beat-overlay"
              style={{ opacity: beatOpacities[i] }}
            >
              <motion.span
                className="beat-tag"
                initial={{ letterSpacing: "0.3em", opacity: 0 }}
                animate={activeBeat === i ? { letterSpacing: "0.5em", opacity: 1 } : {}}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                {beat.tag}
              </motion.span>
              <motion.h2
                className="beat-title"
                initial={{ y: 30 }}
                animate={activeBeat === i ? { y: 0 } : {}}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
              >
                {beat.title}
              </motion.h2>
              <motion.p
                className="beat-subtitle"
                initial={{ y: 20, opacity: 0 }}
                animate={activeBeat === i ? { y: 0, opacity: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
              >
                {beat.subtitle}
              </motion.p>
            </motion.div>
          ))}

          {/* Scroll indicator */}
          <AnimatePresence>
            {isLoaded && (
              <motion.div
                className="scroll-indicator"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.5 }}
              >
                <motion.div
                  className="scroll-dot"
                  animate={{ y: [0, 10, 0] }}
                  transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
                />
                <span className="scroll-label">SCROLL</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Matcha progress bar */}
          <motion.div
            className="sequence-progress"
            style={{ scaleX: scrollYProgress, transformOrigin: "left" }}
          />
        </div>
      </div>
    </>
  );
}
