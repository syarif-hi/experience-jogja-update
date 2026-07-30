import React, { useEffect } from "react";
import * as Icons from "lucide-react";
import { useTranslation } from "@/lib/i18n";
import TrailRail from "./TrailRail";

export default function BrowseDrawer({ open, onClose, trail, currentSlugs }) {
  const { language } = useTranslation();
  
  // Prevent body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <>
      {/* Scrim */}
      <div 
        className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Drawer */}
      <div 
        className="fixed bottom-0 left-0 right-0 z-[101] rounded-t-3xl max-h-[85vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom-full duration-300"
        style={{ backgroundColor: "var(--bg-surface)" }}
        role="dialog"
        aria-modal="true"
        aria-label="Browse Explorer"
      >
        {/* Handle */}
        <div className="flex justify-center p-4 pb-2 shrink-0">
          <div className="w-12 h-1.5 rounded-full" style={{ backgroundColor: "var(--text-secondary)", opacity: 0.3 }} />
        </div>
        
        {/* Header */}
        <div className="px-6 pb-4 shrink-0 flex justify-between items-center">
          <h2 className="text-lg font-bold font-heading" style={{ color: "var(--text-primary)" }}>
            {language === "id" ? "Telusuri Informasi Wisatawan" : "Browse Visitor Information"}
          </h2>
          <button onClick={onClose} className="p-2 -mr-2" style={{ color: "var(--text-secondary)" }}>
            <Icons.X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div 
          className="p-6 overflow-y-auto overscroll-contain"
          onClick={(e) => {
            if (e.target.closest("a")) {
              onClose();
            }
          }}
        >
          <TrailRail trail={trail} currentSlugs={currentSlugs} forceExpandAll={true} />
        </div>
      </div>
    </>
  );
}
