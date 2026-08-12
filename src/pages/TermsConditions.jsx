import React from "react";
import PageShell from "@/components/layout/PageShell";
import Breadcrumb from "@/components/shared/Breadcrumb";
import { useTranslation } from "@/lib/i18n";

const CONTENT = {
  en: {
    title: "Terms & Conditions",
    updated: "Last updated: 12 August 2026",
    intro:
      "Welcome to Experience Jogja. By accessing or using experiencejogja.com (the \"Site\"), you agree to be bound by these Terms & Conditions. Please read them carefully.",
    sections: [
      {
        h: "1. About the Site",
        p: [
          "Experience Jogja is a tourism information platform for the Special Region of Yogyakarta, providing content on destinations, events, itineraries, and travel tips, along with links to third-party booking partners.",
        ],
      },
      {
        h: "2. Eligibility & Accounts",
        p: [
          "You must be at least 13 years old to create an account. You are responsible for maintaining the confidentiality of your credentials and for all activity under your account.",
          "You agree to provide accurate information and to keep it up to date.",
        ],
      },
      {
        h: "3. Use of Content",
        p: [
          "All content on the Site (text, images, logos, itineraries, maps) is owned by Experience Jogja or its licensors and is protected by copyright and trademark law.",
          "You may view and share content for personal, non-commercial trip planning. Any other use, including scraping, redistribution, or commercial reuse, requires prior written permission.",
        ],
      },
      {
        h: "4. User Contributions",
        p: [
          "If you submit reviews, photos, or itineraries, you grant Experience Jogja a non-exclusive, worldwide, royalty-free licence to display and adapt them on the Site and related channels.",
          "You must not submit unlawful, misleading, offensive, or infringing content.",
        ],
      },
      {
        h: "5. Third-Party Bookings",
        p: [
          "Bookings for hotels, tours, activities, and transportation are fulfilled by independent partners. Their terms, pricing, cancellation, and refund policies apply. Experience Jogja is not a party to those contracts.",
        ],
      },
      {
        h: "6. Accuracy of Information",
        p: [
          "We strive to keep destination, event, and pricing information accurate but do not warrant that it is complete, current, or error-free. Always confirm details (opening hours, tickets, transport) with the operator before travelling.",
        ],
      },
      {
        h: "7. Prohibited Conduct",
        p: [
          "You agree not to: (a) access the Site by automated means without permission; (b) interfere with the Site's operation or security; (c) impersonate any person; or (d) use the Site to violate any law or third-party rights.",
        ],
      },
      {
        h: "8. Disclaimers",
        p: [
          "The Site is provided \"as is\" and \"as available\". To the maximum extent permitted by law, Experience Jogja disclaims all warranties, express or implied, including fitness for a particular purpose.",
        ],
      },
      {
        h: "9. Limitation of Liability",
        p: [
          "To the fullest extent permitted by law, Experience Jogja will not be liable for indirect, incidental, special, or consequential damages arising from your use of the Site or any third-party services accessed through it.",
        ],
      },
      {
        h: "10. Governing Law",
        p: [
          "These Terms are governed by the laws of the Republic of Indonesia. Any dispute shall be resolved through the courts of Yogyakarta, unless another forum is required by mandatory law.",
        ],
      },
      {
        h: "11. Changes to the Terms",
        p: [
          "We may amend these Terms at any time. Material changes will be notified via the Site. Continued use after changes take effect constitutes acceptance.",
        ],
      },
      {
        h: "12. Contact",
        p: [
          "Questions about these Terms: hello@experiencejogja.com.",
        ],
      },
    ],
  },
  id: {
    title: "Syarat & Ketentuan",
    updated: "Terakhir diperbarui: 12 Agustus 2026",
    intro:
      "Selamat datang di Experience Jogja. Dengan mengakses atau menggunakan experiencejogja.com (\"Situs\"), Anda menyetujui Syarat & Ketentuan ini. Mohon dibaca dengan saksama.",
    sections: [
      {
        h: "1. Tentang Situs",
        p: [
          "Experience Jogja adalah platform informasi pariwisata untuk Daerah Istimewa Yogyakarta yang menyediakan konten destinasi, acara, itinerari, dan tips perjalanan, serta tautan ke mitra pemesanan pihak ketiga.",
        ],
      },
      {
        h: "2. Kelayakan & Akun",
        p: [
          "Anda harus berusia minimal 13 tahun untuk membuat akun. Anda bertanggung jawab menjaga kerahasiaan kredensial dan seluruh aktivitas pada akun Anda.",
          "Anda setuju memberikan informasi yang akurat dan memperbaruinya bila perlu.",
        ],
      },
      {
        h: "3. Penggunaan Konten",
        p: [
          "Seluruh konten Situs (teks, gambar, logo, itinerari, peta) adalah milik Experience Jogja atau pemberi lisensinya dan dilindungi hak cipta dan merek.",
          "Anda boleh melihat dan membagikan konten untuk perencanaan perjalanan pribadi non-komersial. Penggunaan lain, termasuk scraping, distribusi ulang, atau penggunaan komersial, memerlukan izin tertulis.",
        ],
      },
      {
        h: "4. Kontribusi Pengguna",
        p: [
          "Bila Anda mengirim ulasan, foto, atau itinerari, Anda memberikan Experience Jogja lisensi non-eksklusif, seluruh dunia, bebas royalti untuk menampilkan dan mengadaptasinya di Situs serta kanal terkait.",
          "Anda dilarang mengirim konten melanggar hukum, menyesatkan, ofensif, atau melanggar hak orang lain.",
        ],
      },
      {
        h: "5. Pemesanan Pihak Ketiga",
        p: [
          "Pemesanan hotel, tur, aktivitas, dan transportasi dilayani mitra independen. Syarat, harga, pembatalan, dan pengembalian dana mereka berlaku. Experience Jogja bukan pihak dalam kontrak tersebut.",
        ],
      },
      {
        h: "6. Akurasi Informasi",
        p: [
          "Kami berupaya menjaga akurasi informasi destinasi, acara, dan harga, namun tidak menjamin kelengkapan, kemutakhiran, atau bebas kesalahan. Selalu konfirmasi detail (jam buka, tiket, transportasi) ke operator sebelum berangkat.",
        ],
      },
      {
        h: "7. Perilaku yang Dilarang",
        p: [
          "Anda setuju tidak: (a) mengakses Situs secara otomatis tanpa izin; (b) mengganggu operasi atau keamanan Situs; (c) menyamar sebagai orang lain; atau (d) menggunakan Situs untuk melanggar hukum atau hak pihak ketiga.",
        ],
      },
      {
        h: "8. Penafian",
        p: [
          "Situs disediakan \"sebagaimana adanya\" dan \"sebagaimana tersedia\". Sepanjang diperbolehkan hukum, Experience Jogja menolak semua jaminan, tersurat maupun tersirat, termasuk kesesuaian untuk tujuan tertentu.",
        ],
      },
      {
        h: "9. Batasan Tanggung Jawab",
        p: [
          "Sepanjang diperbolehkan hukum, Experience Jogja tidak bertanggung jawab atas kerugian tidak langsung, insidental, khusus, atau konsekuensial akibat penggunaan Situs atau layanan pihak ketiga yang diakses melalui Situs.",
        ],
      },
      {
        h: "10. Hukum yang Berlaku",
        p: [
          "Syarat ini tunduk pada hukum Republik Indonesia. Sengketa akan diselesaikan di pengadilan Yogyakarta, kecuali forum lain diwajibkan oleh hukum yang bersifat memaksa.",
        ],
      },
      {
        h: "11. Perubahan Syarat",
        p: [
          "Kami dapat mengubah Syarat ini sewaktu-waktu. Perubahan material akan diumumkan melalui Situs. Penggunaan berkelanjutan setelah perubahan berlaku berarti Anda menyetujui.",
        ],
      },
      {
        h: "12. Kontak",
        p: [
          "Pertanyaan tentang Syarat ini: hello@experiencejogja.com.",
        ],
      },
    ],
  },
};

export default function TermsConditions() {
  const { language } = useTranslation();
  const c = CONTENT[language === "id" ? "id" : "en"];

  return (
    <PageShell>
      <div className="content-wrap py-10">
        <Breadcrumb items={[{ label: c.title }]} />
        <h1 className="mt-4 font-heading text-[32px] font-bold md:text-[40px]" style={{ color: "var(--color-primary)" }}>
          {c.title}
        </h1>
        <p className="mt-1 text-[13px]" style={{ color: "var(--text-secondary)" }}>{c.updated}</p>
        <p className="mt-6 max-w-3xl text-[15px] leading-relaxed" style={{ color: "var(--text-primary)" }}>{c.intro}</p>

        <div className="mt-8 max-w-3xl space-y-8 pb-16">
          {c.sections.map((s) => (
            <section key={s.h}>
              <h2 className="font-heading text-[20px] font-bold" style={{ color: "var(--text-primary)" }}>{s.h}</h2>
              <div className="mt-2 space-y-2">
                {s.p.map((para, i) => (
                  <p key={i} className="text-[15px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>{para}</p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
