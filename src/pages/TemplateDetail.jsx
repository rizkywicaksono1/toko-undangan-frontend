// pages/TemplateDetail.jsx — detail satu template + tombol pesan/demo
import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';

export default function TemplateDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [template, setTemplate] = useState(null);
  const [error, setError] = useState('');
  const [ordering, setOrdering] = useState(false);

  useEffect(() => {
    api.get(`/templates/${id}`).then(setTemplate).catch((e) => setError(e.message));
  }, [id]);

  async function handleOrder() {
    if (!user) {
      navigate('/masuk', { state: { from: `/template/${id}` } });
      return;
    }
    setOrdering(true);
    setError('');
    try {
      const order = await api.post('/orders', { template_id: Number(id) });
      navigate(`/checkout/${order.order_id}`, { state: order });
    } catch (e) {
      setError(e.message);
    } finally {
      setOrdering(false);
    }
  }

  if (error && !template) return <div className="container page"><div className="error-msg">{error}</div></div>;
  if (!template) return <div className="container page">Memuat...</div>;

  return (
    <div className="container page">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
        <img
          src={template.thumbnail_url || 'https://via.placeholder.com/500x350'}
          alt={template.name}
          style={{ width: '100%', borderRadius: 12, objectFit: 'cover' }}
        />
        <div>
          <span className="category-tag">{template.category}</span>
          <h1>{template.name}</h1>
          <p style={{ color: 'var(--muted)' }}>{template.description}</p>
          <div className="price" style={{ fontSize: '1.4rem', margin: '16px 0' }}>
            Rp {Number(template.price).toLocaleString('id-ID')}
          </div>
          {error && <div className="error-msg">{error}</div>}
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn" onClick={handleOrder} disabled={ordering}>
              {ordering ? 'Memproses...' : 'Pesan Sekarang'}
            </button>
            {template.demo_slug && (
              <Link className="btn secondary" to={`/u/${template.demo_slug}`} target="_blank">
                Lihat Demo
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
