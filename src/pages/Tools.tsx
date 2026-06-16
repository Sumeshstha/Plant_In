import { motion } from 'motion/react';
import TopAppBar from '../components/TopAppBar';
import { Droplets, Moon, Ruler, Bell, Settings, ArrowRight, Sun, CheckCircle2, MessageSquare, Calendar } from 'lucide-react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { useState } from 'react';

export default function Tools() {
  const navigate = useNavigate();
  const { openSidebar } = useOutletContext<{ openSidebar: () => void }>();
  
  const [notifications, setNotifications] = useState({
    daily: true,
    weather: true,
    community: false
  });

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="bg-background min-h-screen">
      <TopAppBar title="Smart Tools" onMenuClick={openSidebar} />
      
      <main className="pt-24 px-6 max-w-2xl mx-auto space-y-12 pb-32">
        <section>
          <h1 className="text-4xl font-extrabold tracking-tight text-on-surface mb-2">Smart Tools</h1>
          <p className="text-on-surface-variant font-medium">Precision instruments for your indoor oasis.</p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Watering Calculator */}
          <div 
            onClick={() => navigate('/tools/watering')}
            className="md:col-span-2 group bg-surface-container-low p-8 rounded-lg relative overflow-hidden flex flex-col md:flex-row gap-8 items-center transition-all hover:bg-surface-container cursor-pointer"
          >
            <div className="flex-1 space-y-4 z-10">
              <div className="flex items-center gap-3">
                <div className="bg-primary p-3 rounded-full text-on-primary">
                  <Droplets className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold">Watering Calculator</h3>
              </div>
              <p className="text-on-surface-variant max-w-sm">Determine exactly how much hydration your plants need based on pot architecture.</p>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-primary ml-1">Pot Size</label>
                  <div className="bg-surface-container-lowest px-4 py-3 rounded-full flex justify-between items-center ring-1 ring-outline-variant/10">
                    <span className="text-sm font-semibold">12 inch</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-primary ml-1">Pot Type</label>
                  <div className="bg-surface-container-lowest px-4 py-3 rounded-full flex justify-between items-center ring-1 ring-outline-variant/10">
                    <span className="text-sm font-semibold">Terracotta</span>
                  </div>
                </div>
              </div>
              <button className="bg-primary text-on-primary px-8 py-3 rounded-full font-bold text-sm mt-4 hover:shadow-lg transition-all active:scale-95">
                Calculate Dosage
              </button>
            </div>
            <div className="relative w-full md:w-48 h-48 rounded-2xl overflow-hidden shadow-sm rotate-3 group-hover:rotate-0 transition-transform duration-500">
              <img src="https://images.unsplash.com/photo-1599591037488-dc78416ca3ec?q=80&w=1000&auto=format&fit=crop" alt="Pot" className="w-full h-full object-cover" />
            </div>
          </div>

          {/* Care Calendar */}
          <div 
            onClick={() => navigate('/tools/calendar')}
            className="bg-on-surface text-surface-container p-8 rounded-lg space-y-6 flex flex-col justify-between cursor-pointer hover:bg-on-surface/90 transition-all"
          >
            <div>
              <div className="flex justify-between items-start">
                <div className="bg-surface-container-low/20 p-3 rounded-full">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <span className="bg-primary text-on-primary text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-tighter">
                  Monthly View
                </span>
              </div>
              <h3 className="text-2xl font-bold mt-4">Care Calendar</h3>
              <p className="text-surface-variant/80 mt-2 text-sm leading-relaxed">Visual timeline for watering, feeding, and repotting tasks.</p>
            </div>
            <div className="border-t border-outline-variant/20 pt-4 flex items-center gap-4">
              <span className="text-4xl font-extrabold">{new Date().getDate()}</span>
              <div className="flex flex-col">
                <span className="text-xs uppercase font-bold tracking-widest">
                  {new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' }).format(new Date())}
                </span>
                <span className="text-sm opacity-70">Advice: Check soil moisture</span>
              </div>
            </div>
          </div>

          {/* Repotting Checker */}
          <div 
            onClick={() => navigate('/tools/repotting')}
            className="bg-surface-container-low p-8 rounded-lg flex flex-col justify-between group cursor-pointer hover:bg-surface-container-high transition-colors"
          >
            <div>
              <div className="bg-tertiary text-on-tertiary w-fit p-3 rounded-full mb-4">
                <Ruler className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold">Repotting Checker</h3>
              <p className="text-on-surface-variant mt-2 text-sm">Visual analysis of root expansion and soil depletion signs.</p>
            </div>
            <div className="flex items-center justify-between mt-8">
              <span className="font-bold text-primary group-hover:translate-x-2 transition-transform inline-flex items-center gap-2">
                Check Now <ArrowRight className="w-4 h-4" />
              </span>
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-surface">
                <img src="https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?q=80&w=1000&auto=format&fit=crop" alt="Roots" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex items-end justify-between">
            <div className="space-y-1">
              <span className="text-secondary font-bold text-xs uppercase tracking-[0.2em]">Safety & Alerts</span>
              <h2 className="text-3xl font-bold">Notifications Manager</h2>
            </div>
            <Settings className="text-primary-container w-10 h-10" />
          </div>
          
          <div className="bg-surface-container-lowest p-4 rounded-xl space-y-1 ring-1 ring-outline-variant/10 shadow-sm">
            {[
              { id: 'daily', label: 'Daily Tasks', sub: 'Watering and pruning schedules', icon: CheckCircle2 },
              { id: 'weather', label: 'Weather Alerts', sub: 'Frost warnings and heat waves', icon: Sun },
              { id: 'community', label: 'Community Comments', sub: 'Expert replies to your plant posts', icon: MessageSquare }
            ].map((item) => (
              <div 
                key={item.id} 
                onClick={() => toggleNotification(item.id as keyof typeof notifications)}
                className="flex items-center justify-between p-4 hover:bg-surface-container-low rounded-lg transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-primary-container/20 text-primary p-2.5 rounded-full">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold">{item.label}</p>
                    <p className="text-xs text-on-surface-variant font-medium">{item.sub}</p>
                  </div>
                </div>
                <button 
                  onClick={() => toggleNotification(item.id as keyof typeof notifications)}
                  className={`w-12 h-6 rounded-full transition-colors relative flex items-center ${notifications[item.id as keyof typeof notifications] ? 'bg-primary' : 'bg-surface-container-highest'}`}
                >
                  <motion.div 
                    animate={{ x: notifications[item.id as keyof typeof notifications] ? 24 : 4 }}
                    className="w-4 h-4 bg-white rounded-full absolute shadow-sm" 
                  />
                </button>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
