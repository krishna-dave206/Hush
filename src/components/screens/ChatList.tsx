import React from 'react';
import { ScreenType } from '../../types/navigation';
import { MessageSquare, Search, ArrowRight, Settings } from 'lucide-react';
import { motion } from 'motion/react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BottomNav } from '../common/BottomNav';

const MOCK_CHATS = [
  { id: '1', handle: '@urban_knight', lastMessage: 'See you at the lounge!', time: '2m ago', unread: true },
  { id: '2', handle: '@neon_dawn', lastMessage: 'The coffee here is amazing', time: '15m ago', unread: false },
  { id: '3', handle: '@velvet_vibes', lastMessage: 'Just joined Blue Bottle', time: '1h ago', unread: false },
];

export const ChatList: React.FC<{ navigateTo: (screen: ScreenType, params?: any) => void }> = ({ navigateTo }) => {
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col pb-24 font-sans">
      <div className="pt-20 px-8 pb-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-glow font-display">Messages</h1>
            <p className="text-zinc-500 text-sm font-medium mt-1">Chat with people you've met</p>
          </div>
          <button 
            onClick={() => navigateTo('SETTINGS')}
            className="w-12 h-12 glass rounded-2xl flex items-center justify-center text-zinc-400 hover:text-white transition-all active:scale-95"
          >
            <Settings className="w-6 h-6" />
          </button>
        </div>
        
        <div className="relative group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 transition-colors group-focus-within:text-indigo-500" />
          <Input 
            placeholder="Search conversations..." 
            className="h-14 pl-12 bg-zinc-900 border-white/5 rounded-2xl focus:ring-indigo-500/20 text-xs font-bold uppercase tracking-widest placeholder:text-zinc-700"
          />
        </div>
      </div>

      <ScrollArea className="flex-1 px-6">
        <div className="space-y-3 pb-12">
          {MOCK_CHATS.map((chat, i) => (
            <motion.div
              key={chat.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => navigateTo('CHAT', { recipientId: chat.id })}
              className="group glass-dark p-4 rounded-[2rem] flex items-center gap-4 hover:bg-zinc-900/50 hover:border-indigo-500/20 active:scale-98 transition-all cursor-pointer"
            >
              <div className="relative">
                <Avatar className="w-16 h-16 rounded-[1.5rem] border border-white/10 bg-zinc-800 shadow-xl">
                  <AvatarFallback className="text-zinc-500 font-bold text-xl font-display">{chat.handle[1].toUpperCase()}</AvatarFallback>
                </Avatar>
                {chat.unread && (
                  <div className="absolute top-0 right-0 w-4 h-4 bg-indigo-500 border-2 border-zinc-950 rounded-full shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className={`font-bold text-base tracking-tight truncate font-display ${chat.unread ? 'text-white' : 'text-zinc-300'}`}>
                    {chat.handle}
                  </h4>
                  <span className="text-[9px] font-black uppercase tracking-widest text-zinc-600">{chat.time}</span>
                </div>
                <p className={`text-xs truncate ${chat.unread ? 'text-zinc-400 font-semibold' : 'text-zinc-500'}`}>
                  {chat.lastMessage}
                </p>
              </div>

              <div className="w-10 h-10 bg-indigo-500/10 text-indigo-400 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0">
                <ArrowRight className="w-5 h-5" />
              </div>
            </motion.div>
          ))}

          {MOCK_CHATS.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center px-12">
              <div className="w-20 h-20 bg-zinc-900 rounded-[2.5rem] flex items-center justify-center mb-6 border border-white/5">
                <MessageSquare className="w-8 h-8 text-zinc-700" />
              </div>
              <h3 className="text-xl font-bold mb-2">No messages yet</h3>
              <p className="text-zinc-500 text-sm font-medium leading-relaxed">
                Scan into a venue to discover people and start a conversation.
              </p>
            </div>
          )}
        </div>
      </ScrollArea>

      <BottomNav currentScreen="CHAT_LIST" navigateTo={navigateTo} />
    </div>
  );
};
