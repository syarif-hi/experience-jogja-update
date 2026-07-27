import React, { useEffect, useState } from "react";
import { Landmark, Trees, Waves, Building2, Loader2, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { base44 } from "@/api/base44Client";

export const KIND_OPTIONS = [
  { key: "culture", label: "Culture", color: "#E07B2E", Icon: Landmark },
  { key: "nature", label: "Nature", color: "#4E8A3E", Icon: Trees },
  { key: "beach", label: "Beach", color: "#2E6FB0", Icon: Waves },
  { key: "city", label: "City", color: "#7C5AAF", Icon: Building2 },
];

const slugify = (s) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

const EMPTY = {
  slug: "", label: "", short_label: "", short_desc: "", kind: "culture", google_maps_url: "",
  photo_url: "", x: 50, y: 50, zone: "city", day: "", day_order: "",
  distance_km: "", duration_min: "", show_in_distance: true,
};

export default function MapPlaceEditor({ open, onClose, place, onSaved }) {
  const editing = Boolean(place?.id);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setForm(place ? {
        ...EMPTY, ...place,
        day: place.day ?? "",
        day_order: place.day_order ?? "",
        distance_km: place.distance_km ?? "",
        duration_min: place.duration_min ?? "",
      } : EMPTY);
      setError("");
    }
  }, [open, place]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSave = async () => {
    setError("");
    const label = form.label.trim();
    if (!label) { setError("Name is required."); return; }
    const slug = (form.slug || slugify(label)) || slugify(label);
    if (!slug) { setError("Could not generate a slug — enter a name."); return; }

    const payload = {
      slug,
      label,
      short_label: form.short_label?.trim() || "",
      short_desc: form.short_desc?.trim() || "",
      kind: form.kind,
      google_maps_url: form.google_maps_url?.trim() || "",
      photo_url: form.photo_url?.trim() || "",
      x: Number(form.x) || 50,
      y: Number(form.y) || 50,
      zone: form.zone || "city",
      day: form.day === "" || form.day == null ? undefined : Number(form.day),
      day_order: form.day_order === "" || form.day_order == null ? undefined : Number(form.day_order),
      distance_km: form.distance_km === "" || form.distance_km == null ? undefined : Number(form.distance_km),
      duration_min: form.duration_min === "" || form.duration_min == null ? undefined : Number(form.duration_min),
      show_in_distance: Boolean(form.show_in_distance),
    };

    setSaving(true);
    try {
      if (editing) {
        await base44.entities.MapPlace.update(place.id, payload);
      } else {
        await base44.entities.MapPlace.create(payload);
      }
      onSaved?.();
      onClose?.();
    } catch (e) {
      setError(e?.message || "Failed to save. The slug may already exist.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!editing) return;
    setDeleting(true);
    try {
      await base44.entities.MapPlace.delete(place.id);
      onSaved?.();
      onClose?.();
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose?.()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>{editing ? "Edit place" : "Add a new place"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Category / icon selector */}
          <div>
            <Label className="mb-1.5 block text-[13px]">Category (icon)</Label>
            <div className="grid grid-cols-4 gap-2">
              {KIND_OPTIONS.map(({ key, label, color, Icon }) => {
                const active = form.kind === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => set("kind", key)}
                    className="focus-ring flex flex-col items-center gap-1 rounded-lg border p-2 text-[12px] transition-colors"
                    style={{
                      borderColor: active ? color : "var(--border)",
                      backgroundColor: active ? `${color}1A` : "transparent",
                    }}
                  >
                    <span className="flex h-7 w-7 items-center justify-center rounded-full" style={{ backgroundColor: color }}>
                      <Icon className="h-4 w-4" style={{ color: "#fff" }} />
                    </span>
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Full Name</Label>
              <Input
                value={form.label}
                onChange={(e) => set("label", e.target.value)}
                placeholder="e.g. Candi Borobudur"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Short Label (Map Pin)</Label>
              <Input
                value={form.short_label}
                onChange={(e) => set("short_label", e.target.value)}
                placeholder="e.g. Borobudur"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="mp-slug" className="mb-1.5 block text-[13px]">Slug {editing ? "" : "(optional — auto from name)"}</Label>
            <Input id="mp-slug" value={form.slug} onChange={(e) => set("slug", e.target.value)} placeholder="merapi-volcano" disabled={editing} />
          </div>

          <div>
            <Label htmlFor="mp-desc" className="mb-1.5 block text-[13px]">Short description</Label>
            <Textarea id="mp-desc" rows={2} value={form.short_desc} onChange={(e) => set("short_desc", e.target.value)} placeholder="One sentence shown on hover." />
          </div>

          <div>
            <Label htmlFor="mp-photo" className="mb-1.5 block text-[13px]">Photo URL (optional)</Label>
            <Input id="mp-photo" value={form.photo_url} onChange={(e) => set("photo_url", e.target.value)} placeholder="https://…" />
          </div>

          <div>
            <Label htmlFor="mp-gmap" className="mb-1.5 block text-[13px]">Google Maps URL (optional)</Label>
            <Input id="mp-gmap" value={form.google_maps_url} onChange={(e) => set("google_maps_url", e.target.value)} placeholder="https://maps.google.com/…" />
          </div>

          {/* Tab membership */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="mb-1.5 block text-[13px]">Zone (Grouped Areas)</Label>
              <select
                value={form.zone}
                onChange={(e) => set("zone", e.target.value)}
                className="focus-ring h-10 w-full rounded-md border px-3 text-[14px]"
                style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)", color: "var(--text-primary)" }}
              >
                <option value="north">Northern Heritage</option>
                <option value="city">City</option>
                <option value="south">Southern Coast</option>
              </select>
            </div>
            <div>
              <Label className="mb-1.5 block text-[13px]">Itinerary day</Label>
              <select
                value={form.day}
                onChange={(e) => set("day", e.target.value)}
                className="focus-ring h-10 w-full rounded-md border px-3 text-[14px]"
                style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)", color: "var(--text-primary)" }}
              >
                <option value="">Not in itinerary</option>
                <option value="1">Day 1</option>
                <option value="2">Day 2</option>
                <option value="3">Day 3</option>
              </select>
            </div>
          </div>

          {/* Distance / ETA from Kraton + itinerary stop order */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label htmlFor="mp-dist" className="mb-1.5 block text-[13px]">Distance (km)</Label>
              <Input id="mp-dist" type="number" value={form.distance_km} onChange={(e) => set("distance_km", e.target.value)} placeholder="from Kraton" />
            </div>
            <div>
              <Label htmlFor="mp-eta" className="mb-1.5 block text-[13px]">ETA (min)</Label>
              <Input id="mp-eta" type="number" value={form.duration_min} onChange={(e) => set("duration_min", e.target.value)} placeholder="minutes" />
            </div>
            <div>
              <Label htmlFor="mp-order" className="mb-1.5 block text-[13px]">Day stop #</Label>
              <Input id="mp-order" type="number" value={form.day_order} onChange={(e) => set("day_order", e.target.value)} placeholder="order" />
            </div>
          </div>

          <label className="flex items-center gap-2 text-[13px]" style={{ color: "var(--text-primary)" }}>
            <input type="checkbox" checked={form.show_in_distance} onChange={(e) => set("show_in_distance", e.target.checked)} />
            Show on Distance Overview tab
          </label>

          {error && <p className="text-[13px]" style={{ color: "var(--color-primary)" }}>{error}</p>}

          <div className="flex items-center justify-between pt-1">
            {editing ? (
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="focus-ring inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-[13px] font-semibold disabled:opacity-50"
                style={{ color: "var(--color-primary)" }}
              >
                {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />} Delete
              </button>
            ) : <span />}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="focus-ring rounded-lg px-4 py-2 text-[13px] font-semibold"
                style={{ backgroundColor: "var(--bg-surface-alt)", color: "var(--text-secondary)" }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="focus-ring inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-[13px] font-semibold disabled:opacity-50"
                style={{ backgroundColor: "var(--color-primary)", color: "var(--on-primary)" }}
              >
                {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                {editing ? "Save changes" : "Add place"}
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}