import { Outlet } from 'react-router-dom';
import GalaxyBackground from './GalaxyBackground.jsx';
import Sidebar from './Sidebar.jsx';
import BottomNav from './BottomNav.jsx';

export default function Layout() {
  return (
    <div className="app-shell">
      <GalaxyBackground />
      <Sidebar />
      <main className="app-main">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
