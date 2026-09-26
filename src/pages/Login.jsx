import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import GoogleButton from '../components/GoogleButton';
import { api } from '../api';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [needsVerification, setNeedsVerification] = useState(false);
  const [resendStatus, setResendStatus] = useState('idle');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setNeedsVerification(false);
    setResendStatus('idle');
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      const dest = location.state?.from || (user.is_admin ? '/admin' : '/');
      navigate(dest);
    } catch (err) {
      setError(err.message);
      if (err.data?.needs_verification) setNeedsVerification(true);
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    setResendStatus('sending');
    try {
      await api.post('/auth/resend-verification', { email: form.email });
      setResendStatus('sent');
    } catch {
      setResendStatus('idle');
    }
  }

  return (
    <div className="container page">
      <form className="form-box" onSubmit={handleSubmit}>
        <h2>Masuk</h2>
        <GoogleButton />
        {error && <div className="error-msg">{error}</div>}

        {needsVerification && (
          <div style={{ marginBottom: 14 }}>
            {resendStatus === 'sent' ? (
              <div className="success-msg">Link verifikasi baru sudah dikirim, silakan cek email Anda.</div>
            ) : (
              <button type="button" className="btn secondary small" onClick={handleResend} disabled={resendStatus === 'sending'}>
                {resendStatus === 'sending' ? 'Mengirim...' : 'Kirim Ulang Email Verifikasi'}
              </button>
            )}
          </div>
        )}

        <div className="field">
          <label>Email</label>
          <input type="email" required value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </div>
        <div className="field">
          <label>Password</label>
          <input type="password" required value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })} />
        </div>
        <button className="btn" style={{ width: '100%' }} disabled={loading}>
          {loading ? 'Memproses...' : 'Masuk'}
        </button>
        <p style={{ marginTop: 14, fontSize: '0.9rem' }}>
          Belum punya akun? <Link to="/daftar">Daftar di sini</Link>
        </p>
      </form>
    </div>
  );
}
