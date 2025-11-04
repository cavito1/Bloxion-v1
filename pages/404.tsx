"use client";

import { motion } from "framer-motion";
import Router from "next/router";
import { useEffect } from "react";

export default function NotFoundPage() {
  useEffect(() => {
    document.title = "404 • Orbit";
  }, []);

  return (
    <div className="flex h-screen items-center justify-center bg-zinc-900 text-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-card space-y-6"
      >
        <motion.h1
          className="code"
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          404
        </motion.h1>

        <h2 className="text-3xl font-semibold text-zinc-200 mb-2">
          Page Not Found
        </h2>

        <p className="text-zinc-400 max-w-md mx-auto">
          Looks like you've ventured into uncharted space. Let's get you back on course.
        </p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => Router.push("/")}
          className="return-btn"
        >
          Return to Home
        </motion.button>
      </motion.div>
    </div>
  );
}