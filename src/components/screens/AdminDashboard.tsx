import React, { useState } from 'react';
import { ScreenType } from '../../types/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Plus, Search, QrCode, Trash2, MapPin, BarChart3, Users, Settings } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';

export const AdminDashboard: React.FC<{ navigateTo: (screen: ScreenType) => void }> = ({ navigateTo }) => {
  const [activeTab, setActiveTab] = useState('venues');

  const stats = [
    { label: 'Total Users', value: '1,284', icon: Users, color: 'text-blue-500' },
    { label: 'Active Today', value: '432', icon: BarChart3, color: 'text-orange-500' },
    { label: 'Total Venues', value: '12', icon: MapPin, color: 'text-emerald-500' },
    { label: 'Reports', value: '2', icon: ShieldAlert, color: 'text-red-500' }
  ];

  return (
    <div className="min-h-screen bg-zinc-950 p-6 pb-12">
      <div className="flex items-center justify-between mb-10 mt-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1">Admin Panel</h1>
          <p className="text-zinc-500 text-sm">System management and analytics</p>
        </div>
        <button onClick={() => navigateTo('HOME')} className="w-12 h-12 bg-zinc-900 border border-white/5 rounded-2xl flex items-center justify-center">
            <Settings className="w-5 h-5 text-zinc-500" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-10">
        {stats.map((stat, i) => (
          <Card key={i} className="bg-zinc-900/50 border-white/5 rounded-3xl overflow-hidden relative">
            <div className={`absolute top-0 right-0 w-12 h-12 opacity-10 bg-current transition-opacity ${stat.color}`} />
            <CardHeader className="pb-2">
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold tracking-tight text-white">{stat.value}</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold tracking-tight">Active Venues</h3>
            <Button size="sm" className="bg-white text-black hover:bg-zinc-200 rounded-xl font-bold gap-2">
                <Plus className="w-4 h-4" /> Add Venue
            </Button>
        </div>

        <ScrollArea className="h-96 pr-4">
            <div className="space-y-4">
                {[1, 2, 3].map(i => (
                    <div key={i} className="bg-zinc-900/40 border border-white/5 p-4 rounded-2xl flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-zinc-800 rounded-xl flex items-center justify-center">
                                <MapPin className="w-5 h-5 text-zinc-500" />
                            </div>
                            <div>
                                <h4 className="font-bold text-sm tracking-tight">Venue Name {i}</h4>
                                <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest leading-none">12.3 km • 5 active</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button className="w-10 h-10 bg-zinc-800 rounded-xl flex items-center justify-center text-zinc-400 hover:text-white transition-colors">
                                <QrCode className="w-4 h-4" />
                            </button>
                            <button className="w-10 h-10 bg-zinc-800 rounded-xl flex items-center justify-center text-zinc-400 hover:text-red-500 transition-colors">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </ScrollArea>
      </div>
    </div>
  );
};

import { ShieldAlert } from 'lucide-react';
