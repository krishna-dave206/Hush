import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { ScreenType } from '../../types/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, MapPin, Search, Users, Zap, MessageSquare, Info, Filter, ChevronRight, QrCode, Lock, CheckCircle2, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { BottomNav } from '../common/BottomNav';
import { usePresence } from '../../contexts/PresenceContext';
import { toast } from 'sonner';

const MOCK_USERS = [
  { id: '1', handle: '@urban_knight', age: 24, gender: 'Male', interests: ['Coffee', 'Music'], photo: 'https://i.pravatar.cc/150?u=1' },
  { id: '2', handle: '@neon_dawn', age: 21, gender: 'Female', interests: ['Art', 'Tech'], photo: 'https://i.pravatar.cc/150?u=2' },
  { id: '3', handle: '@velvet_vibes', age: 27, gender: 'Female', interests: ['Hiking', 'Food'], photo: 'https://i.pravatar.cc/150?u=3' },
  { id: '4', handle: '@cyber_soul', age: 29, gender: 'Non-binary', interests: ['Gaming', 'Coding'], photo: 'https://i.pravatar.cc/150?u=4' },
  { id: '5', handle: '@starlight', age: 22, gender: 'Female', interests: ['Art', 'Yoga'], photo: 'https://i.pravatar.cc/150?u=5' },
];

export const VenueDetail: React.FC<{ venueId: string; navigateTo: (screen: ScreenType, params?: any) => void }> = ({ venueId, navigateTo }) => {
  const { user, setProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('active');
  const [searchQuery, setSearchQuery] = useState('');
  const [genderFilter, setGenderFilter] = useState<'All' | 'Male' | 'Female' | 'Non-binary'>('All');
  const [showFilters, setShowFilters] = useState(false);
  const { verifiedVenueId } = usePresence();

  const isVerified = verifiedVenueId === venueId;
  const isSaved = user?.savedVenues?.includes(venueId);

  const toggleSave = async () => {
    if (!user) return;
    try {
      const newSaved = isSaved 
        ? user.savedVenues?.filter(id => id !== venueId) || []
        : [...(user.savedVenues || []), venueId];
      
      await setProfile({ savedVenues: newSaved });
      toast.success(isSaved ? "Removed from bookmarks" : "Saved to favorites!");
    } catch (error) {
      toast.error("Action failed");
    }
  };

  const filteredUsers = MOCK_USERS.filter(user => {
    const matchesSearch = user.handle.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         user.interests.some(i => i.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesGender = genderFilter === 'All' || user.gender === genderFilter;
    return matchesSearch && matchesGender;
  });

  const handleUserClick = (userId: string) => {
    if (!isVerified) {
      toast.error("Presence check required", {
        description: "Verify your presence at this venue to unlock anonymous chat.",
        action: {
          label: "Verify Now",
          onClick: () => navigateTo('QR_SCANNER')
        }
      });
      return;
    }
    navigateTo('CHAT', { recipientId: userId });
  };


  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col pb-24 font-sans">
      {/* Header Image / Pattern */}
      <div className="h-64 bg-zinc-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-violet-500/20 via-zinc-950/40 to-zinc-950 z-0" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-zinc-950 to-transparent z-0" />
        
        <div className="absolute top-12 left-6 right-6 flex items-center justify-between z-20">
          <button onClick={() => navigateTo('HOME')} className="w-12 h-12 glass-violet rounded-2xl flex items-center justify-center transition-all active:scale-95 group">
            <ArrowLeft className="w-6 h-6 text-violet-400 group-hover:text-white transition-colors" />
          </button>
          <button 
            onClick={toggleSave}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all active:scale-95 group ${isSaved ? 'bg-rose-600 text-white' : 'glass-dark text-zinc-400 hover:text-rose-400'}`}
          >
            <Heart className={`w-6 h-6 ${isSaved ? 'fill-current' : ''}`} />
          </button>
        </div>

        <div className="absolute bottom-8 left-6 right-6 z-10 flex items-end justify-between">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-violet-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-violet-600/40 border border-white/10">
              <Zap className="w-8 h-8 text-white fill-white animate-pulse" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-glow mb-1 font-display">Blue Bottle Coffee</h1>
              <p className="text-zinc-400 text-[10px] font-black flex items-center gap-2 uppercase tracking-[0.2em] opacity-80">
                <MapPin className="w-3.5 h-3.5 text-violet-500" /> 
                Market St • San Francisco
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 px-6 overflow-hidden flex flex-col -mt-4 relative z-10">
        <Tabs defaultValue="active" onValueChange={setActiveTab} className="w-full flex-1 flex flex-col">
          <div className="flex flex-col gap-4 mb-6">
            <div className="flex items-center justify-between">
              <TabsList className="bg-zinc-900/80 backdrop-blur-xl p-1.5 rounded-2xl border border-white/5 h-14 w-full max-w-[240px]">
                <TabsTrigger value="active" className="rounded-xl h-full flex-1 data-[state=active]:bg-violet-600 data-[state=active]:text-white font-bold text-[10px] uppercase tracking-widest transition-all">Live ({filteredUsers.length})</TabsTrigger>
                <TabsTrigger value="info" className="rounded-xl h-full flex-1 data-[state=active]:bg-violet-600 data-[state=active]:text-white font-bold text-[10px] uppercase tracking-widest transition-all">About</TabsTrigger>
              </TabsList>
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${showFilters ? 'bg-violet-600 text-white shadow-lg' : 'glass-dark text-zinc-400 hover:text-white'}`}
              >
                <Filter className="w-5 h-5" />
              </button>
            </div>

            <AnimatePresence>
              {showFilters && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden space-y-4"
                >
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                    <Input 
                      placeholder="Search users or interests..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="h-12 pl-12 bg-zinc-900 border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest placeholder:text-zinc-700"
                    />
                  </div>
                  <div className="flex gap-2 pb-2 overflow-x-auto no-scrollbar">
                    {['All', 'Male', 'Female', 'Non-binary'].map((g) => (
                      <button
                        key={g}
                        onClick={() => setGenderFilter(g as any)}
                        className={`px-5 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border ${genderFilter === g ? 'bg-violet-600 border-violet-500 text-white' : 'bg-zinc-900 border-white/5 text-zinc-500 hover:text-zinc-300'}`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <TabsContent value="active" className="flex-1 overflow-hidden mt-0 data-[state=active]:flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
            <ScrollArea className="flex-1">
              <div className="grid grid-cols-1 gap-4 pb-20">
                {filteredUsers.map((user, i) => (
                  <motion.div
                    key={user.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => handleUserClick(user.id)}
                    className={`group relative glass-dark rounded-[2.5rem] p-5 transition-all active:scale-98 overflow-hidden flex items-center gap-5 ${
                      !isVerified ? 'opacity-80' : 'hover:bg-zinc-900 hover:border-violet-500/30'
                    }`}
                  >
                    <div className="relative shrink-0">
                      <Avatar className="w-20 h-20 rounded-3xl border border-white/10 bg-zinc-800 transition-transform group-hover:scale-105 shadow-xl">
                        <AvatarFallback className="bg-zinc-800 text-zinc-400 font-bold text-2xl font-display">{user.handle[1].toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-violet-500 border-4 border-zinc-950 rounded-full shadow-lg" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-bold text-lg tracking-tight truncate font-display">{user.handle}</h4>
                        <span className="text-[10px] font-black uppercase tracking-widest text-violet-400 bg-violet-500/10 px-2.5 py-1 rounded-lg shrink-0">{user.gender}</span>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mb-3">
                        {user.interests.map(int => (
                          <span key={int} className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest border border-white/5 bg-white/3 px-2.5 py-1 rounded-full">{int}</span>
                        ))}
                      </div>

                      <div className="flex items-center gap-5 text-zinc-600">
                        <div className="flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5" />
                          <span className="text-[9px] font-bold uppercase tracking-widest">Active</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span className="text-[9px] font-bold uppercase tracking-widest">Chat</span>
                        </div>
                      </div>
                    </div>

                    <div className="w-12 h-12 bg-violet-500/10 text-violet-400 rounded-2xl flex items-center justify-center transition-all">
                      {!isVerified ? (
                        <Lock className="w-5 h-5 text-zinc-700" />
                      ) : (
                        <ChevronRight className="w-6 h-6 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0" />
                      )}
                    </div>
                  </motion.div>
                ))}

                {filteredUsers.length === 0 && (
                  <div className="py-20 flex flex-col items-center justify-center text-center px-10">
                    <div className="w-20 h-20 bg-zinc-900 rounded-[2.5rem] flex items-center justify-center mb-6 border border-white/5">
                      <Search className="w-8 h-8 text-zinc-700" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">No results found</h3>
                    <p className="text-zinc-500 text-sm font-medium">Try adjusting your filters or search keywords.</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="info" className="flex-1 p-8 glass-dark rounded-[2.5rem] border border-white/5 mt-0 animate-in fade-in zoom-in-95 duration-500">
            <div className="space-y-8">
              <section>
                <h5 className="text-[11px] font-black text-violet-400 uppercase tracking-[0.2em] mb-4">About Venue</h5>
                <p className="text-zinc-400 text-sm leading-relaxed font-medium">A cozy spot perfect for working or meeting new people. Famous for their pour-over coffee and minimalist aesthetic. High-speed Wi-Fi and plenty of power outlets.</p>
              </section>
              <section>
                <h5 className="text-[11px] font-black text-violet-400 uppercase tracking-[0.2em] mb-4">Community Vibe</h5>
                <div className="flex flex-wrap gap-3">
                  {['Chill', 'Productive', 'Social', 'Dog Friendly'].map(vibe => (
                    <Badge key={vibe} variant="outline" className="border-white/10 bg-violet-500/5 rounded-2xl px-5 py-2 text-violet-200 font-bold text-[10px] uppercase tracking-widest">{vibe}</Badge>
                  ))}
                </div>
              </section>
              <div className="pt-8 border-t border-white/5 flex items-center justify-center gap-3 text-zinc-600">
                <Info className="w-4 h-4 text-violet-500" />
                <span className="text-[10px] font-black uppercase tracking-widest">Presence expires in 82m</span>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <div className="fixed bottom-28 left-6 right-6 z-20">
        <Button 
          onClick={() => navigateTo('QR_SCANNER')} 
          className={`w-full h-16 rounded-[2rem] text-sm font-black shadow-2xl gap-3 border border-white/10 group transition-all active:scale-95 uppercase tracking-widest ${
            isVerified 
              ? 'bg-violet-600 hover:bg-violet-700 text-white shadow-violet-900/40' 
              : 'bg-zinc-100 hover:bg-white text-zinc-950 shadow-zinc-900/40'
          }`}
        >
          {isVerified ? (
            <>
              <CheckCircle2 className="w-5 h-5" />
              Verified Active
            </>
          ) : (
            <>
              <QrCode className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Verify Presence
            </>
          )}
        </Button>
      </div>

      <BottomNav currentScreen="HOME" navigateTo={navigateTo} />
    </div>
  );
};
