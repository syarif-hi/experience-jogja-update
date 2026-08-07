import React, { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { useLocation } from "react-router-dom";

export default function ScrollToTopFab() {
  const [isVisible, setIsVisible] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    window.addEventListener("scroll", toggleVisibility, { passive: true });
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  if (!isVisible) return null;

  // Adjust bottom position if on visitor-information page to prevent overlapping the Browse FAB
  // Browse FAB is bottom-6 (24px) + height ~48px = ~72px. So we place this at bottom-24 (96px).
  // But on desktop, Browse FAB is hidden. To be safe, we just use bottom-24 if visitor-info is in path.
  const isVisitorInfo = location.pathname.includes("/visitor-information") && location.pathname.split("/").length > 3; 
  // It's not a hub if it has more than /plan-your-trip/visitor-information.
  const bottomPosition = isVisitorInfo ? "bottom-24" : "bottom-6";

  return (
    <button
      onClick={scrollToTop}
      className={`fixed ${bottomPosition} right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full shadow-lg transition-all duration-300 hover:scale-110`}
      style={{ backgroundColor: "var(--color-primary)", color: "var(--on-primary)" }}
      aria-label="Scroll to top"
    >
      <ArrowUp className="h-6 w-6" />
    </button>
  );
}
