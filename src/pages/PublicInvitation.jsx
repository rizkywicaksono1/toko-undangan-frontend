import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import api from "../api";

// 1. IMPORT TEMPLATE
// (Hanya import template yang SUDAH BENAR-BENAR ADA filenya di folder templates)
import WeddingPremium055 from "../templates/WeddingPremium055/index.jsx";
// Jika WeddingPremium01 sudah Anda buat filenya di GitHub, silakan hilangkan tanda komentar (//) di bawah:
// import WeddingPremium01 from "../templates/WeddingPremium01/index.jsx";

// 2. DAFTARKAN SEMUA TEMPLATE DALAM SATU OBJEK (JANGAN DIBUAT DUA KALI)
const TEMPLATE_COMPONENTS = {
  // Template Wedding Premium 055
  "wedding-premium055": WeddingPremium055,
  "weddingpremium055": WeddingPremium055,
  "demo-wedding-premium055": WeddingPremium055,

  Template Wedding Premium 01 (aktifkan jika komponennya sudah di-import di atas)
   "wedding-premium01": WeddingPremium01,
  "weddingpremium01": WeddingPremium01,
   "demo-wedding-premium01": WeddingPremium01,
};

// Data contoh default khusus saat mode demo
const DEFAULT_DEMO_DATA = {
  title: "The Wedding of Romeo & Juliet",
  main_title: "The Wedding of Romeo & Juliet",
  groom_name: "Romeo Montague",
  bride_name: "Juliet Capulet",
  person_a_name: "Romeo Montague",
  person_b_name: "Juliet Capulet",
  event_date: "2026-12-31T09:00:00.000Z",
  event_type: "wedding",
  location_name: "Grand Ballroom Hotel Mulia",
  location_address: "Jl. Asia Afrika, Senayan, Jakarta Pusat",
  location_map_url: "https://maps.google.com",
  cover_photo_url: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop",
  music_url: "",
  quote: "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu pasangan hidup dari jenismu sendiri.",
  quote_source: "QS. Ar-Rum: 21",
  events: [
    {
      title: "Akad Nikah",
      date: "2026-12-31",
      start_time: "08:00",
      end_time: "10:00",
      location_name: "Masjid Agung",
      address: "Jl. Senayan No. 1, Jakarta"
    },
    {
      title: "Resepsi",
      date: "2026-12-31",
      start_time: "11:00",
      end_time: "14:00",
      location_name: "Grand Ballroom Hotel Mulia",
      address: "Jl. Asia Afrika, Senayan, Jakarta Pusat"
    }
  ],
  banks: [
    {
      bank_name: "BCA",
      account_number: "1234567890",
      account_holder: "Romeo Montague"
    }
  ]
};

const DEFAULT_WISHES = [
  {
    id: 1,
    name: "Sahabat Romeo",
    message: "Selamat menempuh hidup baru! Semoga bahagia selalu.",
    presence: "hadir",
    created_at: new Date().toISOString()
  }
];

export default function PublicInvitation() {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const guestName = searchParams.get("to") || "Tamu Undangan";

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [invitationData, setInvitationData] = useState(null);
  const [wishes, setWishes] = useState([]);
  const [templateSlug, setTemplateSlug] = useState("wedding-premium055");

  useEffect(() => {
    const isDemo = slug && slug.toLowerCase().includes("demo");

    if (isDemo) {
      // Hilangkan awalan "demo-" untuk mencocokkan template yang tepat
      const cleanSlug = slug.toLowerCase().replace(/^demo-/, "");
      setTemplateSlug(cleanSlug);
      setInvitationData(DEFAULT_DEMO_DATA);
      setWishes(DEFAULT_WISHES);
      setLoading(false);
      return;
    }

    const fetchInvitation = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/public/invitation/${slug}`);
        const data = res.data?.data || res.data;

        if (!data || !data.invitation) {
          throw new Error("Undangan tidak ditemukan.");
        }

        setInvitationData(data.invitation);
        setWishes(data.wishes || []);
        
        const tSlug =
          data.invitation.template_slug ||
          data.invitation.template?.slug ||
          slug;
        setTemplateSlug(tSlug);
      } catch (err) {
        setError(err.response?.data?.message || err.message || "Gagal memuat undangan.");
      } finally {
        setLoading(false);
      }
    };

    fetchInvitation();
  }, [slug]);

  const handleRsvpSubmit = async (formData) => {
    if (slug && slug.toLowerCase().includes("demo")) {
      const newWish = {
        id: Date.now(),
        name: formData.name || guestName,
        message: formData.message || formData.wish || "",
        presence: formData.presence || "hadir",
        created_at: new Date().toISOString()
      };
      setWishes((prev) => [newWish, ...prev]);
      return { success: true };
    }

    try {
      const res = await api.post(`/public/invitation/${slug}/rsvp`, formData);
      return res.data;
    } catch (err) {
      throw err;
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", fontFamily: "sans-serif" }}>
        <p>Memuat Undangan...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "100vh", fontFamily: "sans-serif" }}>
        <h2>Terjadi Kesalahan</h2>
        <p>{error}</p>
      </div>
    );
  }

  // Pilih template yang cocok, jika tidak ada fallback ke WeddingPremium055
  const SelectedTemplate =
    TEMPLATE_COMPONENTS[templateSlug] ||
    TEMPLATE_COMPONENTS[`demo-${templateSlug}`] ||
    TEMPLATE_COMPONENTS["wedding-premium055"];

  return (
    <SelectedTemplate
      data={invitationData}
      invitation={invitationData}
      guestName={guestName}
      wishes={wishes}
      onRsvpSubmit={handleRsvpSubmit}
    />
  );
}
