import React, { useState } from "react";
import BreadcrumbTrail from "./BreadcrumbTrail";
import TrailRail from "./TrailRail";
import BrowseDrawer from "./BrowseDrawer";

export default function VisitorInfoLayout({ slugs, node, trail, children }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isHub = slugs.length === 0;

  return (
    <div className="flex flex-col min-h-screen">


      <div className="content-wrap flex-1 flex py-6 md:py-10">
        {/* Desktop Rail */}
        {!isHub && (
          <aside className="hidden lg:block w-[280px] shrink-0 pr-8">
            <div className="sticky top-[140px] max-h-[calc(100vh-160px)] overflow-y-auto no-scrollbar p-4 rounded-2xl" style={{ backgroundColor: "var(--bg-surface-alt)" }}>
              <TrailRail trail={trail} currentSlugs={slugs} />
            </div>
          </aside>
        )}

        {/* Main Content Area */}
        <main className="flex-1 w-full min-w-0">
          
          {children}
        </main>
      </div>

      {/* Mobile Drawer Trigger */}
      {!isHub && (
        <>
          <button
            onClick={() => setDrawerOpen(true)}
            className="lg:hidden fixed bottom-6 right-6 z-40 rounded-full px-5 py-3 font-medium flex items-center gap-2"
            style={{ backgroundColor: "var(--color-primary)", color: "var(--on-primary)" }}
          >
            Browse
          </button>
          
          <BrowseDrawer 
            open={drawerOpen} 
            onClose={() => setDrawerOpen(false)} 
            trail={trail} 
            currentSlugs={slugs} 
          />
        </>
      )}
    </div>
  );
}
