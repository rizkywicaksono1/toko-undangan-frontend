// pages/Home.jsx — Katalog template + filter kategori
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';

const CATEGORY_LABELS = {
  pernikahan: 'Pernikahan',
  ulang_tahun: 'Ulang Tahun',
  khitanan: 'Khitanan',
  aqiqah: 'Aqiqah',
};

export default function Home() {
  const [templates, setTemplates] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('semua');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/templates/categories').then(setCategories).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const query = activeCategory === 'semua' ? '' : `?category=${activeCategory}`;
    api
      .get(`/templates${query}`)
      .then(setTemplates)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [activeCategory]);

  return (
    <>
      <section className="hero">
        <h1>Buat Undangan Digital Impianmu</h1>
        <p>Pilih desain, isi detail acara, bagikan link — undanganmu siap dalam hitungan menit.</p>
      </section>

      <div className="container page">
        <div className="filters">
          <button
            className={`chip ${activeCategory === 'semua' ? 'active' : ''}`}
            onClick={() => setActiveCategory('semua')}
          >
            Semua
          </button>
          {categories.map((c) => (
            <button
              key={c}
              className={`chip ${activeCategory === c ? 'active' : ''}`}
              onClick={() => setActiveCategory(c)}
            >
              {CATEGORY_LABELS[c] || c}
            </button>
          ))}
        </div>

        {error && <div className="error-msg">{error}</div>}
        {loading && <p>Memuat template...</p>}
        {!loading && templates.length === 0 && (
          <div className="empty-state">Belum ada template pada kategori ini.</div>
        )}

        <div className="grid">
          {templates.map((t) => (
            <div className="card" key={t.id}>
              <img src={t.thumbnail_url || 'https://via.placeholder.com/400x240?text=Undangan'} alt={t.name} />
              <div className="body">
                <span className="category-tag">{CATEGORY_LABELS[t.category] || t.category}</span>
                <h3>{t.name}</h3>
                <p style={{ color: 'var(--muted)', fontSize: '0.85rem', margin: 0 }}>{t.description}</p>
                <div className="price">Rp {Number(t.price).toLocaleString('id-ID')}</div>
                <div className="actions">
                  <Link className="btn small" to={`/template/${t.id}`}>Lihat Detail</Link>
                  {t.demo_slug && (
                    <Link className="btn small secondary" to={`/u/${t.demo_slug}`} target="_blank">
                      Lihat Demo
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
