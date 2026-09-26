// pages/admin/AdminOrders.jsx — melihat semua pesanan & status bayar
import { useEffect, useState } from 'react';
import { api } from '../../api';

const STATUS_LABEL = { paid: 'Lunas', pending: 'Menunggu', failed: 'Gagal', expired: 'Kedaluwarsa', cancelled: 'Batal' };

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/admin/orders').then(setOrders).catch((e) => setError(e.message));
  }, []);

  return (
    <div>
      {error && <div className="error-msg">{error}</div>}
      <table>
        <thead>
          <tr><th>Kode</th><th>Pelanggan</th><th>Template</th><th>Nominal</th><th>Status</th><th>Metode</th><th>Undangan</th><th>Tanggal</th></tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id}>
              <td>{o.order_code}</td>
              <td>{o.customer_name}<br /><small style={{ color: 'var(--muted)' }}>{o.customer_email}</small></td>
              <td>{o.template_name}</td>
              <td>Rp {Number(o.amount).toLocaleString('id-ID')}</td>
              <td><span className={`status-badge status-${o.status}`}>{STATUS_LABEL[o.status] || o.status}</span></td>
              <td>{o.payment_type || '-'}</td>
              <td>{o.invitation_slug ? `/u/${o.invitation_slug}` : '-'}</td>
              <td>{new Date(o.created_at).toLocaleDateString('id-ID')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
