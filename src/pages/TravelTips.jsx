import React from "react";
import { useTranslation } from "@/lib/i18n";
import { Link } from "react-router-dom";
import PageShell from "@/components/layout/PageShell";
import { Calendar, Backpack, Heart, Shield, Wallet, Languages } from "lucide-react";

export default function TravelTips({ hideShell = false }) {
  const { language } = useTranslation();

  const tips = [
    {
      id: "best-time",
      icon: Calendar,
      title_en: "Best Time to Visit",
      title_id: "Waktu Terbaik Berkunjung",
      desc_en: "Dry season May-Oct is ideal. Rainy season Nov-Apr has occasional showers. Peak: Jun-Aug and Dec school holidays.",
      desc_id: "Musim kemarau (Mei-Okt) adalah waktu ideal. Musim hujan (Nov-Apr) ada sesekali hujan. Puncak liburan: Jun-Agt dan masa libur sekolah Des."
    },
    {
      id: "pack",
      icon: Backpack,
      title_en: "What to Pack",
      title_id: "Barang Bawaan",
      desc_en: "Light cotton clothes, comfortable walking shoes, rain jacket, sunscreen, insect repellent. Modest clothing for temple visits.",
      desc_id: "Pakaian katun ringan, sepatu jalan yang nyaman, jas hujan, tabir surya, dan obat nyamuk. Pakaian sopan untuk kunjungan ke candi."
    },
    {
      id: "etiquette",
      icon: Heart,
      title_en: "Local Etiquette",
      title_id: "Etiket Lokal",
      desc_en: "Remove shoes before entering homes/temples. Use right hand for giving/receiving. Dress modestly at religious sites. Learn basic Indonesian greetings.",
      desc_id: "Lepas alas kaki sebelum masuk rumah/candi. Gunakan tangan kanan saat memberi/menerima. Berpakaian sopan di tempat ibadah. Pelajari sapaan dasar."
    },
    {
      id: "safety",
      icon: Shield,
      title_en: "Safety Tips",
      title_id: "Tips Keamanan",
      desc_en: "Jogja is generally very safe. Watch for pickpockets in crowded markets. Use reputable transport. Keep copies of important documents.",
      desc_id: "Jogja sangat aman secara umum. Waspada pencopet di pasar yang ramai. Gunakan transportasi terpercaya. Simpan salinan dokumen penting."
    },
    {
      id: "budget",
      icon: Wallet,
      title_en: "Budget Tips",
      title_id: "Tips Anggaran",
      desc_en: "Street food is delicious and cheap (Rp 5K-20K). Use Gojek/Grab for affordable transport. Visit free attractions like Malioboro.",
      desc_id: "Jajanan jalanan enak dan murah (Rp 5rb-20rb). Gunakan Gojek/Grab untuk transportasi terjangkau. Kunjungi tempat gratis seperti Malioboro."
    },
    {
      id: "language",
      icon: Languages,
      title_en: "Language Basics",
      title_id: "Dasar Bahasa",
      desc_en: "Hello = Halo, Thank you = Terima kasih, Yes = Ya, No = Tidak, How much = Berapa, Delicious = Enak.",
      desc_id: "Halo = Halo, Terima kasih = Terima kasih, Ya = Ya, Tidak = Tidak, Berapa = Berapa, Enak = Enak."
    }
  ];

  const Wrapper = hideShell ? React.Fragment : PageShell;

  return (
    <Wrapper>
      <div className={hideShell ? "" : "content-wrap section-y"}>
        {!hideShell && (
          <div className="mb-8">
            <h1 className="font-heading text-[28px] font-bold md:text-[36px]" style={{ color: "var(--color-primary)" }}>
              {language === "id" ? "Tips Perjalanan" : "Travel Tips"}
            </h1>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tips.map((tip) => (
            <div key={tip.id} className="p-6 rounded-2xl flex flex-col items-start gap-4" style={{ backgroundColor: "var(--bg-surface)" }}>
              <div className="p-3 rounded-lg" style={{ backgroundColor: "var(--color-primary)", color: "var(--on-primary)" }}>
                <tip.icon className="w-6 h-6" />
              </div>
              <div className="flex flex-col flex-grow">
                <h3 className="font-heading text-[18px] font-bold mb-2" style={{ color: "var(--text-primary)" }}>
                  {language === "id" ? tip.title_id : tip.title_en}
                </h3>
                <p className="text-[15px] leading-relaxed mb-4 flex-grow" style={{ color: "var(--text-secondary)" }}>
                  {language === "id" ? tip.desc_id : tip.desc_en}
                </p>
                <Link
                  to={`/plan-your-trip/travel-tips/${tip.id}`}
                  className="inline-flex items-center gap-1.5 text-[14px] font-semibold transition-opacity hover:opacity-80 mt-auto"
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
