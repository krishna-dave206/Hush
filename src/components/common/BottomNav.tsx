import React, { useState } from 'react';
import { Home, Search, QrCode, MessageSquare, User, Zap } from 'lucide-react';
import { ScreenType } from '../../types/navigation';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface BottomNavProps {
  currentScreen: ScreenType;
  navigateTo: (screen: ScreenType) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentScreen, navigateTo }) => {
  const items = [
    { icon: Home, label: 'Explore', screen: 'HOME' as const, tooltip: "Find Places" },
    { icon: Zap, label: 'Active', screen: 'ACTIVE_USERS' as const, tooltip: "Live Pulse" },
    { icon: QrCode, label: 'Scan', screen: 'QR_SCANNER' as const, isCenter: true, tooltip: "Verify Presence" },
    { icon: MessageSquare, label: 'Chat', screen: 'CHAT_LIST' as const, tooltip: "Conversations" },
    { icon: User, label: 'Profile', screen: 'SETTINGS' as const, tooltip: "Your Profile" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 px-6 pb-8 pointer-events-none">
      <div className="mx-auto max-w-md w-full h-20 bg-zinc-900/90 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] grid grid-cols-5 items-center pointer-events-auto shadow-2xl shadow-black/50 overflow-hidden">
        <TooltipProvider>
          {items.map((item, i) => (
            <div key={i} className="flex items-center justify-center h-full w-full">
              <Tooltip className="w-full h-full">
                <TooltipTrigger>
                  <button
                    onClick={() => navigateTo(item.screen)}
                    className={`w-full h-full flex flex-col items-center justify-center transition-all duration-300 ${
                      item.isCenter 
                        ? 'p-0' 
                        : `${currentScreen === item.screen ? 'text-emerald-400' : 'text-zinc-500 hover:text-zinc-300'}`
                    }`}
                  >
                    {item.isCenter ? (
                      <div className="w-14 h-14 bg-emerald-600 rounded-2xl shadow-lg shadow-emerald-600/30 text-white flex items-center justify-center hover:scale-105 transition-transform active:scale-95">
                        <item.icon className="w-7 h-7" />
                      </div>
                    ) : (
                      <>
                        <item.icon className="w-5 h-5 mb-1" />
                        <span className="text-[9px] font-bold uppercase tracking-widest leading-none">{item.label}</span>
                      </>
                    )}
                  </button>
                </TooltipTrigger>
                <TooltipContent className="bg-zinc-800 border-white/10 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 mb-2 rounded-lg">
                  {item.tooltip}
                </TooltipContent>
              </Tooltip>
            </div>
          ))}
        </TooltipProvider>
      </div>
    </div>
  );
};
