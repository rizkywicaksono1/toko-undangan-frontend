// pages/PublicInvitation.jsx — halaman undangan yang dibagikan ke tamu (/u/:slug)
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../api';
import WeddingPremium055 from '../templates/WeddingPremium055';

// Daftar template berdasarkan slug/kode template dari database
const TEMPLATE_COMPONENTS = {
  'wedding-premium055': WeddingPremium055,
  'default': WeddingPremium055, // Fallback jika template belum diset
};

export default function PublicInvitation() {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  // Ambil data undangan dari API backend
  const fetchInvitation = () => {
    setLoading(true);
    api.get(`/public/invitation/${slug}`)
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch((e) => {
        setError(e.message || 'Gagal memuat undangan');
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchInvitation();
  }, [slug]);

  // Handler kirim RSVP / Ucapan ke Backend
  const handleSendWish = async (wishData) => {
    try {
      await api.post(`/public/invitation/${slug}/rsvp`, {
        guest_name: wishData.name || wishData.guest_name,
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

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-100 p-4">
        <div className="bg-white p-6 rounded-2xl shadow-sm text-center max-w-sm">
          <p className="text-rose-600 font-medium mb-2">Terjadi Kesalahan</p>
          <p className="text-xs text-stone-500">{error}</p>
        </div>
      </div>
    );
  }

  if (!data || !data.invitation) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-100 p-4">
        <p className="text-stone-500 text-sm">Undangan tidak ditemukan atau belum dipublikasikan.</p>
      </div>
    );
  }

  const inv = data.invitation;

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

  // Menyelaraskan field dari database TiDB ke format data template
  const templateData = {
    ...inv,
    // Nama pengantin
    groom_name: inv.person_a_name || 'Mempelai Pria',
    groom_short_name: (inv.person_a_name || 'Pria').split(' ')[0],
    bride_name: inv.person_b_name || 'Mempelai Wanita',
    bride_short_name: (inv.person_b_name || 'Wanita').split(' ')[0],
    
    // Foto & Media
    cover_image: inv.cover_photo_url || '',
    event_date: inv.event_date,
    event_date_formatted: eventDateFormatted,
    location_name: inv.location_name,
    location_address: inv.location_address,
    location_map_url: inv.location_map_url,
    gallery: inv.gallery_photos || [],
    music_url: inv.music_url,

    // Data ucapan dari database
    wishes: (data.wishes || []).map((w) => ({
      name: w.guest_name,
      attendance: w.attendance,
      message: w.message,
      created_at: w.created_at,
    })),
    summary: data.summary || { total_hadir: 0, total_tidak_hadir: 0, total_ragu: 0 },
  };

  // Pilih template sesuai template_slug dari database atau default
  const templateSlug = inv.template_slug || 'wedding-premium055';
  const SelectedTemplate = TEMPLATE_COMPONENTS[templateSlug] || TEMPLATE_COMPONENTS['default'];

  return <SelectedTemplate data={templateData} onSendWish={handleSendWish} />;
}
