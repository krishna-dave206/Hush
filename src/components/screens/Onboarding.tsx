import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/ui/button';
import { ChevronRight, MapPin, QrCode, ShieldCheck, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const steps = [
  {
    title: "Discover Venues",
    description: "Find real-world locations where people are active and ready to cliq.",
    tip: "Look for indigo pulses on the map to find active spots.",
    icon: <MapPin className="w-12 h-12 text-indigo-500" />,
    color: "from-indigo-500/20 to-transparent",
    accent: "indigo"
  },
  {
    title: "Scan & Verify",
    description: "Scan the venue's QR code to verify your presence and enter the safe zone.",
    tip: "Scanning verifies you are actually at the location.",
    icon: <QrCode className="w-12 h-12 text-cyan-500" />,
    color: "from-cyan-500/20 to-transparent",
    accent: "cyan"
  },
  {
    title: "Meet Anonymously",
    description: "Chat with others without showing your identity. Reveal only when you're ready.",
    tip: "Your identity remains hidden until both parties agree to reveal.",
    icon: <ShieldCheck className="w-12 h-12 text-purple-500" />,
    color: "from-purple-500/20 to-transparent",
    accent: "purple"
  }
];

export const Onboarding: React.FC<{ onFinish: () => void }> = ({ onFinish }) => {
  const [step, setStep] = useState(0);

  const next = () => {
    if (step < steps.length - 1) {
      setStep(s => s + 1);
    } else {
      onFinish();
    }
  };

  return (
    <div className="h-screen flex flex-col bg-zinc-950 px-6 pb-12 overflow-hidden font-sans">
      <div className="flex-1 flex flex-col items-center justify-center relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -50, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="text-center w-full"
          >
            {/* Animated Coach Mark / Icon Container */}
            <div className="relative mx-auto w-32 h-32 mb-10">
              <motion.div 
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ repeat: Infinity, duration: 3 }}
                className={`absolute inset-0 rounded-3xl bg-${steps[step].accent}-500/10 scale-125 blur-xl`}
              />
              <div className={`relative w-full h-full rounded-[2rem] bg-gradient-to-b ${steps[step].color} border border-white/5 shadow-2xl flex items-center justify-center`}>
                {steps[step].icon}
              </div>
            </div>

            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-4xl font-bold tracking-tight mb-4 px-4 font-display text-glow">{steps[step].title}</h2>
              <p className="text-zinc-400 text-lg leading-relaxed px-8 mb-8 font-medium">
                {steps[step].description}
              </p>

              {/* Coach Mark / Interactive Tip */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-zinc-900 border border-white/5 rounded-full cursor-help hover:bg-zinc-800 transition-colors">
                      <Info className={`w-4 h-4 text-${steps[step].accent}-500`} />
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">How it works</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="bg-zinc-800 border-white/10 text-white p-5 rounded-[1.5rem] max-w-[260px] shadow-2xl backdrop-blur-xl">
                    <p className="text-sm font-semibold leading-relaxed">{steps[step].tip}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex flex-col gap-10">
        <div className="flex justify-center gap-3">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-400 ${i === step ? 'w-10 bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]' : 'w-2 bg-zinc-800'}`}
            />
          ))}
        </div>
        
        <Button 
          onClick={next}
          className="w-full h-16 bg-indigo-600 text-white hover:bg-indigo-700 rounded-2xl text-lg font-black uppercase tracking-[0.1em] group transition-all shadow-2xl shadow-indigo-600/20 active:scale-95"
        >
          {step === steps.length - 1 ? 'Start Cliqing' : 'Next Step'}
          <ChevronRight className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </div>
  );
};
