import { X, Settings, HelpCircle, LogOut, Info, Shield, CreditCard, Share2, LayoutGrid, MessageSquare, Calculator } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { NavLink, useNavigate } from 'react-router-dom';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const navigate = useNavigate();

  const menuItems = [
    { label: 'Settings', icon: Settings, path: '/settings' },
    { label: 'Room Planner', icon: LayoutGrid, path: '/room-planner' },
    { label: 'Smart Tools', icon: Calculator, path: '/tools' },
    { label: 'Expert Chat', icon: MessageSquare, path: '/chat' },
    { label: 'Wishlist', icon: Share2, path: '/wishlist' },
    { label: 'History', icon: Info, path: '/garden' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 bottom-0 w-80 z-[70] bg-background shadow-2xl flex flex-col"
          >
            <div className="p-6 flex items-center justify-between border-b border-outline-variant/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white">
                  <span className="font-headline font-bold text-xl">P</span>
                </div>
                <h2 className="font-headline font-bold text-xl text-primary">PlantIn</h2>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-surface-container rounded-full transition-colors">
                <X className="w-6 h-6 text-on-surface-variant" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 py-6 space-y-2">
              {menuItems.map((item) => (
                <NavLink
                  key={item.label}
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) => `
                    flex items-center gap-4 px-4 py-4 rounded-xl transition-all group
                    ${isActive ? 'bg-primary text-on-primary shadow-lg shadow-primary/20' : 'text-on-surface-variant hover:bg-surface-container-low hover:text-primary'}
                  `}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-bold text-sm">{item.label}</span>
                </NavLink>
              ))}
            </div>

            <div className="p-6 border-t border-outline-variant/10 space-y-6">
              <button className="flex items-center gap-4 w-full px-4 py-4 text-on-surface-variant hover:text-primary transition-colors">
                <Share2 className="w-5 h-5" />
                <span className="font-bold text-sm">Tell a Friend</span>
              </button>
              
              <button 
                onClick={() => { navigate('/login'); onClose(); }}
                className="flex items-center gap-4 w-full px-4 py-4 text-error bg-error-container/10 rounded-xl hover:bg-error-container/20 transition-all font-bold"
              >
                <LogOut className="w-5 h-5" />
                <span className="text-sm">Log Out</span>
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
