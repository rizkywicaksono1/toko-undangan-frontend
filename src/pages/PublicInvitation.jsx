// pages/PublicInvitation.jsx — halaman undangan yang dibagikan ke tamu (/u/:slug)
import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { api } from '../api';
import WeddingPremium055 from '../templates/WeddingPremium055';

// Daftar template berdasarkan slug/kode template
const TEMPLATE_COMPONENTS = {
  'wedding-premium055': WeddingPremium055,
  'default': WeddingPremium055,
};

// Data contoh (dummy) otomatis khusus jika membuka Demo Template
const DEMO_FALLBACK = {
  invitation: {
    title: 'The Wedding of Romeo & Juliet',
    person_a_name: 'Romeo Montague',
    person_b_name: 'Juliet Capulet',
    cover_photo_url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200',
    event_date: '2026-12-31T09:00:00',
    location_name: 'Grand Ballroom Hotel Majapahit',
    location_address: 'Jl. Tunjungan No. 65, Surabaya, Jawa Timur',
    location_map_url: 'https://maps.google.com',
    music_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    gallery_photos: [
      'https://images.unsplash.com/photo-1519741497674-611481863552?w=800',
      'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800',
      'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800',
    ],
    template_slug: 'wedding-premium055',
  },
  wishes: [
    {
      guest_name: 'Budi Santoso',
      attendance: 'hadir',
      message: 'Selamat menempuh hidup baru! Semoga bahagia selalu sampai maut memisahkan.',
      created_at: new Date().toISOString(),
    },
    {
      guest_name: 'Siti Rahma',
      attendance: 'hadir',
      message: 'Barakallahu lakum wa baraka alaikum. Selamat ya!',
      created_at: new Date().toISOString(),
    },
  ],
  summary: { total_hadir: 2, total_tidak_hadir: 0, total_ragu: 0 },
};

export default function PublicInvitation() {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const guestParam = searchParams.get('to') || 'Tamu Undangan';

  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  // Ambil data undangan dari API backend
  const fetchInvitation = () => {
    // JIKA SLUG DEMO (diawali demo- atau tamu-undangan), LANGSUNG GUNAKAN DATA DUMMY
    if (slug?.startsWith('demo-') || slug === 'tamu-undangan') {
      setData(DEMO_FALLBACK);
      setLoading(false);
      return;
    }

    setLoading(true);
    api.get(`/public/invitation/${slug}`)
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch((e) => {
        // Fallback: jika data di database belum ada, tetap tampilkan preview demo
        console.warn('Gagal ambil data backend, menggunakan fallback demo:', e);
        setData(DEMO_FALLBACK);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchInvitation();
  }, [slug]);

  // Handler kirim RSVP / Ucapan ke Backend
  const handleSendWish = async (wishData) => {
    // Mode demo: cukup simpan di state lokal tanpa request backend
    if (slug?.startsWith('demo-') || slug === 'tamu-undangan') {
      const newWish = {
        guest_name: wishData.name || wishData.guest_name || guestParam,
        attendance: wishData.attendance || 'hadir',
        message: wishData.message,
        created_at: new Date().toISOString(),
      };
      setData((prev) => ({
        ...prev,
        wishes: [newWish, ...(prev?.wishes || [])],
      }));
      return { success: true };
    }

    try {
      await api.post(`/public/invitation/${slug}/rsvp`, {
        guest_name: wishData.name || wishData.guest_name || guestParam,
        attendance: wishData.attendance,
        guest_count: wishData.guest_count || 1,
        message: wishData.message,
      });

      // Muat ulang data ucapan setelah berhasil terkirim
      const refreshed = await api.get(`/public/invitation/${slug}`);
      setData(refreshed);
      return { success: true };
    } catch (err) {
      console.error('Gagal mengirim ucapan:', err);
      alert('Gagal mengirim ucapan: ' + (err.message || 'Terjadi kesalahan'));
      return { success: false, error: err.message };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-100">
        <p className="text-stone-500 text-sm animate-pulse">Memuat undangan digital...</p>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-100 p-4">
        <div className="bg-white p-6 rounded-2xl shadow-sm text-center max-w-sm">
          <p className="text-rose-600 font-medium mb-2">Terjadi Kesalahan</p>
          <p className="text-xs text-stone-500">{error}</p>
        </div>
      </div>
    );
  }

  const inv = data?.invitation || DEMO_FALLBACK.invitation;

  // Format tanggal acara
  const eventDateFormatted = inv.event_date
    ? new Date(inv.event_date).toLocaleString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }) + ' WIB'
    : '';

  // Menyelaraskan field database ke props template
  const templateData = {
    ...inv,
    guest_name: guestParam,
    groom_name: inv.person_a_name || 'Mempelai Pria',
    groom_short_name: (inv.person_a_name || 'Pria').split(' ')[0],
    bride_name: inv.person_b_name || 'Mempelai Wanita',
    bride_short_name: (inv.person_b_name || 'Wanita').split(' ')[0],
    cover_image: inv.cover_photo_url || '',
    event_date: inv.event_date,
    event_date_formatted: eventDateFormatted,
    location_name: inv.location_name,
    location_address: inv.location_address,
    location_map_url: inv.location_map_url,
    gallery: inv.gallery_photos || [],
    music_url: inv.music_url,
    wishes: (data?.wishes || []).map((w) => ({
      name: w.guest_name,
      attendance: w.attendance,
      message: w.message,
      created_at: w.created_at,
    })),
    summary: data?.summary || { total_hadir: 0, total_tidak_hadir: 0, total_ragu: 0 },
  };

  const templateSlug = inv.template_slug || 'wedding-premium055';
  const SelectedTemplate = TEMPLATE_COMPONENTS[templateSlug] || TEMPLATE_COMPONENTS['default'];

  return (
    <SelectedTemplate 
      data={templateData} 
      guestName={guestParam} 
      onSendWish={handleSendWish} 
    />
  );
}
