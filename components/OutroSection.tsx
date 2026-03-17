"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const stats = [
  { value: "120°", label: "Orbital Arc" },
  { value: "168", label: "Sequence Frames" },
  { value: "4g", label: "Matcha Per Shot" },
  { value: "0K", label: "Compromises" },
];

const marqueeItems = [
  "BOLD FUSION",
  { accent: "KINETIC CHILL" },
  "LIQUID ENERGY",
  { accent: "UNCOMPROMISED" },
  "CEREMONIAL GRADE",
  { accent: "DARK ROAST" },
  "ZERO GRAVITY",
  { accent: "ICE ORBITAL" },
];

function MarqueeTrack() {
  // Duplicate for seamless loop
  const items = [...marqueeItems, ...marqueeItems];
  return (
    <div className="marquee-track" aria-hidden="true">
      {items.map((item, i) =>
        typeof item === "string" ? (
          <span key={i} className="marquee-item">{item}</span>
        ) : (
          <span key={i} className="marquee-item">
            <strong>{item.accent}</strong>
          </span>
        )
      )}
    </div>
  );
}

export default function OutroSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
  };

  return (
    <>
      {/* Marquee banner */}
      <section className="marquee-section" aria-label="Tagline marquee">
        <MarqueeTrack />
      </section>

      {/* Outro hero */}
      <section id="order" className="outro-section" ref={ref}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <motion.p className="outro-eyebrow" variants={itemVariants}>
            The Experience · Available Now
          </motion.p>
          <motion.h2 className="outro-headline" variants={itemVariants}>
            Taste the <em>Kinetic</em> Difference
          </motion.h2>
          <motion.p className="outro-body" variants={itemVariants}>
            Every sip is a precisely engineered collision. Ceremonial-grade matcha
            meets dark-roast espresso over a bed of hand-selected crystalline ice.
            The result? An uncompromised sensory experience in a cup.
          </motion.p>
          <motion.div className="outro-actions" variants={itemVariants}>
            <a href="#order" id="cta-find-location" className="btn-primary">
              Find a Location
            </a>
            <a href="#order" id="cta-learn-more" className="btn-ghost">
              Learn More
            </a>
          </motion.div>

          {/* Stats */}
          <motion.div className="stats-row" variants={containerVariants}>
            {stats.map((s) => (
              <motion.div key={s.label} className="stat-item" variants={itemVariants}>
                <span className="stat-value">{s.value}</span>
                <span className="stat-label">{s.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <span className="footer-logo">MATCHA<span>×</span>KINETIC</span>
        <span className="footer-copy">
          © {new Date().getFullYear()} Matcha Kinetic Experience. All rights reserved.
        </span>
      </footer>
    </>
  );
}
