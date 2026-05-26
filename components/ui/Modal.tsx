"use client";

import React from "react";
import { cn } from "../../lib/utils";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#021C24]/80 backdrop-blur-md"
          />

          {/* Modal Box */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative w-full max-w-2xl bg-[#063B45]/90 border border-white/12 rounded-[32px] p-6 sm:p-8 shadow-2xl backdrop-blur-2xl overflow-y-auto max-h-[90vh]"
          >
            <div className="flex items-center justify-between mb-6">
              {title && <h3 className="font-serif text-2xl text-white">{title}</h3>}
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-full text-white/60 hover:text-white transition-all cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>
            <div className="text-white/80">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
