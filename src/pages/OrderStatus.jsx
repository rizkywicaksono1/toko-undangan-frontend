// pages/OrderStatus.jsx — status pesanan setelah checkout; auto-cek status bayar
import { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../api';

const STATUS_LABEL = {
  paid: 'Lunas',
  pending: 'Menunggu Pembayaran',
  failed: 'Gagal',
  expired: 'Kedaluwarsa',
  cancelled: 'Dibatalkan',
};

export default function OrderStatus() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');
  const intervalRef = useRef(null);

  useEffect(() => {
    function fetchOrder() {
      api.get(`/orders/${orderId}`).then(setOrder).catch((e) => setError(e.message));
    }
    fetchOrder();
    // Polling setiap 4 detik selama masih 'pending', menunggu webhook Midtrans mengonfirmasi.
    intervalRef.current = setInterval(fetchOrder, 4000);
    return () => clearInterval(intervalRef.current);
  }, [orderId]);

  useEffect(() => {
    if (order && order.status !== 'pending' && intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }, [order]);

  if (error) return <div className="container page"><div className="error-msg">{error}</div></div>;
  if (!order) return <div className="container page">Memuat status pesanan...</div>;

  return (
    <div className="container page">
      <div className="form-box" style={{ textAlign: 'center' }}>
        <h2>Status Pesanan</h2>
        <p>Kode Pesanan: <strong>{order.order_code}</strong></p>
        <p>Template: <strong>{order.template_name}</strong></p>
        <p>
          Status:{' '}
          <span className={`status-badge status-${order.status}`}>
            {STATUS_LABEL[order.status] || order.status}
          </span>
        </p>

        {order.status === 'pending' && (
          <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>
            Halaman ini akan otomatis diperbarui begitu pembayaran Anda dikonfirmasi oleh Midtrans.
          </p>
        )}

        {order.status === 'paid' && (
          <Link className="btn" to={`/editor/order/${order.id}`}>
            Buka Editor Undangan
          </Link>
        )}

        {['failed', 'expired', 'cancelled'].includes(order.status) && (
          <Link className="btn secondary" to="/">Kembali ke Katalog</Link>
        )}
      </div>
    </div>
  );
}
