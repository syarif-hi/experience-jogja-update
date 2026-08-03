import React from "react";
import { useTranslation } from "@/lib/i18n";
import PageShell from "@/components/layout/PageShell";
import { Smartphone, Bus, Bike, Car, Navigation } from "lucide-react";

export default function GettingAround({ hideShell = false }) {
  const { language } = useTranslation();

  const options = [
    {
      id: "ride-hailing",
      icon: Smartphone,
      title_en: "Online Ride-Hailing",
      title_id: "Ojek Online",
      desc_en: "Gojek and Grab widely available. GoRide/GrabBike for motorcycles. GoCar/GrabCar for cars. Very affordable.",
      desc_id: "Gojek dan Grab tersedia luas. GoRide/GrabBike untuk motor. GoCar/GrabCar untuk mobil. Sangat terjangkau."
    },
    {
      id: "bus",
      icon: Bus,
      title_en: "Trans Jogja Bus",
      title_id: "Bus Trans Jogja",
      desc_en: "BRT system covering major routes. Rp 3,500 flat fare. Covers Malioboro, Prambanan direction, university area.",
      desc_id: "Sistem BRT mencakup rute utama. Tarif flat Rp 3.500. Menjangkau Malioboro, arah Prambanan, area kampus."
    },
    {
      id: "traditional",
      icon: Bike,
      title_en: "Becak & Andong",
      title_id: "Becak & Andong",
      desc_en: "Traditional pedicab (becak) and horse carriage (andong). Great for short distances and cultural experience. Negotiate price before riding.",
      desc_id: "Becak dan kereta kuda (andong) tradisional. Cocok untuk jarak dekat dan pengalaman budaya. Nego harga sebelum naik."
    },
    {
      id: "rental",
      icon: Car,
      title_en: "Car & Motorbike Rental",
      title_id: "Sewa Mobil & Motor",
      desc_en: "Daily car rental with driver Rp 400K-600K. Self-drive motorbike Rp 70K-100K/day. International license or local permit needed.",
      desc_id: "Sewa mobil harian plus sopir Rp 400rb-600rb. Motor lepas kunci Rp 70rb-100rb/hari. Perlu SIM internasional atau lokal."
    },
    {
      id: "taxi",
      icon: Navigation,
      title_en: "Taxi",
      title_id: "Taksi",
      desc_en: "Metered taxis available. Bluebird is the most trusted brand. Flag-down or book via app.",
      desc_id: "Taksi argo tersedia. Bluebird adalah merek terpercaya. Cegat di jalan atau pesan via aplikasi."
    }
  ];

  const Wrapper = hideShell ? React.Fragment : PageShell;

  return (
    <Wrapper>
      <div className={hideShell ? "" : "content-wrap section-y"}>
        {!hideShell && (
          <div className="mb-8">
            <h1 className="font-heading text-[28px] font-bold md:text-[36px]" style={{ color: "var(--color-primary)" }}>
              {language === "id" ? "Transportasi Lokal" : "Getting Around"}
            </h1>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {options.map((option) => (
            <div key={option.id} className="p-6 rounded-2xl flex flex-col items-start gap-4" style={{ backgroundColor: "var(--bg-surface)" }}>
              <div className="p-3 rounded-lg" style={{ backgroundColor: "var(--color-primary)", color: "var(--on-primary)" }}>
                <option.icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-heading text-[18px] font-bold mb-2" style={{ color: "var(--text-primary)" }}>
                  {language === "id" ? option.title_id : option.title_en}
                </h3>
                <p className="text-[15px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  {language === "id" ? option.desc_id : option.desc_en}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Wrapper>
  );
}
