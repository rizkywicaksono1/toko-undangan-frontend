// pages/admin/AdminTemplates.jsx — CRUD template & harga
import { useEffect, useState } from 'react';
import { api } from '../../api';

const emptyForm = { id: null, name: '', category: 'pernikahan', description: '', price: '', thumbnail_url: '', demo_slug: '', is_active: true };

export default function AdminTemplates() {
  const [templates, setTemplates] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  function load() {
    api.get('/admin/templates').then(setTemplates).catch((e) => setError(e.message));
  }
  useEffect(load, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      if (form.id) {
        await api.put(`/admin/templates/${form.id}`, form);
        setSuccess('Template berhasil diperbarui.');
      } else {
        await api.post('/admin/templates', form);
        setSuccess('Template berhasil ditambahkan.');
      }
      setForm(emptyForm);
      load();
    } catch (e) {
      setError(e.message);
    }
  }

  async function handleDelete(id) {
    if (!confirm('Hapus / nonaktifkan template ini?')) return;
    try {
      const res = await api.del(`/admin/templates/${id}`);
      setSuccess(res.message);
      load();
    } catch (e) {
      setError(e.message);
    }
  }

  function handleEdit(t) {
    setForm({ ...t, is_active: !!t.is_active });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <div>
      <form className="form-box" onSubmit={handleSubmit} style={{ maxWidth: 560, marginBottom: 28 }}>
        <h3>{form.id ? 'Ubah Template' : 'Tambah Template Baru'}</h3>
        {error && <div className="error-msg">{error}</div>}
        {success && <div className="success-msg">{success}</div>}
        <div className="field">
          <label>Nama</label>
          <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div className="field">
          <label>Kategori</label>
          <input required value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
            placeholder="pernikahan / ulang_tahun / khitanan / aqiqah" />
        </div>
        <div className="field">
          <label>Deskripsi</label>
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </div>
        <div className="field">
          <label>Harga (Rp)</label>
          <input type="number" required value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
        </div>
        <div className="field">
          <label>URL Thumbnail</label>
          <input value={form.thumbnail_url} onChange={(e) => setForm({ ...form, thumbnail_url: e.target.value })} />
        </div>
        <div className="field">
          <label>Slug Demo (opsional, slug undangan contoh)</label>
          <input value={form.demo_slug || ''} onChange={(e) => setForm({ ...form, demo_slug: e.target.value })} />
        </div>
        <div className="field">
          <label>
            <input type="checkbox" checked={form.is_active} style={{ width: 'auto', marginRight: 8 }}
              onChange={(e) => setForm({ ...form, is_active: e.target.checked })} />
            Aktif / ditampilkan di katalog
          </label>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn">{form.id ? 'Simpan Perubahan' : 'Tambah Template'}</button>
          {form.id && <button type="button" className="btn secondary" onClick={() => setForm(emptyForm)}>Batal</button>}
        </div>
      </form>

      <table>
        <thead>
          <tr><th>Nama</th><th>Kategori</th><th>Harga</th><th>Status</th><th>Aksi</th></tr>
        </thead>
        <tbody>
          {templates.map((t) => (
            <tr key={t.id}>
              <td>{t.name}</td>
              <td>{t.category}</td>
              <td>Rp {Number(t.price).toLocaleString('id-ID')}</td>
              <td>{t.is_active ? 'Aktif' : 'Nonaktif'}</td>
              <td style={{ display: 'flex', gap: 6 }}>
                <button className="btn small secondary" onClick={() => handleEdit(t)}>Ubah</button>
                <button className="btn small danger" onClick={() => handleDelete(t.id)}>Hapus</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
