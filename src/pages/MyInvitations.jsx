// pages/MyInvitations.jsx — daftar undangan yang sudah dibuat pelanggan
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';

export default function MyInvitations() {
  const [invitations, setInvitations] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/invitations/my').then(setInvitations).catch((e) => setError(e.message));
  }, []);

  return (
    <div className="container page">
      <h2>Undangan Saya</h2>
      {error && <div className="error-msg">{error}</div>}
      {invitations.length === 0 ? (
        <div className="empty-state">
          Anda belum membuat undangan. Pesan template terlebih dahulu di katalog.
        </div>
      ) : (
        <div className="grid">
          {invitations.map((inv) => (
            <div className="card" key={inv.id}>
              <div className="body">
                <span className="category-tag">{inv.template_name}</span>
                <h3>{inv.main_title || '(Belum diberi judul)'}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>/u/{inv.slug}</p>
                <div className="actions">
                  <Link className="btn small secondary" to={`/u/${inv.slug}`} target="_blank">Buka</Link>
                  <Link className="btn small" to={`/editor/${inv.id}`}>Edit</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
