// pages/Checkout.jsx — memicu popup pembayaran Midtrans Snap
import { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { api } from '../api';

const MIDTRANS_SCRIPT_URL =
  String(import.meta.env.VITE_MIDTRANS_IS_PRODUCTION).toLowerCase() === 'true'
    ? 'https://app.midtrans.com/snap/snap.js'
    : 'https://app.sandbox.midtrans.com/snap/snap.js';

export default function Checkout() {
  const { orderId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [order, setOrder] = useState(location.state || null);
  const [status, setStatus] = useState('idle'); // idle | paying | success | pending | error
  const [error, setError] = useState('');
  const [scriptReady, setScriptReady] = useState(false);

  useEffect(() => {
    if (!order) {
      api.get(`/orders/${orderId}`).then(setOrder).catch((e) => setError(e.message));
    }
  }, [orderId]);

  useEffect(() => {
    const clientKey = import.meta.env.VITE_MIDTRANS_CLIENT_KEY;
    const script = document.createElement('script');
    script.src = MIDTRANS_SCRIPT_URL;
    script.setAttribute('data-client-key', clientKey);
    script.onload = () => setScriptReady(true);
    document.body.appendChild(script);
    return () => document.body.removeChild(script);
  }, []);

  function handlePay() {
    if (!window.snap || !order?.snap_token) return;
    setStatus('paying');
    window.snap.pay(order.snap_token, {
      onSuccess: () => {
        setStatus('success');
        navigate(`/pesanan/${orderId}`);
      },
      onPending: () => {
        setStatus('pending');
        navigate(`/pesanan/${orderId}`);
      },
      onError: () => {
        setStatus('error');
        setError('Pembayaran gagal diproses. Silakan coba lagi.');
      },
      onClose: () => {
        setStatus('idle');
      },
    });
  }

  if (error) return <div className="container page"><div className="error-msg">{error}</div></div>;
  if (!order) return <div className="container page">Memuat pesanan...</div>;

  return (
    <div className="container page">
      <div className="form-box" style={{ textAlign: 'center' }}>
        <h2>Selesaikan Pembayaran</h2>
        <p style={{ color: 'var(--muted)' }}>
          Kode Pesanan: <strong>{order.order_code}</strong>
        </p>
        <p>Klik tombol di bawah untuk membayar via QRIS, transfer bank, atau e-wallet melalui Midtrans.</p>
        <button className="btn" onClick={handlePay} disabled={!scriptReady || status === 'paying'}>
          {scriptReady ? 'Bayar Sekarang' : 'Menyiapkan pembayaran...'}
        </button>
      </div>
    </div>
  );
}
