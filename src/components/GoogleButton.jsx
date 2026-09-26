// components/GoogleButton.jsx — tombol "Lanjutkan dengan Google" (Google Identity Services)
// Kalau VITE_GOOGLE_CLIENT_ID belum diisi di .env, komponen ini tidak menampilkan apa pun
// dan TIDAK memengaruhi form daftar/masuk manual di bawahnya.
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

let scriptLoadingPromise = null;
function loadGoogleScript() {
  if (window.google?.accounts?.id) return Promise.resolve();
  if (scriptLoadingPromise) return scriptLoadingPromise;
  scriptLoadingPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = resolve;
    script.onerror = reject;
    document.body.appendChild(script);
  });
  return scriptLoadingPromise;
}

export default function GoogleButton() {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const divRef = useRef(null);
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState('');

  useEffect(() => {
    if (!clientId) return; // Login Google dimatikan bila client ID belum diisi

    let cancelled = false;

    async function handleCredentialResponse(response) {
      setError('');
      try {
        const user = await loginWithGoogle(response.credential);
        const dest = location.state?.from || (user.is_admin ? '/admin' : '/');
        navigate(dest);
      } catch (e) {
        setError(e.message);
      }
    }

    loadGoogleScript()
      .then(() => {
        if (cancelled || !divRef.current || !window.google?.accounts?.id) return;
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: handleCredentialResponse,
        });
        window.google.accounts.id.renderButton(divRef.current, {
          theme: 'outline',
          size: 'large',
          width: 320,
          text: 'continue_with',
          locale: 'id',
        });
      })
      .catch(() => setError('Gagal memuat layanan Google. Periksa koneksi internet Anda.'));

    return () => {
      cancelled = true;
    };
  }, [clientId]);

  if (!clientId) return null;

  return (
    <div style={{ margin: '18px 0' }}>
      <div ref={divRef} style={{ display: 'flex', justifyContent: 'center' }} />
      {error && <div className="error-msg" style={{ marginTop: 10 }}>{error}</div>}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '18px 0', color: 'var(--muted)', fontSize: '0.85rem' }}>
        <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
        atau
        <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
      </div>
    </div>
  );
}
