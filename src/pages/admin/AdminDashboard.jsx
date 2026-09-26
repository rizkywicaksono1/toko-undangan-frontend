// pages/admin/AdminDashboard.jsx — layout tab untuk panel admin
import { useState } from 'react';
import AdminTemplates from './AdminTemplates';
import AdminOrders from './AdminOrders';
import AdminRsvps from './AdminRsvps';

export default function AdminDashboard() {
  const [tab, setTab] = useState('templates');

  return (
    <div className="container page">
      <h2>Panel Admin</h2>
      <div className="tabs">
        <button className={tab === 'templates' ? 'active' : ''} onClick={() => setTab('templates')}>Template</button>
        <button className={tab === 'orders' ? 'active' : ''} onClick={() => setTab('orders')}>Pesanan</button>
        <button className={tab === 'rsvps' ? 'active' : ''} onClick={() => setTab('rsvps')}>RSVP</button>
      </div>
      {tab === 'templates' && <AdminTemplates />}
      {tab === 'orders' && <AdminOrders />}
      {tab === 'rsvps' && <AdminRsvps />}
    </div>
  );
}
