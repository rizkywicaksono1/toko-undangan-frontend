// pages/Editor.jsx — editor undangan: diakses via /editor/order/:orderId (setelah bayar)
// atau /editor/:invitationId (mengubah undangan yang sudah ada)
import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../api';

const EVENT_TYPES = [
  { value: 'pernikahan', label: 'Pernikahan' },
  { value: 'ulang_tahun', label: 'Ulang Tahun' },
  { value: 'khitanan', label: 'Khitanan' },
  { value: 'aqiqah', label: 'Aqiqah' },
  { value: 'lainnya', label: 'Lainnya' },
];

const emptyForm = {
  slug: '', event_type: 'pernikahan', main_title: '', person_a_name: '', person_b_name: '',
  event_date: '', location_name: '', location_address: '', location_map_url: '',
  cover_photo_url: '', gallery_photos: [], music_url: '', is_published: true,
};

export default function Editor() {
  const { orderId, invitationId } = useParams();
  const navigate = useNavigate();

  const [invitationDbId, setInvitationDbId] = useState(invitationId || null);
  const [orderInfo, setOrderInfo] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [galleryText, setGalleryText] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [slugStatus, setSlugStatus] = useState(null); // null | 'checking' | 'available' | 'taken'

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError('');
      try {
        if (orderId) {
          const data = await api.get(`/invitations/by-order/${orderId}`);
          setOrderInfo(data.order);
          if (data.invitation) {
            setInvitationDbId(data.invitation.id);
            fillForm(data.invitation);
          } else {
            setForm({ ...emptyForm, main_title: '' });
          }
        } else if (invitationId) {
          const inv = await api.get(`/invitations/${invitationId}`);
          fillForm(inv);
        }
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    load();
    // eslint-disable-next-line
  }, [orderId, invitationId]);

  function fillForm(inv) {
    const gallery = Array.isArray(inv.gallery_photos) ? inv.gallery_photos : JSON.parse(inv.gallery_photos || '[]');
    setForm({
      slug: inv.slug || '',
      event_type: inv.event_type || 'pernikahan',
      main_title: inv.main_title || '',
      person_a_name: inv.person_a_name || '',
      person_b_name: inv.person_b_name || '',
      event_date: inv.event_date ? inv.event_date.slice(0, 16) : '',
      location_name: inv.location_name || '',
      location_address: inv.location_address || '',
      location_map_url: inv.location_map_url || '',
      cover_photo_url: inv.cover_photo_url || '',
      gallery_photos: gallery,
      music_url: inv.music_url || '',
      is_published: !!inv.is_published,
    });
    setGalleryText(gallery.join('\n'));
  }

  async function checkSlug(value) {
    if (!value) return;
    setSlugStatus('checking');
    try {
      const res = await api.get(`/invitations/check-slug/${encodeURIComponent(value)}`);
      setSlugStatus(res.available ? 'available' : 'taken');
    } catch {
      setSlugStatus(null);
    }
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const gallery_photos = galleryText.split('\n').map((s) => s.trim()).filter(Boolean);
      const payload = { ...form, gallery_photos };

      if (invitationDbId) {
        const res = await api.put(`/invitations/${invitationDbId}`, payload);
        setSuccess('Undangan berhasil disimpan.');
        setForm((f) => ({ ...f, slug: res.slug }));
      } else {
        const res = await api.post('/invitations', { ...payload, order_id: Number(orderId) });
        setInvitationDbId(res.id);
        setSuccess('Undangan berhasil dibuat!');
        navigate(`/editor/${res.id}`, { replace: true });
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="container page">Memuat editor...</div>;
  if (error && !invitationDbId && !form.slug) {
    return <div className="container page"><div className="error-msg">{error}</div></div>;
  }

  return (
    <div className="container page">
      <h2>Editor Undangan</h2>
      {orderInfo && <p style={{ color: 'var(--muted)' }}>Template: <strong>{orderInfo.template_name}</strong></p>}
      {error && <div className="error-msg">{error}</div>}
      {success && (
        <div className="success-msg">
          {success}{' '}
          {form.slug && (
            <>
              Lihat di: <Link to={`/u/${form.slug}`} target="_blank">/u/{form.slug}</Link>
            </>
          )}
        </div>
      )}

      <form onSubmit={handleSave} className="editor-layout">
        <div>
          <div className="field">
            <label>Jenis Acara</label>
            <select value={form.event_type} onChange={(e) => setForm({ ...form, event_type: e.target.value })}>
              {EVENT_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>

          <div className="field">
            <label>Link Undangan (slug)</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ color: 'var(--muted)' }}>/u/</span>
              <input
                required
                value={form.slug}
                placeholder="rina-budi"
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                onBlur={(e) => checkSlug(e.target.value)}
              />
            </div>
            {slugStatus === 'checking' && <small>Memeriksa ketersediaan...</small>}
            {slugStatus === 'available' && <small style={{ color: 'green' }}>Slug tersedia ✔</small>}
            {slugStatus === 'taken' && <small style={{ color: 'crimson' }}>Slug sudah dipakai, coba yang lain.</small>}
          </div>

          <div className="field">
            <label>Judul Utama (contoh: "Rina & Budi" / "Ulang Tahun ke-7 Kayla")</label>
            <input required value={form.main_title} onChange={(e) => setForm({ ...form, main_title: e.target.value })} />
          </div>

          <div className="field">
            <label>Nama Utama (mempelai pria / nama yang berulang tahun)</label>
            <input value={form.person_a_name} onChange={(e) => setForm({ ...form, person_a_name: e.target.value })} />
          </div>

          <div className="field">
            <label>Nama Pasangan (opsional, untuk pernikahan)</label>
            <input value={form.person_b_name} onChange={(e) => setForm({ ...form, person_b_name: e.target.value })} />
          </div>

          <div className="field">
            <label>Tanggal & Waktu Acara</label>
            <input type="datetime-local" required value={form.event_date}
              onChange={(e) => setForm({ ...form, event_date: e.target.value })} />
          </div>
        </div>

        <div>
          <div className="field">
            <label>Nama Lokasi</label>
            <input value={form.location_name} onChange={(e) => setForm({ ...form, location_name: e.target.value })} />
          </div>
          <div className="field">
            <label>Alamat Lengkap</label>
            <textarea value={form.location_address} onChange={(e) => setForm({ ...form, location_address: e.target.value })} />
          </div>
          <div className="field">
            <label>Link Google Maps</label>
            <input value={form.location_map_url} placeholder="https://maps.google.com/..."
              onChange={(e) => setForm({ ...form, location_map_url: e.target.value })} />
          </div>
          <div className="field">
            <label>URL Foto Sampul</label>
            <input value={form.cover_photo_url} placeholder="https://..."
              onChange={(e) => setForm({ ...form, cover_photo_url: e.target.value })} />
          </div>
          <div className="field">
            <label>URL Foto Galeri (satu link per baris)</label>
            <textarea value={galleryText} onChange={(e) => setGalleryText(e.target.value)} placeholder={'https://foto1.jpg\nhttps://foto2.jpg'} />
          </div>
          <div className="field">
            <label>URL Musik Latar (opsional, file mp3)</label>
            <input value={form.music_url} onChange={(e) => setForm({ ...form, music_url: e.target.value })} />
          </div>
          <div className="field">
            <label>
              <input type="checkbox" checked={form.is_published}
                onChange={(e) => setForm({ ...form, is_published: e.target.checked })}
                style={{ width: 'auto', marginRight: 8 }} />
              Tampilkan undangan ke publik
            </label>
          </div>
        </div>

        <div style={{ gridColumn: '1 / -1' }}>
          <button className="btn" disabled={saving}>
            {saving ? 'Menyimpan...' : 'Simpan Undangan'}
          </button>
        </div>
      </form>
    </div>
  );
}
