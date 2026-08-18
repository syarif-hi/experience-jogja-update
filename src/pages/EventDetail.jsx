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
import BreadcrumbTrail from "@/components/visitor/BreadcrumbTrail";
import RelatedEvents from "@/components/events/RelatedEvents";

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

  const title = event && (language === "id" ? event.title_id : event.title_en);
  const trail = [
    { title: language === "id" ? "Beranda" : "Home", path: "/" },
    { title: t("events.title") || "Events & Concerts", path: "/events" },
    { title: title || "...", path: `/event/${slug}` }
  ];

  return (
    <PageShell>
      {event === undefined ? (
        <div className="content-wrap py-8">
          <div className="aspect-[16/9] animate-pulse rounded-2xl" style={{ backgroundColor: "var(--bg-surface-alt)" }} />
        </div>
      ) : event === null ? (
        <div className="content-wrap py-8">
          <p className="text-[15px]" style={{ color: "var(--text-secondary)" }}>{t("notFound")}</p>
        </div>
      ) : (
        <div className="overflow-x-hidden">
          <div className="py-8 md:py-12" style={{ backgroundColor: "var(--bg-surface-alt)" }}>
            <div className="content-wrap">
              <div>
                <BreadcrumbTrail trail={trail} />
              </div>

              <h1 className="font-heading text-3xl md:text-5xl font-bold mb-1" style={{ color: "var(--color-primary)" }}>
                {title}
              </h1>
              <span className="mb-3 inline-flex items-center rounded-full px-3 py-1 text-[12px] font-semibold" style={{ backgroundColor: eventCategoryColor(eventCategoryOf(event)), color: "#FFFFFF" }}>
                {eventCategoryLabel(eventCategoryOf(event), language)}
              </span>

            </div>
          </div>

          <div className="content-wrap py-8">
            <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
              <article className="min-w-0">
                <div className="overflow-hidden rounded-2xl">
                  <SmartImage src={event.cover_image_url} alt={title} className="w-full object-cover" />
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
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

                {(() => {
                  const body = language === "id" ? event.description_id : event.description_en;
                  return body ? (
                    <div
                      className="prose prose-lg mt-8 max-w-none prose-headings:font-heading prose-a:text-[color:var(--color-primary)]"
                      style={{ color: "var(--text-primary)" }}
                      dangerouslySetInnerHTML={{ __html: body }}
                    />
                  ) : null;
                })()}
              </article>

              <aside className="lg:sticky lg:top-6 lg:self-start">
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
          </div>

          <div className="content-wrap pb-8">
            <RelatedEvents currentSlug={event.slug} />
          </div>
        </div>
      )}
    </PageShell>
  );
}