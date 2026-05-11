import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { ScreenType } from '../../types/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, User, Bell, Shield, LogOut, ChevronRight, MessageSquare, History, Heart } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BottomNav } from '../common/BottomNav';

import { toast } from 'sonner';

export const SettingsScreen: React.FC<{ navigateTo: (screen: ScreenType, params?: any) => void }> = ({ navigateTo }) => {
  const { user, signOut } = useAuth();

  const menuItems = [
    { icon: User, label: 'Edit Profile', color: 'text-violet-500', bg: 'bg-violet-500/10', action: () => navigateTo('EDIT_PROFILE') },
    { icon: MessageSquare, label: 'Chat History', color: 'text-cyan-500', bg: 'bg-cyan-500/10', action: () => navigateTo('CHAT_LIST') },
    { icon: Heart, label: 'Saved Venues', color: 'text-rose-500', bg: 'bg-rose-500/10', action: () => navigateTo('SAVED_VENUES') },
    { icon: Bell, label: 'Notifications', color: 'text-amber-500', bg: 'bg-amber-500/10', action: () => navigateTo('NOTIFICATIONS') },
    { icon: Shield, label: 'Privacy & Safety', color: 'text-cyan-500', bg: 'bg-cyan-500/10', action: () => toast.info("Security", { description: "Your data is end-to-end encrypted." }) },
    { icon: History, label: 'Activity Logs', color: 'text-zinc-500', bg: 'bg-zinc-500/10', action: () => toast.info("Logs", { description: "Review your recent check-ins." }) },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col pb-24 font-sans">
      {/* Profile Header */}
      <div className="pt-20 pb-12 px-8 flex flex-col items-center bg-gradient-to-b from-violet-950/20 to-zinc-950 border-b border-white/5">
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-violet-500/20 blur-2xl rounded-full animate-pulse" />
          <Avatar className="w-32 h-32 rounded-[2.5rem] border-4 border-zinc-900 shadow-2xl relative z-10 transition-transform hover:scale-105">
            <AvatarImage src={user?.photoURL} />
            <AvatarFallback className="bg-violet-600 text-white text-4xl font-bold font-display">{user?.handle[1].toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-white text-black rounded-2xl flex items-center justify-center shadow-xl z-20">
            <User className="w-6 h-6" />
          </div>
        </div>
        <h2 className="text-3xl font-bold tracking-tight mb-2 font-display text-glow">{user?.handle}</h2>
        <div className="flex gap-3 items-center">
            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">{user?.age} y.o</span>
            <div className="w-1.5 h-1.5 bg-violet-500/20 rounded-full" />
            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">{user?.gender || 'Secret'}</span>
        </div>
      </div>

      {/* Menu List */}
      <div className="flex-1 px-8 py-10 space-y-3">
        {menuItems.map((item, i) => (
          <button
            key={i}
            onClick={item.action}
            className="w-full flex items-center justify-between p-5 bg-zinc-900/40 hover:bg-zinc-900 border border-white/5 rounded-[2rem] transition-all group active:scale-98"
          >
            <div className="flex items-center gap-5">
              <div className={`w-14 h-14 ${item.bg} rounded-2xl flex items-center justify-center ${item.color} shadow-inner`}>
                <item.icon className="w-6 h-6" />
              </div>
              <span className="font-bold text-base text-zinc-200 tracking-tight">{item.label}</span>
            </div>
            <div className="w-10 h-10 glass rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0">
               <ChevronRight className="w-5 h-5 text-zinc-500" />
            </div>
          </button>
        ))}

        <div className="pt-12 space-y-6">
            <Button 
                variant="ghost" 
                onClick={signOut}
                className="w-full h-16 text-rose-500 hover:text-white hover:bg-rose-600 rounded-[2rem] font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 transition-all border border-rose-500/10"
            >
                <LogOut className="w-5 h-5" />
                Disconnect Account
            </Button>
            <div className="text-center space-y-1">
              <p className="text-zinc-600 font-black uppercase tracking-[0.4em] text-[8px]">Cliq Protocol v1.2.0</p>
              <p className="text-zinc-800 font-bold text-[7px] uppercase tracking-widest">Built for the modern Urbanite</p>
            </div>
        </div>
      </div>

      <BottomNav currentScreen="SETTINGS" navigateTo={navigateTo} />
    </div>
  );
};
