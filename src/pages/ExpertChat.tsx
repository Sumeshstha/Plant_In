import { ArrowLeft, Send, Sparkles, Paperclip, MoreVertical, CheckCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';

export default function ExpertChat() {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState([
    { id: 1, role: 'bot', text: 'Hi! I’m Flora, your AI botanical expert. How can I help you and your plants today?', time: '10:00 AM' },
    { id: 2, role: 'user', text: 'My Fiddle Leaf Fig is dropping leaves. What should I do?', time: '10:02 AM' },
    { id: 3, role: 'bot', text: 'This often happens due to sudden changes in light or watering. Have you moved it recently?', time: '10:02 AM' },
    { id: 4, role: 'user', text: 'Yes, I moved it to the hallway last week.', time: '10:03 AM' },
    { id: 5, role: 'bot', text: 'Hallways usually have lower light levels. Ficus lyrata needs bright, filtered light. Try moving it back or closer to a west-facing window.', time: '10:03 AM' },
  ]);

  const handleSend = () => {
    if (!message) return;
    
    const newUserMsg = {
      id: messages.length + 1,
      role: 'user',
      text: message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages([...messages, newUserMsg]);
    setMessage('');

    // Simulate bot response
    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        role: 'bot',
        text: "That's an interesting question! Based on my data, I recommend checking the soil moisture about 2 inches deep. Would you like a detailed care guide for this type of plant?",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1500);
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="bg-background h-screen flex flex-col">
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md px-6 h-20 flex items-center justify-between border-b border-outline-variant/5">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-surface-container rounded-full transition-colors active:scale-95">
            <ArrowLeft className="w-6 h-6 text-primary" />
          </button>
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white shadow-lg overflow-hidden border-2 border-white">
                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBm98IU_zGD3a5Ta4hJxvwXAhMCGCeb-zC6fzK0g0akDH0NjZd263vv3aPs4uw3bnoyji1r7GU46-MfRJ2cFxnuxEunNqOGOKOVFdwgLSQjtjShapNJZYJHZN7mJgM2VZRron_pAZcIzqtBvDuJ52gqJoN3TRgCRNnL0QgbzKzzh7lqtCwVErIMDBtnUqJlnazbqNZn-8pwyn0r1UeU_3lQQrsAyue_JUo0GmQ0R1Bq8cxyTLkFL36y4rTdVao_XN3Jf4LcdNd9mKY" alt="Bot" className="w-full h-full object-cover" />
              </div>
              <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white" />
            </div>
            <div>
              <h1 className="font-headline font-bold text-lg text-primary flex items-center gap-2">
                Expert Flora
                <Sparkles className="w-3.5 h-3.5 text-secondary" />
              </h1>
              <p className="text-[10px] font-bold text-secondary uppercase tracking-widest">Premium Consultation</p>
            </div>
          </div>
        </div>
        <button className="p-2 hover:bg-surface-container rounded-full transition-colors">
          <MoreVertical className="w-6 h-6 text-outline" />
        </button>
      </header>

      <main 
        ref={scrollRef}
        className="flex-1 pt-24 pb-32 px-6 overflow-y-auto space-y-6 hide-scrollbar"
      >
        <div className="text-center py-4">
          <span className="bg-surface-container-high px-4 py-1.5 rounded-full text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Today</span>
        </div>

        {messages.map((msg) => (
          <motion.div 
            key={msg.id} 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[85%] space-y-1`}>
              <div className={`p-4 rounded-2xl shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-primary text-on-primary rounded-tr-none' 
                  : 'bg-surface-container-low text-on-surface rounded-tl-none border border-outline-variant/10'
              }`}>
                <p className="font-body text-sm leading-relaxed">{msg.text}</p>
              </div>
              <div className={`flex items-center gap-1 text-[10px] font-semibold text-outline px-1 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.time}
                {msg.role === 'user' && <CheckCheck className="w-3 h-3 text-primary" />}
              </div>
            </div>
          </motion.div>
        ))}
      </main>

      <footer className="fixed bottom-0 left-0 right-0 px-6 py-8 bg-background/80 backdrop-blur-xl border-t border-outline-variant/10">
        <div className="max-w-2xl mx-auto flex items-center gap-4">
          <button className="p-3 bg-surface-container-low text-primary rounded-full hover:bg-surface-container transition-colors shadow-sm active:scale-95">
            <Paperclip className="w-5 h-5" />
          </button>
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="flex-1 relative group"
          >
            <input 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full bg-surface-container-low border-none rounded-full py-4 pl-6 pr-12 text-sm text-on-surface placeholder:text-outline-variant/60 focus:ring-2 focus:ring-primary/20 transition-all font-medium" 
              placeholder="Ask anything about plant care..." 
              type="text"
            />
            <button 
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-primary text-on-primary rounded-full shadow-lg active:scale-90 transition-all disabled:opacity-50" 
              disabled={!message}
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </footer>
    </div>
  );
}
