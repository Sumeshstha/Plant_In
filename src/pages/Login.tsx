import { Mail, Lock, Eye, Facebook, ArrowRight, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';

export default function Login() {
  const navigate = useNavigate();

  return (
    <div className="bg-background min-h-screen flex flex-col items-center">
      <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md">
        <div className="flex items-center px-6 h-16 w-full max-w-md mx-auto">
          <button 
            onClick={() => navigate(-1)}
            className="text-primary hover:bg-surface-container transition-colors active:scale-95 duration-200 p-2 rounded-full"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="font-headline font-bold text-xl ml-4 text-primary">Welcome</h1>
        </div>
      </header>

      <main className="flex-grow pt-24 px-6 max-w-md mx-auto w-full relative overflow-hidden pb-12">
        <div className="absolute -top-10 -right-20 w-64 h-64 bg-primary-container/20 rounded-full blur-3xl -z-10" />
        
        <div className="mb-10 text-center relative">
          <div className="inline-block mb-4 p-4 rounded-xl bg-surface-container-low">
             <div className="w-12 h-12 bg-primary-fixed rounded-full flex items-center justify-center text-primary">
                <Mail className="w-6 h-6" />
             </div>
          </div>
          <h2 className="font-headline font-extrabold text-4xl text-primary tracking-tight mb-2">PlantIn</h2>
          <p className="text-on-surface-variant font-medium text-lg italic">Welcome back to the greenhouse.</p>
        </div>

        <div className="bg-surface-container-lowest p-8 rounded-lg shadow-sm border border-outline-variant/10">
          <div className="flex p-1 bg-surface-container rounded-full mb-8">
            <button className="flex-1 py-2 px-4 rounded-full font-bold text-sm bg-primary text-on-primary transition-all shadow-md">
              Email
            </button>
            <button className="flex-1 py-2 px-4 rounded-full font-bold text-sm text-on-surface-variant hover:text-on-surface transition-all">
              Phone
            </button>
          </div>

          <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); navigate('/'); }}>
            <div className="space-y-2">
              <label className="font-bold text-[10px] uppercase tracking-widest text-on-surface-variant ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-outline w-5 h-5" />
                <input className="w-full pl-12 pr-4 py-4 bg-surface-container-low border-none rounded-full focus:ring-2 focus:ring-primary text-on-surface font-medium placeholder:text-outline-variant transition-all" placeholder="hello@plantin.com" type="email" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="font-bold text-[10px] uppercase tracking-widest text-on-surface-variant">Password</label>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-outline w-5 h-5" />
                <input className="w-full pl-12 pr-12 py-4 bg-surface-container-low border-none rounded-full focus:ring-2 focus:ring-primary text-on-surface font-medium placeholder:text-outline-variant transition-all" placeholder="••••••••" type="password" />
                <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-primary">
                  <Eye className="w-5 h-5" />
                </button>
              </div>
              <div className="flex justify-end mt-2">
                <button 
                  onClick={() => navigate('/forgot-password')}
                  className="text-[10px] font-bold text-secondary uppercase tracking-tighter hover:underline" 
                  type="button"
                >
                  Forgot Password?
                </button>
              </div>
            </div>

            <button className="w-full py-4 bg-primary text-on-primary rounded-full font-headline font-bold text-lg shadow-lg hover:shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2" type="submit">
              Sign In
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          <div className="flex items-center my-10 gap-4">
            <div className="flex-grow h-px bg-outline-variant/20" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-outline-variant">Or continue with</span>
            <div className="flex-grow h-px bg-outline-variant/20" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-2 py-3 px-4 border border-outline-variant/20 rounded-full hover:bg-surface-container-low transition-colors active:scale-95">
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBn710IcYeoENjx9WholKXyTaeXqW3reFdH2NKtIoXAjCMfRX_eKYprQ9TMM2M7UeGV8RFZhu4RdaZL3AzI4im5qQddlofGQthHA7DgsAzzY8RUc-GUuAkVKUmXkK12xFfNI2_lOsHe6IqvpKCOT4goKHVun_3W3EiRt0noT7XGbe6zzrKduHSMTEyK4Njnm1wl30MidOtrbnvl0g4YJ6kCMLldtoAmYLKOY_yo4LeE-JnG86X7bsubhvv8DMIoYZ45m3unvxw6rI" alt="Google" className="w-5 h-5" />
              <span className="font-bold text-xs">Google</span>
            </button>
            <button className="flex items-center justify-center gap-2 py-3 px-4 border border-outline-variant/20 rounded-full hover:bg-surface-container-low transition-colors active:scale-95">
              <Facebook className="w-5 h-5 text-[#1877F2] fill-[#1877F2]" />
              <span className="font-bold text-xs">Facebook</span>
            </button>
          </div>
        </div>

        <div className="mt-8 text-center pb-12">
          <p className="font-body text-on-surface-variant font-medium">
            Don't have an account? 
            <button onClick={() => navigate('/signup')} className="text-primary font-bold hover:underline ml-1">Sign Up</button>
          </p>
        </div>
      </main>
    </div>
  );
}
