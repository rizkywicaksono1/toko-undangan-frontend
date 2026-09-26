// pages/admin/AdminRsvps.jsx — melihat semua RSVP dari seluruh undangan
import { useEffect, useState } from 'react';
import { api } from '../../api';

export default function AdminRsvps() {
  const [rsvps, setRsvps] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/admin/rsvps').then(setRsvps).catch((e) => setError(e.message));
  }, []);

  return (
    <div>
      {error && <div className="error-msg">{error}</div>}
      <table>
        <thead>
          <tr><th>Undangan</th><th>Tamu</th><th>Kehadiran</th><th>Jumlah</th><th>Ucapan</th><th>Tanggal</th></tr>
        </thead>
        <tbody>
          {rsvps.map((r) => (
            <tr key={r.id}>
              <td>{r.main_title} <br /><small style={{ color: 'var(--muted)' }}>/u/{r.invitation_slug}</small></td>
              <td>{r.guest_name}</td>
              <td>{r.attendance === 'hadir' ? 'Hadir' : r.attendance === 'tidak_hadir' ? 'Tidak Hadir' : 'Belum Pasti'}</td>
              <td>{r.guest_count}</td>
              <td>{r.message || '-'}</td>
              <td>{new Date(r.created_at).toLocaleDateString('id-ID')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
