import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Lock, Smartphone, ShieldCheck, History, Laptop, LogOut, ChevronRight, AlertTriangle } from 'lucide-react';
import { motion } from 'motion/react';

export default function AccountSecurity() {
  const navigate = useNavigate();
  const [twoStepEnabled, setTwoStepEnabled] = useState(true);

  const sessions = [
    { device: 'iPhone 15 Pro', status: 'Current Session', icon: Smartphone, lastActive: 'Now' },
    { device: 'MacBook Pro 16"', status: 'San Francisco, USA', icon: Laptop, lastActive: '2 days ago' },
  ];

  return (
    <div className="bg-background min-h-screen">
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md px-6 h-16 flex items-center">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-surface-container rounded-full transition-colors active:scale-95 mr-4">
          <ArrowLeft className="w-6 h-6 text-primary" />
        </button>
        <h1 className="font-headline font-bold text-xl text-primary">Account Security</h1>
      </header>

      <main className="pt-24 px-6 max-w-2xl mx-auto pb-32 space-y-10">
        {/* Core Protection */}
        <section className="space-y-4">
          <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant/60 ml-1">Authentication</h2>
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 shadow-sm overflow-hidden">
            <button className="w-full flex items-center justify-between p-5 hover:bg-surface-container-low transition-colors group border-b border-outline-variant/5">
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-xl bg-primary/10 text-primary">
                  <Lock className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="font-bold text-sm">Change Password</p>
                  <p className="text-[10px] text-on-surface-variant">Last updated 3 months ago</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-outline" />
            </button>

            <div className="p-5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-xl bg-secondary-container/30 text-on-secondary-container">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-sm">Two-Step Verification</p>
                  <p className="text-[10px] text-on-surface-variant">Secure your account with code</p>
                </div>
              </div>
              <button 
                onClick={() => setTwoStepEnabled(!twoStepEnabled)}
                className={`w-12 h-6 rounded-full relative transition-all duration-300 ${twoStepEnabled ? 'bg-primary' : 'bg-surface-container-highest'}`}
              >
                <motion.div 
                  animate={{ x: twoStepEnabled ? 24 : 4 }}
                  className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
                />
              </button>
            </div>
          </div>
        </section>

        {/* Active Sessions */}
        <section className="space-y-4">
          <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant/60 ml-1">Where You're Logged In</h2>
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 shadow-sm overflow-hidden">
            {sessions.map((session, idx) => (
              <div key={idx} className="flex items-center justify-between p-5 hover:bg-surface-container-low transition-colors border-b border-outline-variant/5 last:border-0">
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-xl bg-surface-container text-on-surface-variant">
                    <session.icon className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-sm">{session.device}</p>
                    <p className="text-[10px] text-primary font-medium">{session.status} • {session.lastActive}</p>
                  </div>
                </div>
                {idx > 0 && (
                  <button className="text-[10px] font-bold text-error uppercase tracking-widest hover:bg-error/5 px-3 py-1 rounded-full">
                    Log Out
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Security Log */}
        <section className="space-y-4">
          <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant/60 ml-1">Recent Activity</h2>
          <div className="bg-white p-5 rounded-2xl flex items-center justify-between border border-outline-variant/10">
            <div className="flex items-center gap-4 text-left">
              <div className="p-2 rounded-xl bg-surface-container text-on-surface-variant">
                <History className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-sm">Security Log</p>
                <p className="text-[10px] text-on-surface-variant">View last 30 days of activity</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-outline" />
          </div>
        </section>

        {/* Danger Zone */}
        <div className="pt-6 space-y-4">
          <div className="bg-error-container/5 border border-error/10 p-6 rounded-2xl">
            <div className="flex items-start gap-4 mb-4">
              <AlertTriangle className="w-6 h-6 text-error shrink-0" />
              <div>
                <p className="font-bold text-sm text-on-surface">Data Protection</p>
                <p className="text-xs text-on-surface-variant leading-relaxed">Deactivating your account will remove all your garden history and plant care logs. This action is permanent.</p>
              </div>
            </div>
            <button className="w-full py-3 text-error font-bold text-sm border border-error/20 rounded-xl hover:bg-error hover:text-white transition-all active:scale-[0.98]">
              Deactivate My Account
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
