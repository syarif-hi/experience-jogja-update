import React, { useState } from "react";

// Solid-color fallback (no broken-image icon, keeps the no-gradient look) if an image fails.
export default function SmartImage({ src, alt, className = "", ...props }) {
  const [failed, setFailed] = useState(false);
  if (failed || !src) {
    // Use a clean placeholder image from Unsplash (via picsum) if the source is missing
    const seed = encodeURIComponent(alt || "placeholder");
    return (
      <img 
        src={`https://picsum.photos/seed/${seed}/600/400`} 
        alt={alt || "Placeholder image"} 
        className={className} 
        style={{ objectFit: "cover" }}
        {...props} 
      />
    );
  }
  let computedSrcSet = undefined;
  if (src && typeof src === 'string' && src.startsWith('/images/places/') && !src.includes('@2x')) {
    const src2x = src.replace('.jpg', '@2x.jpg');
    computedSrcSet = `${src} 1x, ${src2x} 2x`;
  }

  return (
    <img
      src={src}
      srcSet={computedSrcSet}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={className}
      {...props}
    />
  );
}