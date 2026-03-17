"use client";

import { motion } from "framer-motion";

export default function Navbar() {
  return (
    <motion.nav
      className="navbar"
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
    >
      <a href="/" className="navbar-logo">
        MATCHA<span>×</span>KINETIC
      </a>
      <a href="#order" className="navbar-cta" id="nav-order-btn">
        Order Now
      </a>
    </motion.nav>
  );
}
