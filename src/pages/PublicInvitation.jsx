// pages/PublicInvitation.jsx — halaman undangan yang dibagikan ke tamu (/u/:slug)
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../api';

export default function PublicInvitation() {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [rsvpForm, setRsvpForm] = useState({ guest_name: '', attendance: 'hadir', guest_count: 1, message: '' });
  const [rsvpStatus, setRsvpStatus] = useState('idle'); // idle | sending | done | error
  const [rsvpError, setRsvpError] = useState('');

  useEffect(() => {
    api.get(`/public/invitation/${slug}`).then(setData).catch((e) => setError(e.message));
  }, [slug]);

  async function handleRsvp(e) {
    e.preventDefault();
    setRsvpStatus('sending');
    setRsvpError('');
    try {
      await api.post(`/public/invitation/${slug}/rsvp`, rsvpForm);
      setRsvpStatus('done');
      const refreshed = await api.get(`/public/invitation/${slug}`);
      setData(refreshed);
      setRsvpForm({ guest_name: '', attendance: 'hadir', guest_count: 1, message: '' });
    } catch (e) {
      setRsvpError(e.message);
      setRsvpStatus('error');
    }
  }

  if (error) return <div className="container page"><div className="error-msg">{error}</div></div>;
  if (!data) return <div className="container page">Memuat undangan...</div>;

  const inv = data.invitation;
  const eventDate = inv.event_date
    ? new Date(inv.event_date).toLocaleString('id-ID', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
      })
    : '';

  return (
    <div>
      <div
        className="invitation-cover"
        style={inv.cover_photo_url ? { backgroundImage: `linear-gradient(rgba(0,0,0,0.35), rgba(0,0,0,0.45)), url(${inv.cover_photo_url})` } : {}}
      >
        <p style={{ letterSpacing: 2, textTransform: 'uppercase', fontSize: '0.8rem' }}>
          {inv.event_type === 'pernikahan' ? 'Undangan Pernikahan' : 'Undangan Acara'}
        </p>
        <h1>{inv.main_title}</h1>
        {inv.person_a_name && (
          <p style={{ fontSize: '1.1rem' }}>
            {inv.person_a_name}{inv.person_b_name ? ` & ${inv.person_b_name}` : ''}
          </p>
        )}
        <p>{eventDate}</p>
      </div>

      <div className="invitation-section">
        <h2>Waktu & Lokasi</h2>
        <p><strong>{inv.location_name}</strong></p>
        <p style={{ color: 'var(--muted)' }}>{inv.location_address}</p>
        {inv.location_map_url && (
          <a className="btn secondary" href={inv.location_map_url} target="_blank" rel="noreferrer">
            Buka Google Maps
          </a>
        )}
      </div>

      {inv.gallery_photos?.length > 0 && (
        <div className="invitation-section">
          <h2>Galeri</h2>
          <div className="gallery-grid">
            {inv.gallery_photos.map((url, idx) => <img src={url} key={idx} alt={`Galeri ${idx + 1}`} />)}
          </div>
        </div>
      )}

      {inv.music_url && (
        <div className="invitation-section">
          <h2>Musik</h2>
          <audio controls src={inv.music_url} style={{ width: '100%' }} />
        </div>
      )}

      <div className="invitation-section">
        <h2>Konfirmasi Kehadiran (RSVP)</h2>
        <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>
          {data.summary?.total_hadir || 0} tamu akan hadir · {data.summary?.total_tidak_hadir || 0} berhalangan hadir
        </p>

        {rsvpStatus === 'done' && <div className="success-msg">Terima kasih! Konfirmasi Anda sudah kami terima.</div>}
        {rsvpError && <div className="error-msg">{rsvpError}</div>}

        <form className="form-box" onSubmit={handleRsvp} style={{ textAlign: 'left' }}>
          <div className="field">
            <label>Nama Anda</label>
            <input required value={rsvpForm.guest_name}
              onChange={(e) => setRsvpForm({ ...rsvpForm, guest_name: e.target.value })} />
          </div>
          <div className="field">
            <label>Konfirmasi Kehadiran</label>
            <select value={rsvpForm.attendance} onChange={(e) => setRsvpForm({ ...rsvpForm, attendance: e.target.value })}>
              <option value="hadir">Hadir</option>
              <option value="tidak_hadir">Tidak Hadir</option>
              <option value="ragu">Belum Pasti</option>
            </select>
          </div>
          <div className="field">
            <label>Jumlah Tamu</label>
            <input type="number" min={1} value={rsvpForm.guest_count}
              onChange={(e) => setRsvpForm({ ...rsvpForm, guest_count: e.target.value })} />
          </div>
          <div className="field">
            <label>Ucapan & Doa (opsional)</label>
            <textarea value={rsvpForm.message} onChange={(e) => setRsvpForm({ ...rsvpForm, message: e.target.value })} />
          </div>
          <button className="btn" style={{ width: '100%' }} disabled={rsvpStatus === 'sending'}>
            {rsvpStatus === 'sending' ? 'Mengirim...' : 'Kirim Konfirmasi'}
          </button>
        </form>

        <div className="rsvp-list">
          {data.wishes.map((w, idx) => (
            <div className="rsvp-item" key={idx}>
              <strong>{w.guest_name}</strong>
              <span className={`status-badge status-${w.attendance === 'hadir' ? 'paid' : 'pending'}`} style={{ marginLeft: 8 }}>
                {w.attendance === 'hadir' ? 'Hadir' : w.attendance === 'tidak_hadir' ? 'Tidak Hadir' : 'Belum Pasti'}
              </span>
              {w.message && <p style={{ margin: '6px 0 0' }}>{w.message}</p>}
              <div className="meta">{new Date(w.created_at).toLocaleString('id-ID')}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
