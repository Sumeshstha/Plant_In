import { User, Shield, Bell, LogOut, ChevronRight, Sprout, Calendar, Star, Languages, Ruler, Moon, Settings as SettingsIcon, Camera } from 'lucide-react';
import TopAppBar from '../components/TopAppBar';
import { motion } from 'motion/react';
import { useNavigate, useOutletContext } from 'react-router-dom';

export default function Profile() {
  const navigate = useNavigate();
  const { openSidebar } = useOutletContext<{ openSidebar: () => void }>();
  
  const goals = [
    { title: 'The Monstera Project', desc: 'Propagate 5 healthy cuttings', color: 'bg-primary-container', progress: 60, icon: Sprout },
    { title: 'Consistency Streak', desc: 'Log morning misting for 14 days', color: 'bg-secondary-container', progress: 85, icon: Calendar }
  ];

  return (
    <div className="bg-background min-h-screen">
      <TopAppBar title="Digital Greenhouse" onMenuClick={openSidebar} />
      
      <main className="pt-24 px-6 max-w-2xl mx-auto space-y-10 pb-32">
        <section className="relative flex flex-col items-center text-center pt-4">
          <div className="relative mb-6 group">
            <div className="w-32 h-32 rounded-full p-1 bg-gradient-to-tr from-primary to-secondary overflow-hidden">
              <div className="w-full h-full rounded-full overflow-hidden border-4 border-surface shadow-sm relative">
                <img 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBl98IU_zGD3a5Ta4hJxvwXAhMCGCeb-zC6fzK0g0akDH0NjZd263vv3aPs4uw3bnoyji1r7GU46-MfRJ2cFxnuxEunNqOGOKOVFdwgLSQjtjShapNJZYJHZN7mJgM2VZRron_pAZcIzqtBvDuJ52gqJoN3TRgCRNnL0QgbzKzzh7lqtCwVErIMDBtnUqJlnazbqNZn-8pwyn0r1UeU_3lQQrsAyue_JUo0GmQ0R1Bq8cxyTLkFL36y4rTdVao_XN3Jf4LcdNd9mKY" 
                  alt="Avatar" 
                  className="w-full h-full object-cover transition-transform group-hover:scale-110" 
                />
                <button 
                  onClick={() => navigate('/profile/edit')}
                  className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                >
                  <Camera className="w-8 h-8" />
                </button>
              </div>
            </div>
            <div className="absolute -bottom-2 -right-2 bg-secondary text-on-secondary px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg">
              Level 12
            </div>
          </div>
          <h2 className="text-3xl font-headline font-extrabold text-on-surface mb-1 tracking-tight">Elena Green</h2>
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full mb-4">
            <Star className="w-3 h-3 fill-primary" />
            <span className="text-xs font-semibold tracking-wide uppercase">Expert Gardener</span>
          </div>
          <button 
            onClick={() => navigate('/profile/edit')}
            className="mb-2 bg-surface-container-high px-6 py-2 rounded-full text-xs font-bold text-on-surface hover:bg-primary hover:text-on-primary transition-all active:scale-95 border border-outline-variant/10 shadow-sm"
          >
            Edit Profile
          </button>

          <div className="grid grid-cols-2 gap-4 w-full">
            <div className="bg-surface-container-lowest p-6 rounded-lg text-left border border-outline-variant/10 shadow-sm">
              <Sprout className="text-primary mb-3 w-8 h-8" />
              <div className="text-2xl font-headline font-bold text-on-surface">42</div>
              <div className="text-[10px] font-body text-on-surface-variant/80 uppercase tracking-tighter font-bold">Plants Rescued</div>
            </div>
            <div className="bg-surface-container-lowest p-6 rounded-lg text-left border border-outline-variant/10 shadow-sm">
              <Calendar className="text-secondary mb-3 w-8 h-8" />
              <div className="text-2xl font-headline font-bold text-on-surface">312</div>
              <div className="text-[10px] font-body text-on-surface-variant/80 uppercase tracking-tighter font-bold">Days Active</div>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-headline font-bold tracking-tight text-on-surface">My Growth Goals</h3>
            <button className="text-primary font-bold text-sm hover:underline">Edit All</button>
          </div>
          <div className="space-y-4">
            {goals.map((goal, idx) => (
              <div key={idx} className="bg-surface-container-low p-6 rounded-lg hover:bg-surface-container transition-colors shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl ${goal.color} flex items-center justify-center text-on-primary-container`}>
                      <goal.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-headline font-bold text-on-surface">{goal.title}</h4>
                      <p className="text-[10px] font-medium text-on-surface-variant uppercase tracking-wider">{goal.desc}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-primary">{goal.progress}%</span>
                </div>
                <div className="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: `${goal.progress}%` }} />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-xl font-headline font-bold tracking-tight text-on-surface">Account Settings</h3>
          <div className="bg-surface-container-lowest rounded-lg overflow-hidden border border-outline-variant/10 shadow-sm">
            <button 
              onClick={() => navigate('/settings')}
              className="w-full flex items-center justify-between px-6 py-5 hover:bg-surface-container-high transition-colors group"
            >
              <div className="flex items-center gap-4">
                <SettingsIcon className="w-5 h-5 text-primary" />
                <span className="font-bold text-sm text-on-surface">App Settings</span>
              </div>
              <ChevronRight className="w-4 h-4 text-outline-variant group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={() => navigate('/notifications')}
              className="w-full flex items-center justify-between px-6 py-5 hover:bg-surface-container-high transition-colors group"
            >
              <div className="flex items-center gap-4">
                <Bell className="w-5 h-5 text-primary" />
                <span className="font-bold text-sm text-on-surface">Care Reminders</span>
              </div>
              <ChevronRight className="w-4 h-4 text-outline-variant group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={() => navigate('/security')}
              className="w-full flex items-center justify-between px-6 py-5 hover:bg-surface-container-high transition-colors group"
            >
              <div className="flex items-center gap-4">
                <Shield className="w-5 h-5 text-primary" />
                <span className="font-bold text-sm text-on-surface">Privacy & Security</span>
              </div>
              <ChevronRight className="w-4 h-4 text-outline-variant group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={() => navigate('/login')}
              className="w-full flex items-center gap-4 px-6 py-5 hover:bg-surface-container-high transition-colors group"
            >
              <LogOut className="w-5 h-5 text-error" />
              <span className="font-bold text-sm text-error">Logout</span>
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
