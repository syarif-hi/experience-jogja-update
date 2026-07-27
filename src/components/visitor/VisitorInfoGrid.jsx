import React from "react";
import VisitorInfoCard from "@/components/visitor/VisitorInfoCard";

// 3-col desktop / 2-col tablet / 1-col mobile grid of category cards.
export default function VisitorInfoGrid({ categories = [] }) {
  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2 xl:grid-cols-3">
      {categories.map((c) => <VisitorInfoCard key={c.id} category={c} />)}
    </div>
  );
}