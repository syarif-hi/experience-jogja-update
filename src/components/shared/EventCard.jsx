import React from "react";
import { Link } from "react-router-dom";
import { CalendarDays, MapPin } from "lucide-react";
import { format, parseISO } from "date-fns";
import { id as idLocale, enUS } from "date-fns/locale";
import { useLanguage } from "@/lib/LanguageContext";
import { useCurrency } from "@/lib/CurrencyContext";
import { useTranslation } from "@/lib/i18n";
import { formatPrice } from "@/lib/currency";
import SmartImage from "@/components/shared/SmartImage";

export default function EventCard({ event }) {
  const { language } = useLanguage();
  const { currency } = useCurrency();
  const { t } = useTranslation();
  const title = language === "id" ? event.title_id : event.title_en;
  const locale = language === "id" ? idLocale : enUS;
  const dateLabel = event.start_date ? format(parseISO(event.start_date), "d MMM yyyy", { locale }) : "";

  return (
    <Link
      to={`/events/${event.slug}`}
      className="group flex w-full flex-col focus-ring rounded-2xl"
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
        <SmartImage src={event.cover_image_url} alt={title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        <div
          className="hidden md:flex absolute left-3 top-3 items-center gap-1.5 rounded-md px-3 py-1.5 font-mono-num text-[12px] font-medium"
          style={{ backgroundColor: "var(--color-accent)", color: "var(--on-accent)" }}
        >
          <CalendarDays className="h-3.5 w-3.5" />
          {dateLabel}
        </div>
      </div>
      <div className="flex flex-1 flex-col pt-3">
        <h3 className="line-clamp-2 text-[14px] md:text-[15px] font-medium leading-tight" style={{ color: "var(--color-primary)" }}>
          {title}
        </h3>
        <div
          className="md:hidden mt-2 inline-flex self-start items-center gap-1.5 rounded-md px-2.5 py-1 font-mono-num text-[11px] font-medium max-w-full"
          style={{ backgroundColor: "var(--color-accent)", color: "var(--on-accent)" }}
        >
          <CalendarDays className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">{dateLabel}</span>
        </div>
        {event.venue && (
          <p className="mt-1.5 flex items-center gap-1.5 text-[13px] font-normal" style={{ color: "var(--text-secondary)" }}>
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            {event.venue}
          </p>
        )}
        <p className="mt-2 font-body text-[13px]" style={{ color: "var(--color-primary)" }}>
          {event.price_idr > 0 ? `${t("from")} ${formatPrice(event.price_idr, currency)}` : t("free")}
        </p>
      </div>
    </Link>
  );
}