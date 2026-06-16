import { ArrowLeft, Bell, Calendar, Droplets, Info, Star, ChevronRight, MessageSquare, Trash2, Check, Settings as SettingsIcon, Menu } from 'lucide-react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';

interface Notification {
  id: number;
  title: string;
  desc: string;
  time: string;
  type: 'care' | 'system' | 'community' | 'news';
  isRead: boolean;
  icon: any;
  color: string;
}

export default function Notifications() {
  const navigate = useNavigate();
  const { openSidebar } = useOutletContext<{ openSidebar: () => void }>();
  const [notifications, setNotifications] = useState<Notification[]>([
    { 
      id: 1, 
      title: 'Watering Reminder', 
      desc: 'Your Monstera Deliciosa needs watering today to stay healthy.', 
      time: 'Just now', 
      type: 'care', 
      isRead: false,
      icon: Droplets,
      color: 'bg-blue-500'
    },
    { 
      id: 2, 
      title: 'Expert Response', 
      desc: 'Expert Flora replied to your question about leaf browning.', 
      time: '2 hours ago', 
      type: 'community', 
      isRead: false,
      icon: MessageSquare,
      color: 'bg-purple-500'
    },
    { 
      id: 3, 
      title: 'Security Alert', 
      desc: 'New login detected from a MacBook Pro in San Francisco.', 
      time: 'Yesterday', 
      type: 'system', 
      isRead: true,
      icon: Info,
      color: 'bg-orange-500'
    },
    { 
      id: 4, 
      title: 'Level Up!', 
      desc: 'Congratulations! You\'ve reached Level 12: Expert Gardener.', 
      time: '2 days ago', 
      type: 'system', 
      isRead: true,
      icon: Star,
      color: 'bg-yellow-500'
    },
    { 
      id: 5, 
      title: 'Spring Care Guide', 
      desc: 'Spring is here! Check out our new guide for repotting indoor plants.', 
      time: '3 days ago', 
      type: 'news', 
      isRead: true,
      icon: Calendar,
      color: 'bg-green-500'
    }
  ]);

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const deleteNotification = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div className="bg-background min-h-screen">
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md px-6 h-16 flex items-center justify-between border-b border-outline-variant/10">
        <div className="flex items-center gap-2">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-surface-container rounded-full transition-colors active:scale-95">
            <ArrowLeft className="w-6 h-6 text-primary" />
          </button>
          <button onClick={openSidebar} className="p-2 hover:bg-surface-container rounded-full transition-colors active:scale-95">
            <Menu className="w-6 h-6 text-primary" />
          </button>
          <h1 className="font-headline font-bold text-xl text-primary">Notifications</h1>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => navigate('/settings')}
            className="p-2 hover:bg-surface-container rounded-full transition-colors active:scale-95"
          >
            <SettingsIcon className="w-5 h-5 text-primary" />
          </button>
          <button 
            onClick={markAllRead}
            className="text-[10px] font-bold text-secondary uppercase tracking-widest hover:bg-secondary/5 px-3 py-1.5 rounded-full transition-colors"
          >
            Mark all read
          </button>
        </div>
      </header>

      <main className="pt-24 pb-32 px-6 max-w-2xl mx-auto space-y-4">
        <AnimatePresence initial={false}>
          {notifications.length > 0 ? (
            notifications.map((notif) => (
              <motion.div
                key={notif.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className={`group relative p-5 rounded-2xl border transition-all duration-300 ${
                  notif.isRead 
                  ? 'bg-surface-container-lowest border-outline-variant/10 opacity-70' 
                  : 'bg-white border-primary/20 shadow-md ring-1 ring-primary/5'
                }`}
              >
                <div className="flex gap-4">
                  <div className={`shrink-0 w-12 h-12 rounded-xl ${notif.color} flex items-center justify-center text-white shadow-lg`}>
                    <notif.icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <h3 className={`font-bold text-sm ${notif.isRead ? 'text-on-surface-variant' : 'text-on-surface'}`}>
                        {notif.title}
                      </h3>
                      <span className="text-[10px] font-semibold text-outline-variant">{notif.time}</span>
                    </div>
                    <p className={`text-xs leading-relaxed ${notif.isRead ? 'text-on-surface-variant/80' : 'text-on-surface-variant font-medium'}`}>
                      {notif.desc}
                    </p>
                  </div>
                </div>
                
                <div className="mt-4 flex items-center justify-between border-t border-outline-variant/5 pt-3">
                  <div className="flex items-center gap-2">
                    {!notif.isRead && (
                      <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
                    )}
                    <span className="text-[10px] font-bold uppercase tracking-widest text-secondary">{notif.type}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => deleteNotification(notif.id)}
                      className="p-2 hover:bg-error-container/10 text-outline-variant hover:text-error rounded-full transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button className="p-2 hover:bg-surface-container-high rounded-full text-primary transition-all">
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
              <div className="w-20 h-20 bg-surface-container-low rounded-full flex items-center justify-center text-outline-variant">
                <Bell className="w-10 h-10" />
              </div>
              <div className="space-y-1">
                <h3 className="font-headline font-bold text-xl text-on-surface">All caught up!</h3>
                <p className="text-sm text-on-surface-variant px-10">No new notifications at the moment. We'll alert you when there's news or care tasks.</p>
              </div>
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
