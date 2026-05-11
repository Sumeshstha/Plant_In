import { Outlet } from 'react-router-dom';
import BottomNavBar from './BottomNavBar';
import Sidebar from './Sidebar';
import { useLocation } from 'react-router-dom';
import { useState } from 'react';

export default function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const noNavPaths = ['/scan', '/login', '/signup', '/onboarding', '/splash', '/chat'];
  const showNav = !noNavPaths.includes(location.pathname);

  return (
    <div className="min-h-screen">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <main className={showNav ? 'pb-32' : ''}>
        <Outlet context={{ openSidebar: () => setIsSidebarOpen(true) }} />
      </main>
      {showNav && <BottomNavBar />}
    </div>
  );
}
