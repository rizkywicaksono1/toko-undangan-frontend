// pages/MyOrders.jsx — daftar pesanan milik pelanggan
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';

const STATUS_LABEL = {
  paid: 'Lunas', pending: 'Menunggu', failed: 'Gagal', expired: 'Kedaluwarsa', cancelled: 'Batal',
};

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/orders/my').then(setOrders).catch((e) => setError(e.message));
  }, []);

  return (
    <div className="container page">
      <h2>Pesanan Saya</h2>
      {error && <div className="error-msg">{error}</div>}
      {orders.length === 0 ? (
        <div className="empty-state">Anda belum memiliki pesanan.</div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Template</th><th>Harga</th><th>Status</th><th>Tanggal</th><th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id}>
                <td>{o.template_name}</td>
                <td>Rp {Number(o.amount).toLocaleString('id-ID')}</td>
                <td><span className={`status-badge status-${o.status}`}>{STATUS_LABEL[o.status] || o.status}</span></td>
                <td>{new Date(o.created_at).toLocaleDateString('id-ID')}</td>
                <td>
                  {o.status === 'pending' && <Link className="btn small" to={`/checkout/${o.id}`}>Bayar</Link>}
                  {o.status === 'paid' && !o.invitation_slug && (
                    <Link className="btn small" to={`/editor/order/${o.id}`}>Buka Editor</Link>
                  )}
                  {o.status === 'paid' && o.invitation_slug && (
                    <Link className="btn small secondary" to={`/editor/order/${o.id}`}>Edit Undangan</Link>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
