import { ArrowLeft, Bell, Shield, Languages, Ruler, Moon, HelpCircle, Info, ChevronRight, LogOut, Lock, User, Check, Menu, Sliders } from 'lucide-react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export default function Settings() {
  const navigate = useNavigate();
  const { openSidebar } = useOutletContext<{ openSidebar: () => void }>();
  const [activeSub, setActiveSub] = useState<string | null>(null);
  
  const [theme, setTheme] = useState(() => localStorage.getItem('pref-theme') || 'system');
  const [language, setLanguage] = useState(() => localStorage.getItem('pref-language') || 'en');
  const [units, setUnits] = useState(() => localStorage.getItem('pref-units') || 'metric');
  const [layoutDensity, setLayoutDensity] = useState(() => localStorage.getItem('pref-density') || 'compact');

  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('pref-notifications');
    return saved ? JSON.parse(saved) : {
      watering: true,
      misting: true,
      feeding: false,
      community: true,
      news: false
    };
  });

  useEffect(() => {
    localStorage.setItem('pref-theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('pref-language', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('pref-units', units);
  }, [units]);

  useEffect(() => {
    localStorage.setItem('pref-density', layoutDensity);
    // Dispatch custom event to let other mounted components know of a sync if needed
    window.dispatchEvent(new Event('storage'));
  }, [layoutDensity]);

  useEffect(() => {
    localStorage.setItem('pref-notifications', JSON.stringify(notifications));
  }, [notifications]);

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const sections = [
    {
      title: 'General',
      items: [
        { icon: User, label: 'Profile Information', sub: 'Elena Green, Level 12', path: '/profile/edit' },
        { icon: Moon, label: 'Appearance', sub: theme.charAt(0).toUpperCase() + theme.slice(1), id: 'appearance' },
        { icon: Sliders, label: 'Display Density', sub: layoutDensity === 'compact' ? 'Compact (Mobile Optimized)' : 'Comfortable (Standard)', id: 'layoutDensity' },
        { icon: Languages, label: 'Language', sub: language === 'en' ? 'English (US)' : language === 'es' ? 'Español' : 'Français', id: 'language' },
        { icon: Ruler, label: 'Units', sub: units === 'metric' ? 'Metric (Celsius, cm)' : 'Imperial (Fahrenheit, in)', id: 'units' },
      ]
    },
    {
      title: 'Security',
      items: [
        { icon: Shield, label: 'Privacy Policy', sub: 'Last updated Mar 2024', id: 'privacy' },
        { icon: Lock, label: 'Account Security', sub: 'Two-factor auth enabled', path: '/security' },
      ]
    }
  ];

  return (
    <div className="bg-background min-h-screen">
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md px-6 h-16 flex items-center justify-between border-b border-outline-variant/10">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-surface-container rounded-full transition-colors active:scale-95"
          >
            <ArrowLeft className="w-6 h-6 text-primary" />
          </button>
          <button 
            onClick={openSidebar}
            className="p-2 hover:bg-surface-container rounded-full transition-colors active:scale-95"
          >
            <Menu className="w-6 h-6 text-primary" />
          </button>
          <h1 className="font-headline font-bold text-xl text-primary tracking-tight">Settings</h1>
        </div>
      </header>

      <main className="pt-24 px-6 max-w-2xl mx-auto pb-32 space-y-10">
        {/* Notifications Section */}
        <section>
          <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-4 ml-1">Notification Settings</h2>
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 shadow-sm overflow-hidden">
            {[
              { id: 'watering', label: 'Watering Reminders', icon: Bell },
              { id: 'misting', label: 'Misting Alerts', icon: Bell },
              { id: 'feeding', label: 'Fertilizer Schedules', icon: Bell },
              { id: 'community', label: 'Community Mentions', icon: Bell },
              { id: 'news', label: 'Botanical News', icon: Bell },
            ].map((item) => (
              <div key={item.id} className="flex items-center justify-between p-5 hover:bg-surface-container-low transition-colors border-b border-outline-variant/5 last:border-0">
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-full ${notifications[item.id as keyof typeof notifications] ? 'bg-primary/10 text-primary' : 'bg-surface-container text-outline'}`}>
                    <item.icon className="w-5 h-5" />
                  </div>
                  <span className="font-bold text-sm text-on-surface">{item.label}</span>
                </div>
                <button 
                  onClick={() => toggleNotification(item.id as keyof typeof notifications)}
                  className={`w-12 h-6 rounded-full relative transition-all duration-300 ${notifications[item.id as keyof typeof notifications] ? 'bg-primary' : 'bg-surface-container-highest'}`}
                >
                  <motion.div 
                    animate={{ x: notifications[item.id as keyof typeof notifications] ? 24 : 4 }}
                    className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
                  />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Dynamic Sections */}
        {sections.map((section) => (
          <section key={section.title}>
            <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant/60 mb-4 ml-1">{section.title}</h2>
            <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 shadow-sm overflow-hidden">
              {section.items.map((item) => (
                <button 
                  key={item.label} 
                  onClick={() => {
                    if (item.path) navigate(item.path);
                    else if (item.id) setActiveSub(item.id);
                  }}
                  className="w-full flex items-center justify-between p-5 hover:bg-surface-container-low transition-colors border-b border-outline-variant/5 last:border-0 group"
                >
                  <div className="flex items-center gap-4 text-left">
                    <div className="p-2 rounded-full bg-surface-container text-primary group-hover:bg-primary-container group-hover:text-on-primary-container transition-colors">
                      <item.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-on-surface">{item.label}</p>
                      <p className="text-[10px] font-medium text-on-surface-variant uppercase tracking-tight">{item.sub}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-outline group-hover:translate-x-1 transition-transform" />
                </button>
              ))}
            </div>
          </section>
        ))}

        {/* Danger Zone */}
        <section className="pt-6">
          <button 
            onClick={() => navigate('/login')}
            className="w-full flex items-center justify-center gap-3 p-5 rounded-2xl bg-error-container/10 border border-error/10 text-error hover:bg-error-container/20 transition-all font-bold active:scale-[0.98]"
          >
            <LogOut className="w-5 h-5" />
            <span>Log Out of My Account</span>
          </button>
          <p className="text-center text-[10px] text-outline mt-6 font-medium uppercase tracking-widest">Version 2.4.1 (Spark)</p>
        </section>
      </main>

      {/* Sub-settings Overlays */}
      <AnimatePresence>
        {activeSub && (
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[60] bg-background"
          >
            <header className="h-16 flex items-center px-6 border-b border-outline-variant/10">
              <button 
                onClick={() => setActiveSub(null)}
                className="p-2 hover:bg-surface-container rounded-full transition-colors active:scale-95 mr-4"
              >
                <ArrowLeft className="w-6 h-6 text-primary" />
              </button>
              <h2 className="font-headline font-bold text-xl text-primary capitalize">{activeSub}</h2>
            </header>

            <div className="p-6 space-y-6">
              {activeSub === 'appearance' && (
                <div className="space-y-4">
                  {['light', 'dark', 'system'].map(t => (
                    <button 
                      key={t}
                      onClick={() => setTheme(t)}
                      className={`w-full p-5 rounded-2xl flex items-center justify-between border-2 transition-all ${theme === t ? 'border-primary bg-primary/5' : 'border-outline-variant/10 bg-surface-container-low'}`}
                    >
                      <span className="font-bold capitalize">{t}</span>
                      {theme === t && <Check className="w-5 h-5 text-primary" />}
                    </button>
                  ))}
                </div>
              )}

              {activeSub === 'language' && (
                <div className="space-y-4">
                  {[
                    { id: 'en', label: 'English (US)' },
                    { id: 'es', label: 'Español' },
                    { id: 'fr', label: 'Français' }
                  ].map(l => (
                    <button 
                      key={l.id}
                      onClick={() => setLanguage(l.id)}
                      className={`w-full p-5 rounded-2xl flex items-center justify-between border-2 transition-all ${language === l.id ? 'border-primary bg-primary/5' : 'border-outline-variant/10 bg-surface-container-low'}`}
                    >
                      <span className="font-bold">{l.label}</span>
                      {language === l.id && <Check className="w-5 h-5 text-primary" />}
                    </button>
                  ))}
                </div>
              )}

              {activeSub === 'units' && (
                <div className="space-y-4">
                  {[
                    { id: 'metric', label: 'Metric', sub: 'Celsius, cm, meters' },
                    { id: 'imperial', label: 'Imperial', sub: 'Fahrenheit, in, feet' }
                  ].map(u => (
                    <button 
                      key={u.id}
                      onClick={() => setUnits(u.id)}
                      className={`w-full p-5 rounded-2xl flex items-center justify-between border-2 transition-all ${units === u.id ? 'border-primary bg-primary/5' : 'border-outline-variant/10 bg-surface-container-low'}`}
                    >
                      <div className="text-left">
                        <p className="font-bold">{u.label}</p>
                        <p className="text-xs text-on-surface-variant">{u.sub}</p>
                      </div>
                      {units === u.id && <Check className="w-5 h-5 text-primary" />}
                    </button>
                  ))}
                </div>
              )}

              {activeSub === 'layoutDensity' && (
                <div className="space-y-4">
                  {[
                    { id: 'compact', label: 'Compact Spacing', sub: 'Optimized for small mobile screens. Snugger rows, less vertical gaps, and auto-adjusted card sizing so everything is at your fingertips.' },
                    { id: 'comfortable', label: 'Comfortable Spacing', sub: 'Standard layout with generous spacing, larger margins, and roomier gutters.' }
                  ].map(d => (
                    <button 
                      key={d.id}
                      onClick={() => setLayoutDensity(d.id)}
                      className={`w-full p-5 rounded-2xl flex items-center justify-between border-2 transition-all text-left ${layoutDensity === d.id ? 'border-primary bg-primary/5' : 'border-outline-variant/10 bg-surface-container-low'}`}
                    >
                      <div className="pr-4">
                        <p className="font-bold">{d.label}</p>
                        <p className="text-xs text-on-surface-variant mt-1">{d.sub}</p>
                      </div>
                      {layoutDensity === d.id && <Check className="w-5 h-5 text-primary shrink-0" />}
                    </button>
                  ))}
                </div>
              )}

              {activeSub === 'privacy' && (
                <div className="prose prose-sm max-w-none text-on-surface-variant leading-relaxed">
                  <h3 className="text-on-surface font-bold">Your Privacy Matters</h3>
                  <p>At PlantIn, we are committed to protecting your personal data and your plants' health records. This policy explains how we collect and use information.</p>
                  <h4 className="text-on-surface font-bold mt-4">1. Data Collection</h4>
                  <p>We collect botanical data you provide (plant photos, health reports) to improve our AI diagnosis tools.</p>
                  <h4 className="text-on-surface font-bold mt-4">2. Sharing</h4>
                  <p>Your data is never sold to third parties. We only share anonymized data with botanical research partners.</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
