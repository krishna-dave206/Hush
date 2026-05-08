import React from 'react';
import { ScreenType } from '../../types/navigation';
import { ArrowLeft, User, Search, MapPin, Zap, MessageSquare } from 'lucide-react';
import { motion } from 'motion/react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { BottomNav } from '../common/BottomNav';

const MOCK_USERS_GLOBAL = [
  { id: '1', handle: '@urban_knight', venue: 'Blue Bottle Coffee', activity: '5m ago', gender: 'M' },
  { id: '2', handle: '@neon_dawn', venue: 'The Study Lounge', activity: 'Just joined', gender: 'F' },
  { id: '3', handle: '@velvet_vibes', venue: 'Philz Coffee', activity: '12m ago', gender: 'F' },
  { id: '4', handle: '@cyber_soul', venue: 'Library Central', activity: '1h ago', gender: 'NB' },
  { id: '5', handle: '@starlight', venue: 'Gym X', activity: '3m ago', gender: 'F' },
  { id: '6', handle: '@pixel_pro', venue: 'Blue Bottle Coffee', activity: '8m ago', gender: 'M' },
];

export const ActiveUsersList: React.FC<{ venueId?: string; navigateTo: (screen: ScreenType, params?: any) => void }> = ({ venueId, navigateTo }) => {
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col pb-24 font-sans">
      <div className="pt-20 px-6 pb-6">
        <h1 className="text-4xl font-bold tracking-tight mb-2 font-display text-glow">Live Presence</h1>
        <p className="text-zinc-500 text-sm font-medium tracking-wide">People currently cliqing at nearby venues.</p>
        
        <div className="relative mt-8">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <Input 
            placeholder="Search handle or venue..." 
            className="h-14 pl-12 bg-zinc-900 border-white/5 rounded-2xl focus:ring-indigo-500/20 text-xs font-bold uppercase tracking-widest placeholder:text-zinc-600 shadow-inner"
          />
        </div>
      </div>

      <ScrollArea className="flex-1 px-6">
        <div className="space-y-4 pb-12">
          {MOCK_USERS_GLOBAL.map((u, i) => (
            <motion.div
              key={u.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => navigateTo('CHAT', { recipientId: u.id })}
              className="group glass-dark p-4 rounded-[2rem] flex items-center justify-between transition-all hover:bg-zinc-900 hover:border-indigo-500/20 active:scale-98"
            >
              <div className="flex items-center gap-4">
                <div className="relative">
                    <Avatar className="w-16 h-16 rounded-[1.5rem] border border-white/10 bg-zinc-800 shadow-xl">
                        <AvatarFallback className="text-zinc-500 font-bold text-xl font-display">{u.handle[1].toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-4 border-zinc-950 rounded-full" />
                </div>
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold text-base tracking-tight font-display">{u.handle}</h4>
                        <span className="text-[8px] font-black uppercase tracking-widest text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-md">{u.gender}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                        <p className="text-[10px] text-zinc-500 font-bold flex items-center gap-1.5 uppercase tracking-widest">
                            <MapPin className="w-2.5 h-2.5 text-indigo-500" />
                            {u.venue}
                        </p>
                        <p className="text-[9px] text-zinc-600 font-black uppercase tracking-[0.2em]">{u.activity}</p>
                    </div>
                </div>
              </div>
              <div className="w-12 h-12 bg-indigo-500/10 text-indigo-400 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all scale-90 group-hover:scale-100">
                <MessageSquare className="w-5 h-5" />
              </div>
            </motion.div>
          ))}
        </div>
      </ScrollArea>

      <BottomNav currentScreen="ACTIVE_USERS" navigateTo={navigateTo} />
    </div>
  );
};
