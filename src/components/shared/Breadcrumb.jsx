import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

/**
 * Simple breadcrumb for landing pages and sub-pages.
 * 
 * Usage:
 *   <Breadcrumb items={[
 *     { label: "Plan Your Trip", to: "/plan-your-trip" },
 *     { label: "Travel Tips" }  // last item = current page (no link)
 *   ]} />
 */
export default function Breadcrumb({ items = [] }) {
  if (!items || items.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex flex-wrap items-center gap-1 text-[13px]">
        {/* Home link */}
        <li className="flex items-center">
          <Link
            to="/"
            className="flex items-center gap-1 rounded-md px-1.5 py-1 transition-colors hover:opacity-80"
            style={{ color: "var(--text-secondary)" }}
          >
            <Home className="h-3.5 w-3.5" />
            <span className="sr-only">Home</span>
          </Link>
        </li>

        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <li key={item.label} className="flex items-center">
              <ChevronRight
                className="h-3.5 w-3.5 shrink-0 mx-0.5"
                style={{ color: "var(--text-secondary)", opacity: 0.5 }}
              />
              {isLast || !item.to ? (
                <span
                  className="rounded-md px-1.5 py-1 font-medium"
                  style={{ color: "var(--text-primary)" }}
                  aria-current="page"
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  to={item.to}
                  className="rounded-md px-1.5 py-1 transition-colors hover:opacity-80"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
