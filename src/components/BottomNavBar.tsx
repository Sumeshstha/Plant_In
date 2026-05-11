import { Home, Search, Camera, Wrench, Sprout, User, Heart, Settings } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { motion } from 'motion/react';

export default function BottomNavBar() {
  const tabs = [
    { id: 'home', label: 'Home', icon: Home, path: '/' },
    { id: 'search', label: 'Search', icon: Search, path: '/search' },
    { id: 'scan', label: 'Scan', icon: Camera, path: '/scan', primary: true },
    { id: 'tools', label: 'Tools', icon: Wrench, path: '/tools' },
    { id: 'garden', label: 'Garden', icon: Sprout, path: '/garden' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 px-4 pb-8 pt-4 bg-background/90 backdrop-blur-xl rounded-t-[2.5rem] shadow-[0_-4px_24px_rgba(28,29,9,0.04)] flex justify-around items-center">
      {tabs.map((tab) => (
        <NavLink
          key={tab.id}
          to={tab.path}
          className={({ isActive }) => `
            flex flex-col items-center justify-center transition-all duration-300 relative
            ${tab.primary ? '' : isActive ? 'text-primary' : 'text-on-surface/40'}
            ${tab.primary ? 'active:scale-90' : 'hover:opacity-80 active:scale-95'}
          `}
        >
          {({ isActive }) => (
            <>
              {tab.primary ? (
                <div className="bg-primary text-on-primary p-3 rounded-full -mt-12 shadow-lg border-4 border-background">
                  <tab.icon className="w-6 h-6" />
                </div>
              ) : (
                <>
                  <tab.icon className={`w-6 h-6 ${isActive ? 'fill-primary/20' : ''}`} />
                  <span className="font-body text-[10px] font-semibold uppercase tracking-wider mt-1">
                    {tab.label}
                  </span>
                </>
              )}
              {isActive && !tab.primary && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute -bottom-2 w-1 h-1 bg-primary rounded-full"
                />
              )}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
