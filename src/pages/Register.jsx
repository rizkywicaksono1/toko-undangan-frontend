import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import GoogleButton from '../components/GoogleButton';

export default function Register() {
  const { register } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      setSubmitted(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="container page">
        <div className="form-box" style={{ textAlign: 'center' }}>
          <h2>Cek Email Anda</h2>
          <div className="success-msg">
            Pendaftaran berhasil! Kami sudah mengirim link verifikasi ke <strong>{form.email}</strong>.
            Silakan klik link tersebut untuk mengaktifkan akun Anda sebelum bisa masuk.
          </div>
          <p style={{ fontSize: '0.9rem', color: 'var(--muted)' }}>
            Tidak menerima email? Cek folder spam, atau coba{' '}
            <Link to="/masuk">masuk</Link> untuk mengirim ulang link verifikasi.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container page">
      <form className="form-box" onSubmit={handleSubmit}>
        <h2>Daftar Akun</h2>
        <GoogleButton />
        {error && <div className="error-msg">{error}</div>}
        <div className="field">
          <label>Nama Lengkap</label>
          <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div className="field">
          <label>Email</label>
          <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </div>
        <div className="field">
          <label>Password</label>
          <input type="password" required minLength={6} value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })} />
        </div>
        <button className="btn" style={{ width: '100%' }} disabled={loading}>
          {loading ? 'Memproses...' : 'Daftar'}
        </button>
        <p style={{ marginTop: 14, fontSize: '0.9rem' }}>
          Sudah punya akun? <Link to="/masuk">Masuk di sini</Link>
        </p>
      </form>
    </div>
  );
}
