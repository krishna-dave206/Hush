import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { Zap } from 'lucide-react';

export const Splash: React.FC<{ onFinish: () => void }> = ({ onFinish }) => {
  useEffect(() => {
    const timer = setTimeout(onFinish, 2000);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-zinc-950 overflow-hidden">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative"
      >
        <div className="absolute inset-0 blur-3xl bg-orange-500/20 rounded-full" />
        <Zap className="w-20 h-20 text-orange-500 relative z-10 fill-orange-500" />
      </motion.div>
      <motion.h1
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="mt-6 text-4xl font-bold tracking-tighter"
      >
        CoolCliq
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="mt-2 text-zinc-500 font-medium uppercase tracking-[0.2em] text-[10px]"
      >
        Spontaneous Local Connections
      </motion.p>
    </div>
  );
};
