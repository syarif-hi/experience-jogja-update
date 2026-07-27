import React, { useState } from "react";

// Solid-color fallback (no broken-image icon, keeps the no-gradient look) if an image fails.
export default function SmartImage({ src, alt, className = "", ...props }) {
  const [failed, setFailed] = useState(false);
  if (failed || !src) {
    return <div className={className} style={{ backgroundColor: "var(--bg-surface-alt)" }} aria-label={alt} role="img" />;
  }
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={className}
      {...props}
    />
  );
}