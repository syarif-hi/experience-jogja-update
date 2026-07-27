import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, CalendarDays, MapPin, Tag, Wallet } from "lucide-react";
import { format, parseISO } from "date-fns";
import { id as idLocale, enUS } from "date-fns/locale";
import { base44 } from "@/api/base44Client";
import { useTranslation } from "@/lib/i18n";
import { useCurrency } from "@/lib/CurrencyContext";
import { formatPrice } from "@/lib/currency";
import { eventCategoryOf, eventCategoryColor, eventCategoryLabel } from "@/lib/eventCategories";
import PageShell from "@/components/layout/PageShell";
import SmartImage from "@/components/shared/SmartImage";
import DetailEssentials from "@/components/shared/DetailEssentials";
import ShareButtons from "@/components/news/ShareButtons";

export default function EventDetail() {
  const { slug } = useParams();
  const { t, language } = useTranslation();
  const { currency } = useCurrency();
  const [event, setEvent] = useState(undefined);

  useEffect(() => {
    base44.entities.Event.filter({ slug }).then((r) => setEvent(r[0] || null)).catch(() => setEvent(null));
  }, [slug]);

  const locale = language === "id" ? idLocale : enUS;
  const fmt = (s) => (s ? format(parseISO(s), "EEEE, d MMMM yyyy", { locale }) : "");

  return (
    <PageShell>
      <div className="mx-auto max-w-[900px] px-4 py-8 md:px-6">
        <Link to="/events" className="focus-ring mb-6 inline-flex items-center gap-1.5 rounded text-[14px] font-semibold" style={{ color: "var(--color-primary)" }}>
          <ArrowLeft className="h-4 w-4" /> {t("back")}
        </Link>

        {event === undefined ? (
          <div className="aspect-[16/9] animate-pulse rounded-2xl" style={{ backgroundColor: "var(--bg-surface-alt)" }} />
        ) : event === null ? (
          <p className="text-[15px]" style={{ color: "var(--text-secondary)" }}>{t("notFound")}</p>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
            <article className="min-w-0">
              <div className="relative aspect-[16/9] overflow-hidden rounded-2xl">
                <SmartImage src={event.cover_image_url} alt={language === "id" ? event.title_id : event.title_en} className="h-full w-full object-cover" />
                <span className="absolute left-4 top-4 inline-flex items-center rounded-full px-3 py-1 text-[12px] font-semibold" style={{ backgroundColor: eventCategoryColor(eventCategoryOf(event)), color: "#FFFFFF" }}>
                  {eventCategoryLabel(eventCategoryOf(event), language)}
                </span>
              </div>

              <h1 className="mt-6 font-heading text-[26px] font-bold md:text-[34px]" style={{ color: "var(--color-primary)" }}>
                {language === "id" ? event.title_id : event.title_en}
              </h1>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="flex items-start gap-2 text-[15px]" style={{ color: "var(--text-primary)" }}>
                  <CalendarDays className="mt-0.5 h-5 w-5 shrink-0" style={{ color: "var(--color-accent)" }} />
                  <span>{fmt(event.start_date)}{event.end_date && event.end_date !== event.start_date ? ` – ${fmt(event.end_date)}` : ""}</span>
                </div>
                {event.venue && (
                  <div className="flex items-start gap-2 text-[15px]" style={{ color: "var(--text-primary)" }}>
                    <MapPin className="mt-0.5 h-5 w-5 shrink-0" style={{ color: "var(--color-accent)" }} />
                    <span>{event.venue}</span>
                  </div>
                )}
              </div>

              <p className="mt-6 text-[18px] font-semibold" style={{ color: "var(--color-primary)" }}>
                {event.price_idr > 0 ? `${t("from")} ${formatPrice(event.price_idr, currency)}` : t("free")}
              </p>

              <div className="mt-8 border-t pt-6" style={{ borderColor: "var(--border)" }}>
                <ShareButtons title={language === "id" ? event.title_id : event.title_en} />
              </div>
            </article>

            <aside className="lg:sticky lg:top-24 lg:self-start">
              <DetailEssentials
                rows={[
                  {
                    icon: CalendarDays,
                    label: t("detail.when"),
                    value: `${fmt(event.start_date)}${event.end_date && event.end_date !== event.start_date ? ` – ${fmt(event.end_date)}` : ""}`,
                  },
                  { icon: MapPin, label: t("detail.where"), value: event.venue },
                  { icon: Tag, label: t("detail.category"), value: eventCategoryLabel(eventCategoryOf(event), language) },
                  {
                    icon: Wallet,
                    label: t("detail.price"),
                    value: event.price_idr > 0 ? `${t("from")} ${formatPrice(event.price_idr, currency)}` : t("free"),
                  },
                ]}
              />
              <div className="mt-4 rounded-2xl p-5" style={{ backgroundColor: "var(--color-primary)" }}>
                <p className="text-[15px] font-bold" style={{ color: "var(--on-primary)" }}>{t("share.label")}</p>
                <div className="mt-3"><ShareButtons title={language === "id" ? event.title_id : event.title_en} hideLabel /></div>
              </div>
            </aside>
          </div>
        )}
      </div>
    </PageShell>
  );
}