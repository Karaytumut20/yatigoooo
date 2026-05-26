"use client";

import React from "react";
import { cn } from "../../lib/utils";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export function Drawer({ isOpen, onClose, title, children }: DrawerProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1999] flex justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#021C24]/80 backdrop-blur-sm"
          />

          {/* Drawer Box */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="relative w-full max-w-md bg-[#021C24] border-l border-white/12 p-6 flex flex-col h-full shadow-2xl z-10 overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
              {title && <h3 className="text-lg font-bold tracking-wider uppercase text-white font-sans">{title}</h3>}
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-full text-white/60 hover:text-white transition-all cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 text-white">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
