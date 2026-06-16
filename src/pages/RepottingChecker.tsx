import { ArrowLeft, Inbox, CheckCircle2, AlertTriangle, HelpCircle, ChevronRight, RefreshCw, Menu } from 'lucide-react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export default function RepottingChecker() {
  const navigate = useNavigate();
  const { openSidebar } = useOutletContext<{ openSidebar: () => void }>();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, boolean>>({});

  const questions = [
    { text: "Are roots growing through the drainage holes?", weight: 40 },
    { text: "Has it been more than 18 months since the last repotting?", weight: 20 },
    { text: "Is the plant top-heavy and falls over easily?", weight: 15 },
    { text: "Has the growth significantly slowed down or stopped?", weight: 15 },
    { text: "Does the soil dry out much faster than it used to?", weight: 10 },
  ];

  const handleAnswer = (val: boolean) => {
    setAnswers({ ...answers, [step]: val });
    setStep(step + 1);
  };

  const calculateRisk = () => {
    let score = 0;
    Object.entries(answers).forEach(([key, val]) => {
      if (val) score += questions[parseInt(key)].weight;
    });
    return score;
  };

  const score = calculateRisk();

  return (
    <div className="bg-background min-h-screen">
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md px-6 h-16 flex items-center gap-2 border-b border-outline-variant/10">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-surface-container rounded-full transition-colors active:scale-95">
          <ArrowLeft className="w-6 h-6 text-primary" />
        </button>
        <button onClick={openSidebar} className="p-2 hover:bg-surface-container rounded-full transition-colors active:scale-95">
          <Menu className="w-6 h-6 text-primary" />
        </button>
        <h1 className="font-headline font-bold text-xl text-primary">Repotting Checker</h1>
      </header>

      <main className="pt-24 px-6 max-w-2xl mx-auto pb-32">
        <AnimatePresence mode="wait">
          {step < questions.length ? (
            <motion.div
              key="question"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 text-primary rounded-full mb-4">
                  <HelpCircle className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Question {step + 1} of {questions.length}</span>
                  <h2 className="font-headline font-bold text-2xl px-4">{questions[step].text}</h2>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <button 
                  onClick={() => handleAnswer(true)}
                  className="w-full py-6 bg-surface-container-low hover:bg-primary hover:text-on-primary rounded-3xl border border-outline-variant/10 font-bold transition-all flex items-center justify-between px-8 group"
                >
                  Yes, definitely
                  <ChevronRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
                <button 
                  onClick={() => handleAnswer(false)}
                  className="w-full py-6 bg-surface-container-low hover:bg-error/10 hover:text-error rounded-3xl border border-outline-variant/10 font-bold transition-all flex items-center justify-between px-8 group"
                >
                  No, not really
                  <ChevronRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              </div>

              {/* Progress dots */}
              <div className="flex justify-center gap-2 pt-8">
                {questions.map((_, i) => (
                  <div key={i} className={`h-1.5 rounded-full transition-all ${i === step ? 'w-8 bg-primary' : 'w-2 bg-outline-variant/30'}`} />
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-10"
            >
              <div className="relative inline-block">
                <div className={`w-40 h-40 rounded-full border-8 flex items-center justify-center transition-colors ${
                  score > 60 ? 'border-error bg-error/5 text-error' : 
                  score > 30 ? 'border-orange-500 bg-orange-500/5 text-orange-500' : 
                  'border-primary bg-primary/5 text-primary'
                }`}>
                  <div className="text-center">
                    <span className="text-4xl font-headline font-black">{score}%</span>
                    <p className="text-[8px] font-bold uppercase tracking-widest">Urgency</p>
                  </div>
                </div>
                <div className="absolute -bottom-2 -right-2 bg-white p-3 rounded-full shadow-xl border border-outline-variant/10">
                  {score > 60 ? <AlertTriangle className="w-6 h-6 text-error" /> : <CheckCircle2 className="w-6 h-6 text-primary" />}
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="font-headline font-bold text-3xl">
                  {score > 60 ? 'Time to Repot!' : score > 30 ? 'Keep Monitoring' : 'Relax, it\'s fine!'}
                </h2>
                <p className="text-on-surface-variant leading-relaxed max-w-sm mx-auto">
                  {score > 60 
                    ? "Based on your answers, your plant is likely root-bound. It needs a larger home with fresh soil to continue growing healthy." 
                    : score > 30 
                    ? "Your plant shows some signs of needing more space. Check again in 3 months or if leaves start turning yellow."
                    : "Your plant has plenty of space and resources. No need for a new pot at this time!"}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <button 
                  onClick={() => { setStep(0); setAnswers({}); }}
                  className="w-full py-5 bg-surface-container-low text-on-surface rounded-2xl font-bold border border-outline-variant/10 flex items-center justify-center gap-2 hover:bg-surface-container-high transition-colors"
                >
                  <RefreshCw className="w-5 h-5" />
                  Test Again
                </button>
                <button 
                  onClick={() => navigate('/garden')}
                  className="w-full py-5 bg-primary text-on-primary rounded-2xl font-bold shadow-lg shadow-primary/20"
                >
                  Browse Care Tips
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
