import { NavLink } from 'react-router-dom';
import { Home, MessageSquare, Wrench, History, User } from 'lucide-react';
import '../styles/nav.css';

const LINKS = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/chat', label: 'Chat', icon: MessageSquare },
  { to: '/tools', label: 'Tools', icon: Wrench },
  { to: '/history', label: 'History', icon: History },
  { to: '/profile', label: 'Profile', icon: User }
];

export default function BottomNav() {
  return (
    <nav className="bottom-nav">
      {LINKS.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className={({ isActive }) => `bottom-nav-link${isActive ? ' active' : ''}`}
        >
          <Icon size={19} strokeWidth={2.1} />
          {label}
        </NavLink>
      ))}
    </nav>
  );
}
