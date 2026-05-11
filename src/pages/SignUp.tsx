import { User, Mail, Lock, Eye, Facebook, ArrowRight, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';

export default function SignUp() {
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

      <main className="flex-grow pt-24 px-6 max-w-md mx-auto w-full relative overflow-hidden pb-32">
        {/* Hero Section */}
        <div className="relative w-full h-48 mb-10 overflow-hidden rounded-lg bg-surface-container-low group">
          <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBMPVuNnc-hk810v96TeXXAjRVKxi3veXpKvNjY2HkrA9GmGcA339Vs6VNci96ChK5v6Ue_FXDfusgBKOrIAqGp9w4Q1z0mn76nM4H_TCc-s55bIn_9DlNI5FORmWyD30z4sch5M5QRhLwoaKVZQicaJESSLaFKzuINY8uUrMgOlmjEqdqHHUtYO_8WmOikYYa8CEB4YGAFLRFLstWxAT6MUgW_bRx6nE0F6pmcsGCKYEJjC8GAGJO72TAvlZvgNDha5LNbCk6OtUs" alt="Hero" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 text-white">
            <h2 className="font-headline font-extrabold text-3xl leading-tight">Join the Community</h2>
            <p className="text-primary-fixed-dim font-body text-sm mt-1">Start your botanical journey today.</p>
          </div>
        </div>

        {/* Toggle Tabs */}
        <div className="bg-surface-container-low p-1.5 rounded-full flex mb-10">
          <button className="flex-1 py-3 text-sm font-bold rounded-full bg-primary text-on-primary transition-all duration-300">
            Email
          </button>
          <button className="flex-1 py-3 text-sm font-bold rounded-full text-on-surface-variant hover:bg-surface-container-high transition-all duration-300">
            Phone
          </button>
        </div>

        {/* Form Fields */}
        <div className="space-y-6">
          <div className="relative">
            <label className="block text-[10px] items-center font-bold uppercase tracking-widest text-primary mb-2 ml-4">Full Name</label>
            <div className="bg-surface-container-lowest rounded-lg px-4 py-4 flex items-center group focus-within:ring-2 ring-primary-container/20 transition-all border border-outline-variant/10">
              <User className="text-outline-variant mr-3 group-focus-within:text-primary transition-colors w-5 h-5" />
              <input className="w-full bg-transparent border-none focus:ring-0 text-on-surface placeholder:text-outline-variant font-body text-sm" placeholder="Rose Gardener" type="text" />
            </div>
          </div>
          <div className="relative">
            <label className="block text-[10px] font-bold uppercase tracking-widest text-primary mb-2 ml-4">Email Address</label>
            <div className="bg-surface-container-lowest rounded-lg px-4 py-4 flex items-center group focus-within:ring-2 ring-primary-container/20 transition-all border border-outline-variant/10">
              <Mail className="text-outline-variant mr-3 group-focus-within:text-primary transition-colors w-5 h-5" />
              <input className="w-full bg-transparent border-none focus:ring-0 text-on-surface placeholder:text-outline-variant font-body text-sm" placeholder="rose@garden.com" type="email" />
            </div>
          </div>
          <div className="relative">
            <label className="block text-[10px] font-bold uppercase tracking-widest text-primary mb-2 ml-4">Create Password</label>
            <div className="bg-surface-container-lowest rounded-lg px-4 py-4 flex items-center group focus-within:ring-2 ring-primary-container/20 transition-all border border-outline-variant/10">
              <Lock className="text-outline-variant mr-3 group-focus-within:text-primary transition-colors w-5 h-5" />
              <input className="w-full bg-transparent border-none focus:ring-0 text-on-surface placeholder:text-outline-variant font-body text-sm" placeholder="••••••••" type="password" />
              <Eye className="text-outline-variant ml-3 cursor-pointer w-5 h-5" />
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <button className="mt-10 w-full bg-primary text-on-primary py-5 rounded-full font-headline font-bold text-lg shadow-lg active:scale-95 transition-all duration-200 flex items-center justify-center gap-2">
          Create Account
          <ArrowRight className="w-5 h-5" />
        </button>

        {/* Divider */}
        <div className="flex items-center my-10 px-4">
          <div className="flex-1 h-px bg-outline-variant opacity-20" />
          <span className="px-4 text-[10px] font-bold text-outline tracking-widest uppercase">Or connect with</span>
          <div className="flex-1 h-px bg-outline-variant opacity-20" />
        </div>

        {/* Social Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <button className="flex items-center justify-center gap-3 bg-surface-container-lowest border border-outline-variant/10 py-4 rounded-lg hover:bg-surface-bright transition-colors active:scale-98">
            <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBeEgOG1tGOPeIQB2R1gmziJuvl1tgPgmaku7ChSVOxDE_rbp2cAWI_wZMc-F2CfwjnLlgtZkr3O9qAEk2_YdCA8E_PE76ia8xq7O4qwk6UCjxhk1cg9TGduIfn9JqNb6M-4Fy22oS1B2WYHf8qMf7crkFVn_xjKdpAvaBQiNhA4tNcnX36HwEtvU1edy9qXqNFlU5NbKbYG5jM_QR7N-QjoB9jpFgDrFW8bcA3jbZ-VCKDyt9PnhZsXknMY8C2twPxvSEOdUQw8uY" alt="Google" className="w-5 h-5" />
            <span className="font-bold text-xs text-on-surface-variant">Google</span>
          </button>
          <button className="flex items-center justify-center gap-3 bg-surface-container-lowest border border-outline-variant/10 py-4 rounded-lg hover:bg-surface-bright transition-colors active:scale-98">
            <Facebook className="w-5 h-5 text-[#1877F2] fill-[#1877F2]" />
            <span className="font-bold text-xs text-on-surface-variant">Facebook</span>
          </button>
        </div>

        {/* Footer */}
        <p className="mt-12 text-center text-on-surface-variant font-body text-sm mb-12">
          Already have an account? 
          <button onClick={() => navigate('/login')} className="text-secondary font-bold hover:underline ml-1">Log In</button>
        </p>

        {/* Bottom Success Hint */}
        <div className="bg-surface-container-high/90 backdrop-blur-md p-4 rounded-lg flex items-center shadow-lg border border-primary/5 mt-auto">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-4">
            <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 2, repeat: Infinity }}>
              <div className="text-primary"><PsychologyIcon /></div>
            </motion.div>
          </div>
          <div>
            <p className="text-[10px] font-bold text-primary uppercase tracking-tighter">Did you know?</p>
            <p className="text-xs font-medium text-on-surface">Joining allows you to track plant vitality in real-time.</p>
          </div>
        </div>
      </main>
    </div>
  );
}

function PsychologyIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-brain"><path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .52 8.105V19a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-1a4 4 0 0 0 .52-8.105 4 4 0 0 0-2.526-5.77A3 3 0 1 0 12 5Z"/><path d="M12 13v8"/><path d="M9 17h6"/><path d="M12 9V5"/></svg>
    )
}
