import React, { useState } from "react";
import { assetUrl } from "@/lib/constants";

// Solid-color fallback (no broken-image icon, keeps the no-gradient look) if an image fails.
export default function SmartImage({ src, alt, className = "", ...props }) {
  const [failed, setFailed] = useState(false);
  // Resolve relative paths to the hosted CDN
  const resolvedSrc = assetUrl(src);

  if (failed || !resolvedSrc) {
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
  if (resolvedSrc && typeof resolvedSrc === 'string' && resolvedSrc.includes('/images/places/') && !resolvedSrc.includes('@2x')) {
    const src2x = resolvedSrc.replace('.jpg', '@2x.jpg');
    computedSrcSet = `${resolvedSrc} 1x, ${src2x} 2x`;
  }

  return (
    <img
      src={resolvedSrc}
      srcSet={computedSrcSet}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={className}
      {...props}
    />
  );
}