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
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          />

          {/* Drawer Box */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="relative w-full max-w-md bg-white border-l border-slate-200 p-6 flex flex-col h-full shadow-2xl z-10 overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
              {title && <h3 className="text-lg font-bold tracking-wider uppercase text-slate-800 font-sans">{title}</h3>}
              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-700 transition-all cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 text-slate-700">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
