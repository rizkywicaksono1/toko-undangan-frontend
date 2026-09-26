// pages/VerifyEmail.jsx — halaman tujuan link verifikasi dari email (/verifikasi-email?token=...)
import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { api } from '../api';

export default function VerifyEmail() {
  const [params] = useSearchParams();
  const token = params.get('token');
  const [status, setStatus] = useState('checking');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Link verifikasi tidak valid — token tidak ditemukan.');
      return;
    }
    api
      .get(`/auth/verify-email?token=${encodeURIComponent(token)}`)
      .then((res) => {
        setStatus('success');
        setMessage(res.message);
      })
      .catch((err) => {
        setStatus('error');
        setMessage(err.message);
      });
  }, [token]);

  return (
    <div className="container page">
      <div className="form-box" style={{ textAlign: 'center' }}>
        <h2>Verifikasi Email</h2>
        {status === 'checking' && <p>Memverifikasi email Anda...</p>}
        {status === 'success' && (
          <>
            <div className="success-msg">{message}</div>
            <Link className="btn" to="/masuk">Masuk Sekarang</Link>
          </>
        )}
        {status === 'error' && (
          <>
            <div className="error-msg">{message}</div>
            <Link className="btn secondary" to="/masuk">Kembali ke Halaman Masuk</Link>
          </>
        )}
      </div>
    </div>
  );
}
