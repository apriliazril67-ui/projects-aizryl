import { NavLink } from 'react-router-dom';
import {
  Sparkles,
  MessageSquare,
  Wrench,
  History,
  User,
  LayoutDashboard
} from 'lucide-react';
import '../styles/nav.css';

const LINKS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/chat', label: 'AI Chat', icon: MessageSquare },
  { to: '/tools', label: 'Tools', icon: Wrench },
  { to: '/history', label: 'History', icon: History },
  { to: '/profile', label: 'Profile', icon: User }
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <NavLink to="/" className="sidebar-brand">
        <span className="sidebar-brand-mark">Az</span>
        <span className="sidebar-brand-name">AzryAI</span>
      </NavLink>

      <nav className="sidebar-nav">
        {LINKS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
          >
            <Icon size={18} strokeWidth={2} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <NavLink to="/chat" className="btn btn-primary" style={{ width: '100%' }}>
          <Sparkles size={16} /> Start Chat
        </NavLink>
        <NavLink to="/profile" className="sidebar-user">
          <span className="sidebar-avatar">A</span>
          <div>
            <div style={{ fontSize: 13.5, fontWeight: 600 }}>Azry User</div>
            <div style={{ fontSize: 11.5, color: 'var(--text-low)' }}>Lihat profil</div>
          </div>
        </NavLink>
      </div>
    </aside>
  );
}
