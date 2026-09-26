import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import VerifyEmail from './pages/VerifyEmail';
import Home from './pages/Home';
import TemplateDetail from './pages/TemplateDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import Checkout from './pages/Checkout';
import OrderStatus from './pages/OrderStatus';
import MyOrders from './pages/MyOrders';
import MyInvitations from './pages/MyInvitations';
import Editor from './pages/Editor';
import PublicInvitation from './pages/PublicInvitation';
import AdminDashboard from './pages/admin/AdminDashboard';

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/template/:id" element={<TemplateDetail />} />
        <Route path="/masuk" element={<Login />} />
        <Route path="/verifikasi-email" element={<VerifyEmail />} />
        <Route path="/daftar" element={<Register />} />
        <Route path="/u/:slug" element={<PublicInvitation />} />

        <Route path="/checkout/:orderId" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
        <Route path="/pesanan/:orderId" element={<ProtectedRoute><OrderStatus /></ProtectedRoute>} />
        <Route path="/pesanan-saya" element={<ProtectedRoute><MyOrders /></ProtectedRoute>} />
        <Route path="/undangan-saya" element={<ProtectedRoute><MyInvitations /></ProtectedRoute>} />
        <Route path="/editor/order/:orderId" element={<ProtectedRoute><Editor /></ProtectedRoute>} />
        <Route path="/editor/:invitationId" element={<ProtectedRoute><Editor /></ProtectedRoute>} />

        <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />

        <Route path="*" element={<div className="container page">Halaman tidak ditemukan.</div>} />
      </Routes>
    </>
  );
}
