import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import api from "../api";

// Import template-template yang sudah Anda buat
import WeddingPremium055 from "../templates/WeddingPremium055";

// Daftarkan komponen template berdasarkan nama slug-nya di sini
const TEMPLATE_COMPONENTS = {
  "wedding-premium055": WeddingPremium055,
  "weddingpremium055": WeddingPremium055,
  "demo-wedding-premium055": WeddingPremium055,
};

// Data contoh default yang otomatis dipakai untuk mode DEMO
const DEFAULT_DEMO_DATA = {
  invitation: {
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
    quote: "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu pasangan hidup dari jenismu sendiri, supaya kamu merasa tenteram kepadanya.",
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
  },
  wishes: [
    {
      id: 1,
      name: "Sahabat Romeo",
      message: "Selamat menempuh hidup baru! Semoga bahagia dan langgeng selalu.",
      presence: "hadir",
      created_at: new Date().toISOString()
    }
  ],
  summary: { hadir: 1, tidak_hadir: 0, ragu: 0 }
};

export default function PublicInvitation() {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const guestName = searchParams.get("to") || "Tamu Undangan";

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [invitationData, setInvitationData] = useState(null);
  const [wishes, setWishes] = useState([]);
  const [templateSlug, setTemplateSlug] = useState("");

  useEffect(() => {
    // 1. CEK APAKAH INI MODE DEMO (misal slug mengandung kata 'demo')
    const isDemo = slug && slug.toLowerCase().includes("demo");

    if (isDemo) {
      // Ambil key template dari slug (misal 'demo-wedding-premium055' -> 'wedding-premium055')
      const matchedKey = Object.keys(TEMPLATE_COMPONENTS).find(
        (key) => slug.toLowerCase().includes(key) || key.includes(slug.toLowerCase())
      ) || "wedding-premium055";

      setTemplateSlug(matchedKey);
      setInvitationData(DEFAULT_DEMO_DATA.invitation);
      setWishes(DEFAULT_DEMO_DATA.wishes);
      setLoading(false);
      return;
    }

    // 2. JIKA BUKAN DEMO (UNDANGAN ASLI DARI DATABASE)
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

  // Handler RSVP (Khusus demo hanya simpan di state lokal)
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

  // Pilih Komponen Desain Template yang sesuai
  const SelectedTemplate = TEMPLATE_COMPONENTS[templateSlug] || TEMPLATE_COMPONENTS["wedding-premium055"];

  if (!SelectedTemplate) {
    return (
      <div style={{ textAlign: "center", padding: "50px", fontFamily: "sans-serif" }}>
        <h2>Template Belum Terdaftar</h2>
        <p>Komponen untuk template '{templateSlug}' belum didaftarkan di TEMPLATE_COMPONENTS.</p>
      </div>
    );
  }

  // Render Template dengan Data
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
