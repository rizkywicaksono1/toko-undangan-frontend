import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <header className="navbar">
      <Link to="/" className="logo">💌 Undangan Digital</Link>
      <nav>
        <Link to="/">Katalog</Link>
        {user && <Link to="/pesanan-saya">Pesanan Saya</Link>}
        {user && <Link to="/undangan-saya">Undangan Saya</Link>}
       {Boolean(user?.is_admin) && <Link to="/admin">Admin</Link>}
        {!user && <Link to="/masuk">Masuk</Link>}
        {!user && <Link to="/daftar" className="btn small">Daftar</Link>}
        {user && (
          <button className="linklike" onClick={handleLogout}>
            Keluar ({user.name.split(' ')[0]})
          </button>
        )}
      </nav>
    </header>
  );
}
