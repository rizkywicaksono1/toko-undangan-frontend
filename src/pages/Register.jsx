// src/pages/Register.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import GoogleButton from '../components/GoogleButton';

export default function Register() {
  const { requestRegister, verifyOtp } = useAuth();
  const navigate = useNavigate();

  // step 1 = form data diri, step 2 = input kode OTP
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [otp, setOtp] = useState('');

  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Timer hitung mundur untuk kirim ulang OTP
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  // Handle Step 1: Kirim data sementara & request OTP
  async function handleRequestOtp(e) {
    e.preventDefault();
    setError('');
    setInfo('');
    setLoading(true);

    try {
      const res = await requestRegister(form.name, form.email, form.password);
      setStep(2);
      setResendCooldown(60); // Cooldown 60 detik sebelum bisa kirim ulang
      setInfo(res.message || `Kode OTP telah dikirim ke ${form.email}`);
    } catch (err) {
      setError(err.message || 'Gagal mengirim OTP. Pastikan email valid.');
    } finally {
      setLoading(false);
    }
  }

  // Handle Step 2: Verifikasi OTP 6 digit
  async function handleVerifyOtp(e) {
    e.preventDefault();
    setError('');
    setInfo('');

    if (otp.trim().length !== 6) {
      setError('Masukkan 6 digit kode OTP dengan lengkap.');
      return;
    }

    setLoading(true);
    try {
      await verifyOtp(form.email, otp.trim());
      // Jika berhasil, akun sudah tersimpan di TiDB dan user langsung masuk
    navigate('/');
    } catch (err) {
      setError(err.message || 'Kode OTP salah atau telah kedaluwarsa.');
    } finally {
      setLoading(false);
    }
  }

  // Kirim ulang OTP jika belum diterima
  async function handleResendOtp() {
    if (resendCooldown > 0 || loading) return;
    setError('');
    setInfo('');
    setLoading(true);

    try {
      const res = await requestRegister(form.name, form.email, form.password);
      setResendCooldown(60);
      setOtp('');
      setInfo(res.message || 'Kode OTP baru telah dikirim ke email Anda.');
    } catch (err) {
      setError(err.message || 'Gagal mengirim ulang kode OTP.');
    } finally {
      setLoading(false);
    }
  }

  // ==========================================
  // Tampilan STEP 2: Input Kode OTP
  // ==========================================
  if (step === 2) {
    return (
      <div className="container page">
        <form className="form-box" onSubmit={handleVerifyOtp} style={{ textAlign: 'center' }}>
          <h2>Verifikasi Email</h2>
          <p style={{ fontSize: '0.95rem', color: 'var(--muted)', marginBottom: 18 }}>
            Masukkan 6 digit kode verifikasi yang telah kami kirimkan ke{' '}
            <strong style={{ color: 'var(--text)' }}>{form.email}</strong>.
          </p>

          {info && <div className="success-msg" style={{ marginBottom: 16 }}>{info}</div>}
          {error && <div className="error-msg" style={{ marginBottom: 16 }}>{error}</div>}

          <div className="field" style={{ margin: '20px 0' }}>
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              required
              autoFocus
              placeholder="123456"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              style={{
                fontSize: '1.75rem',
                letterSpacing: '10px',
                textAlign: 'center',
                fontWeight: 'bold',
                padding: '10px',
              }}
            />
          </div>

          <button className="btn" style={{ width: '100%' }} disabled={loading || otp.length !== 6}>
            {loading ? 'Memverifikasi...' : 'Verifikasi & Aktifkan Akun'}
          </button>

          <div style={{ marginTop: 20, fontSize: '0.9rem' }}>
            Tidak menerima kode?{' '}
            {resendCooldown > 0 ? (
              <span style={{ color: 'var(--muted)' }}>
                Kirim ulang dalam <strong>{resendCooldown}s</strong>
              </span>
            ) : (
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={loading}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#b3435c',
                  fontWeight: '600',
                  cursor: 'pointer',
                  padding: 0,
                  textDecoration: 'underline',
                }}
              >
                Kirim Ulang Kode
              </button>
            )}
          </div>

          <p style={{ marginTop: 16, fontSize: '0.85rem' }}>
            Salah memasukkan email?{' '}
            <button
              type="button"
              onClick={() => {
                setStep(1);
                setError('');
                setInfo('');
                setOtp('');
              }}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--muted)',
                cursor: 'pointer',
                textDecoration: 'underline',
              }}
            >
              Ubah Email
            </button>
          </p>
        </form>
      </div>
    );
  }

  // ==========================================
  // Tampilan STEP 1: Form Registrasi Normal
  // ==========================================
  return (
    <div className="container page">
      <form className="form-box" onSubmit={handleRequestOtp}>
        <h2>Daftar Akun</h2>
        <GoogleButton />

        {error && <div className="error-msg">{error}</div>}

        <div className="field">
          <label>Nama Lengkap</label>
          <input
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Nama lengkap Anda"
          />
        </div>

        <div className="field">
          <label>Email</label>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="nama@email.com"
          />
        </div>

        <div className="field">
          <label>Password</label>
          <input
            type="password"
            required
            minLength={6}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="Minimal 6 karakter"
          />
        </div>

        <button className="btn" style={{ width: '100%' }} disabled={loading}>
          {loading ? 'Mengirim Kode OTP...' : 'Daftar & Kirim Kode OTP'}
        </button>

        <p style={{ marginTop: 14, fontSize: '0.9rem' }}>
          Sudah punya akun? <Link to="/masuk">Masuk di sini</Link>
        </p>
      </form>
    </div>
  );
}
