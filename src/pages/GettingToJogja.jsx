import React from "react";
import { useTranslation } from "@/lib/i18n";
import { Link } from "react-router-dom";
import PageShell from "@/components/layout/PageShell";
import { Plane, Train, Bus, Car } from "lucide-react";

export default function GettingToJogja({ hideShell = false }) {
  const { language } = useTranslation();

  const options = [
    {
      id: "air",
      icon: Plane,
      title_en: "By Air",
      title_id: "Jalur Udara",
      desc_en: "YIA (Yogyakarta International Airport) in Kulon Progo. Domestic and international flights. Airport train to Tugu Station (Rp 15K). Taxi/Grab to city ~45 min.",
      desc_id: "YIA (Yogyakarta International Airport) di Kulon Progo. Penerbangan domestik dan internasional. Kereta bandara ke Stasiun Tugu (Rp 15rb). Taksi/Grab ke kota ~45 mnt."
    },
    {
      id: "train",
      icon: Train,
      title_en: "By Train",
      title_id: "Jalur Kereta",
      desc_en: "Tugu Station (city center) and Lempuyangan Station. Executive trains from Jakarta (7-8 hours), Surabaya (5 hours), Bandung (6 hours). Book via KAI Access app.",
      desc_id: "Stasiun Tugu (pusat kota) dan Stasiun Lempuyangan. Kereta eksekutif dari Jakarta (7-8 jam), Surabaya (5 jam), Bandung (6 jam). Pesan via aplikasi KAI Access."
    },
    {
      id: "bus",
      icon: Bus,
      title_en: "By Bus",
      title_id: "Jalur Bus",
      desc_en: "Giwangan Terminal for intercity buses. Budget option from Jakarta (12 hours). Premium buses available with AC and reclining seats.",
      desc_id: "Terminal Giwangan untuk bus antarkota. Opsi hemat dari Jakarta (12 jam). Tersedia bus premium dengan AC dan kursi yang bisa direbahkan."
    },
    {
      id: "car",
      icon: Car,
      title_en: "By Car",
      title_id: "Jalur Darat (Mobil)",
      desc_en: "Drive from Semarang (~4 hours), Solo (~1 hour), Surabaya (~5 hours). Toll roads available. Can rent car with driver for day trips.",
      desc_id: "Berkendara dari Semarang (~4 jam), Solo (~1 jam), Surabaya (~5 jam). Tersedia jalan tol. Bisa sewa mobil dengan sopir untuk perjalanan sehari."
    }
  ];

  const Wrapper = hideShell ? React.Fragment : PageShell;

  return (
    <Wrapper>
      <div className={hideShell ? "" : "content-wrap section-y"}>
        {!hideShell && (
          <div className="mb-8">
            <h1 className="font-heading text-[28px] font-bold md:text-[36px]" style={{ color: "var(--color-primary)" }}>
              {language === "id" ? "Menuju ke Jogja" : "Getting to Jogja"}
            </h1>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {options.map((option) => (
            <div key={option.id} className="p-6 rounded-2xl flex flex-col sm:flex-row gap-5" style={{ backgroundColor: "var(--bg-surface)" }}>
              <div className="shrink-0">
                <div className="p-4 rounded-xl flex items-center justify-center" style={{ backgroundColor: "var(--bg-surface-alt)", color: "var(--color-primary)" }}>
                  <option.icon className="w-8 h-8" />
                </div>
              </div>
              <div>
                <h3 className="font-heading text-[20px] font-bold mb-2" style={{ color: "var(--text-primary)" }}>
                  {language === "id" ? option.title_id : option.title_en}
                </h3>
                <p className="text-[15px] leading-relaxed mb-4" style={{ color: "var(--text-secondary)" }}>
                  {language === "id" ? option.desc_id : option.desc_en}
                </p>
                <Link
                  to={`/plan-your-trip/getting-to-jogja/${option.id}`}
                  className="inline-flex items-center gap-1.5 text-[14px] font-semibold transition-opacity hover:opacity-80"
                  style={{ color: "var(--color-primary)" }}
                >
                  {language === "id" ? "Pelajari Lebih Lanjut" : "Learn More"}
                  <span aria-hidden="true">&rarr;</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Wrapper>
  );
}
