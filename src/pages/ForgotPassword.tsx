import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 1500);
  };

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
          <h1 className="font-headline font-bold text-xl ml-4 text-primary">Reset Password</h1>
        </div>
      </header>

      <main className="flex-grow pt-32 px-6 max-w-md mx-auto w-full relative overflow-hidden pb-12">
        <div className="absolute -top-10 -left-20 w-64 h-64 bg-secondary-container/20 rounded-full blur-3xl -z-10" />
        
        <AnimatePresence mode="wait">
          {!isSubmitted ? (
            <motion.div
              key="step-input"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="text-center">
                <div className="inline-block mb-6 p-5 rounded-2xl bg-surface-container-low shadow-sm border border-outline-variant/10 text-primary">
                  <ShieldCheck className="w-10 h-10" />
                </div>
                <h2 className="font-headline font-extrabold text-3xl text-primary tracking-tight mb-4">Forgot password?</h2>
                <p className="text-on-surface-variant font-medium leading-relaxed">
                  No worries! Enter the email address associated with your account and we'll send you a recovery link.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="font-bold text-[10px] uppercase tracking-widest text-on-surface-variant ml-1">Email Address</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-outline w-5 h-5 group-focus-within:text-primary transition-colors" />
                    <input 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full pl-12 pr-4 py-4 bg-surface-container-low border-none rounded-2xl focus:ring-2 focus:ring-primary text-on-surface font-medium placeholder:text-outline-variant/50 transition-all" 
                      placeholder="Enter your email" 
                      type="email" 
                    />
                  </div>
                </div>

                <button 
                  disabled={isLoading || !email}
                  className="w-full py-4 bg-primary text-on-primary rounded-2xl font-headline font-bold text-lg shadow-lg hover:shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                  type="submit"
                >
                  {isLoading ? (
                    <div className="w-6 h-6 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin" />
                  ) : (
                    <>
                      Send Recovery Link
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="step-success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-8"
            >
              <div className="inline-block p-6 rounded-full bg-primary/10 text-primary scale-125 mb-4">
                <CheckCircle2 className="w-12 h-12" />
              </div>
              <div>
                <h2 className="font-headline font-extrabold text-3xl text-primary tracking-tight mb-4">Check your email</h2>
                <p className="text-on-surface-variant font-medium leading-relaxed">
                  We've sent a password recovery link to <br/>
                  <span className="text-primary font-bold">{email}</span>
                </p>
              </div>

              <div className="space-y-4">
                <button 
                  onClick={() => navigate('/login')}
                  className="w-full py-4 bg-primary text-on-primary rounded-2xl font-headline font-bold text-lg shadow-md hover:shadow-lg transition-all"
                >
                  Back to Login
                </button>
                <button 
                  onClick={() => setIsSubmitted(false)}
                  className="w-full py-3 text-secondary font-bold uppercase tracking-widest text-[10px] hover:bg-secondary/5 rounded-xl transition-colors"
                >
                  Resend Email
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-12 text-center text-outline-variant text-[10px] font-bold uppercase tracking-[0.2em]">
          PlantIn Secure Authentication
        </div>
      </main>
    </div>
  );
}
