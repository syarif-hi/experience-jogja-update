import React from "react";
import PageShell from "@/components/layout/PageShell";
import Breadcrumb from "@/components/shared/Breadcrumb";
import { useTranslation } from "@/lib/i18n";

const CONTENT = {
  en: {
    title: "Privacy Policy",
    updated: "Last updated: 12 August 2026",
    intro:
      "Experience Jogja (\"we\", \"us\", \"our\") respects your privacy. This Privacy Policy explains how we collect, use, and protect information when you use experiencejogja.com and related services (the \"Site\").",
    sections: [
      {
        h: "1. Information We Collect",
        p: [
          "Account data you provide when registering (name, email, password hash, language preference).",
          "Trip planning data you create on the Site (itineraries, saved destinations, preferences).",
          "Usage data collected automatically (pages visited, device type, approximate location, referrer).",
          "Cookies and similar technologies used for session management and analytics.",
        ],
      },
      {
        h: "2. How We Use Information",
        p: [
          "To provide core features such as itinerary building, event browsing, and destination discovery.",
          "To personalise recommendations for places, events, and articles across Yogyakarta.",
          "To communicate service updates, respond to enquiries, and improve the Site.",
          "To detect fraud, abuse, and to comply with legal obligations under Indonesian law.",
        ],
      },
      {
        h: "3. Sharing of Information",
        p: [
          "We do not sell personal data. We may share limited data with service providers (hosting, analytics, email delivery) under confidentiality obligations.",
          "We may disclose information to authorities when required by law or to protect the rights and safety of users.",
        ],
      },
      {
        h: "4. Third-Party Services",
        p: [
          "The Site may embed maps, images, and booking links from third parties (e.g. mapping providers, hotel and tour partners). Their use of your data is governed by their own privacy policies.",
        ],
      },
      {
        h: "5. Data Retention",
        p: [
          "Account and itinerary data is retained while your account is active. You may request deletion by contacting us at the email below; some data may be retained to meet legal requirements.",
        ],
      },
      {
        h: "6. Your Rights",
        p: [
          "You may access, correct, or delete your personal data, withdraw consent, or object to certain processing, in line with Indonesia's Personal Data Protection Law (UU PDP No. 27/2022).",
        ],
      },
      {
        h: "7. Security",
        p: [
          "We use reasonable technical and organisational measures to protect data. No method of transmission over the internet is fully secure; use the Site at your own discretion.",
        ],
      },
      {
        h: "8. Children",
        p: [
          "The Site is not directed to children under 13. We do not knowingly collect personal data from children without parental consent.",
        ],
      },
      {
        h: "9. Changes to This Policy",
        p: [
          "We may update this policy from time to time. The \"Last updated\" date reflects the latest revision. Continued use of the Site constitutes acceptance of the updated policy.",
        ],
      },
      {
        h: "10. Contact",
        p: [
          "For privacy questions or requests, contact hello@experiencejogja.com.",
        ],
      },
    ],
  },
  id: {
    title: "Kebijakan Privasi",
    updated: "Terakhir diperbarui: 12 Agustus 2026",
    intro:
      "Experience Jogja (\"kami\") menghormati privasi Anda. Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi informasi saat Anda menggunakan experiencejogja.com dan layanan terkait (\"Situs\").",
    sections: [
      {
        h: "1. Informasi yang Kami Kumpulkan",
        p: [
          "Data akun yang Anda berikan saat mendaftar (nama, email, kata sandi terenkripsi, preferensi bahasa).",
          "Data perencanaan perjalanan yang Anda buat di Situs (itinerari, destinasi tersimpan, preferensi).",
          "Data penggunaan yang dikumpulkan otomatis (halaman dikunjungi, jenis perangkat, lokasi perkiraan, sumber rujukan).",
          "Cookie dan teknologi serupa untuk manajemen sesi dan analitik.",
        ],
      },
      {
        h: "2. Bagaimana Kami Menggunakan Informasi",
        p: [
          "Menyediakan fitur inti seperti perencanaan itinerari, penjelajahan acara, dan penemuan destinasi.",
          "Personalisasi rekomendasi tempat, acara, dan artikel di seluruh Yogyakarta.",
          "Menyampaikan pembaruan layanan, menanggapi pertanyaan, dan meningkatkan Situs.",
          "Mendeteksi kecurangan, penyalahgunaan, serta memenuhi kewajiban hukum Indonesia.",
        ],
      },
      {
        h: "3. Berbagi Informasi",
        p: [
          "Kami tidak menjual data pribadi. Kami dapat berbagi data terbatas dengan penyedia layanan (hosting, analitik, pengiriman email) dengan kewajiban kerahasiaan.",
          "Kami dapat mengungkapkan informasi kepada pihak berwenang bila diwajibkan oleh hukum atau untuk melindungi hak dan keselamatan pengguna.",
        ],
      },
      {
        h: "4. Layanan Pihak Ketiga",
        p: [
          "Situs dapat menyematkan peta, gambar, dan tautan pemesanan dari pihak ketiga (mis. penyedia peta, mitra hotel dan tur). Penggunaan data Anda oleh mereka diatur kebijakan privasi masing-masing.",
        ],
      },
      {
        h: "5. Retensi Data",
        p: [
          "Data akun dan itinerari disimpan selama akun Anda aktif. Anda dapat meminta penghapusan melalui email di bawah; sebagian data dapat disimpan untuk memenuhi kewajiban hukum.",
        ],
      },
      {
        h: "6. Hak Anda",
        p: [
          "Anda dapat mengakses, mengoreksi, atau menghapus data pribadi Anda, menarik persetujuan, atau menolak pemrosesan tertentu, sesuai UU Perlindungan Data Pribadi No. 27/2022.",
        ],
      },
      {
        h: "7. Keamanan",
        p: [
          "Kami menerapkan langkah teknis dan organisasi yang wajar untuk melindungi data. Tidak ada metode transmisi yang sepenuhnya aman; gunakan Situs dengan bijak.",
        ],
      },
      {
        h: "8. Anak-Anak",
        p: [
          "Situs tidak ditujukan untuk anak di bawah 13 tahun. Kami tidak sengaja mengumpulkan data pribadi anak tanpa persetujuan orang tua.",
        ],
      },
      {
        h: "9. Perubahan Kebijakan",
        p: [
          "Kami dapat memperbarui kebijakan ini dari waktu ke waktu. Tanggal \"Terakhir diperbarui\" menunjukkan revisi terbaru. Penggunaan berkelanjutan berarti Anda menerima kebijakan yang diperbarui.",
        ],
      },
      {
        h: "10. Kontak",
        p: [
          "Untuk pertanyaan privasi, hubungi hello@experiencejogja.com.",
        ],
      },
    ],
  },
};

export default function PrivacyPolicy() {
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
