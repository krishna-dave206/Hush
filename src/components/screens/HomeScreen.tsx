import React, { useState, useEffect } from 'react';
import { APIProvider, Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';
import { BottomNav } from '../common/BottomNav';
import { ScreenType } from '../../types/navigation';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Venue } from '../../types';
import { Search, MapPin, Zap, Navigation, QrCode, ChevronRight, Users, ShieldCheck, ArrowRight, ArrowLeft, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

const API_KEY = process.env.GOOGLE_MAPS_PLATFORM_KEY || '';

const MOCK_VENUES: Venue[] = [
  {
    id: 'venue_1',
    name: 'Blue Bottle Coffee',
    address: '123 Tech Lane, Silicon Valley',
    location: { lat: 37.7749, lng: -122.4194 },
    radius: 50,
    activeCount: 12,
    qrCode: 'ven_123'
  },
  {
    id: 'venue_2',
    name: 'The Study Lounge',
    address: '456 University Ave, Palo Alto',
    location: { lat: 37.7849, lng: -122.4094 },
    radius: 70,
    activeCount: 8,
    qrCode: 'ven_456'
  },
  {
    id: 'venue_3',
    name: 'Ritual Coffee Roasters',
    address: '1026 Valencia St, San Francisco',
    location: { lat: 37.7564, lng: -122.4214 },
    radius: 60,
    activeCount: 15,
    qrCode: 'ven_789'
  },
  {
    id: 'venue_4',
    name: 'Sightglass Coffee',
    address: '270 7th St, San Francisco',
    location: { lat: 37.7770, lng: -122.4085 },
    radius: 80,
    activeCount: 22,
    qrCode: 'ven_012'
  },
  {
    id: 'venue_5',
    name: 'Philz Coffee',
    address: '3101 24th St, San Francisco',
    location: { lat: 37.7524, lng: -122.4143 },
    radius: 50,
    activeCount: 19,
    qrCode: 'ven_345'
  },
  {
    id: 'venue_6',
    name: 'Four Barrel Coffee',
    address: '375 Valencia St, San Francisco',
    location: { lat: 37.7670, lng: -122.4220 },
    radius: 65,
    activeCount: 10,
    qrCode: 'ven_678'
  }
];

export const HomeScreen: React.FC<{ 
  navigateTo: (screen: ScreenType, params?: any) => void,
  initialMode?: 'DISCOVERY' | 'MAP'
}> = ({ navigateTo, initialMode = 'DISCOVERY' }) => {
  const [venues, setVenues] = useState<Venue[]>(MOCK_VENUES);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const [viewMode, setViewMode] = useState<'DISCOVERY' | 'MAP'>(initialMode);

  useEffect(() => {
    setViewMode(initialMode);
  }, [initialMode]);
  const [showGuide, setShowGuide] = useState(() => {
    return !localStorage.getItem('cliq_home_guide_seen');
  });

  const dismissGuide = () => {
    localStorage.setItem('cliq_home_guide_seen', 'true');
    setShowGuide(false);
  };

  const hasValidKey = Boolean(API_KEY) && API_KEY !== 'YOUR_API_KEY';

  if (!hasValidKey) {
    return (
      <div className="h-screen flex flex-col items-center justify-center p-8 text-center bg-zinc-950 px-12">
        <div className="w-24 h-24 bg-violet-500/10 rounded-[2.5rem] flex items-center justify-center mb-8 border border-violet-500/20">
          <MapPin className="w-10 h-10 text-violet-500 animate-bounce" />
        </div>
        <h2 className="text-3xl font-bold mb-4 tracking-tight font-display">System Offline</h2>
        <p className="text-zinc-500 text-sm mb-10 leading-relaxed font-medium">Cliq requires an encrypted Maps Protocol Key to establish local presence. Please add your credentials.</p>
        
        <div className="w-full space-y-4 text-left glass-dark p-8 rounded-[2.5rem] border border-white/5 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-violet-500/5 blur-3xl rounded-full" />
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-violet-500/50 mb-6">Security Setup</p>
          <div className="space-y-4 relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-xl bg-zinc-900 flex items-center justify-center text-[10px] font-black text-zinc-500 border border-white/5">01</div>
              <p className="text-xs text-zinc-400 font-medium">Open Application Settings</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-xl bg-zinc-900 flex items-center justify-center text-[10px] font-black text-zinc-500 border border-white/5">02</div>
              <p className="text-xs text-zinc-400 font-medium">Navigate to the Secrets tab</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-xl bg-zinc-900 flex items-center justify-center text-[10px] font-black text-zinc-500 border border-white/5">03</div>
              <p className="text-xs text-zinc-400 font-medium">Add <span className="text-violet-500 font-bold">GOOGLE_MAPS_PLATFORM_KEY</span></p>
            </div>
          </div>
        </div>

        <p className="mt-12 text-[9px] font-black text-zinc-800 uppercase tracking-[0.4em]">Cliq Protocol v1.2</p>
      </div>
    );
  }

  return (
    <div className="h-screen w-full relative bg-zinc-950 font-sans overflow-hidden">
      {/* Guided Overlay */}
      <AnimatePresence>
        {showGuide && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[60] bg-zinc-950/90 backdrop-blur-xl flex flex-col items-center justify-center p-8 text-center"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="max-w-xs space-y-8"
            >
              <div className="space-y-4">
                <div className="relative w-24 h-24 mx-auto">
                   <div className="absolute inset-0 bg-violet-500/20 blur-2xl rounded-full animate-pulse" />
                   <div className="relative w-24 h-24 bg-violet-500/10 rounded-[2.5rem] flex items-center justify-center border border-violet-500/20">
                     <Zap className="w-10 h-10 text-violet-500" />
                   </div>
                </div>
                <h2 className="text-3xl font-bold tracking-tight font-display text-white">Welcome to Cliq</h2>
                <p className="text-zinc-400 text-sm leading-relaxed font-medium">
                  Real-time activity at venues near you. Find your crowd and connect instantly.
                </p>
              </div>

              <div className="space-y-6 pt-4">
                <div className="flex items-start gap-4 text-left glass p-4 rounded-2xl">
                  <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center shrink-0">
                    <Users className="w-5 h-5 text-violet-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white">Live Presence</h4>
                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-black mt-1">See who is active now</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 text-left glass p-4 rounded-2xl">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white">Safe & Anonymous</h4>
                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-black mt-1">Verified local connections</p>
                  </div>
                </div>
              </div>

              <Button 
                onClick={dismissGuide}
                className="w-full h-16 bg-violet-600 hover:bg-violet-700 text-white rounded-2xl font-black text-[12px] uppercase tracking-[0.2em] shadow-2xl shadow-violet-600/40 border border-white/10"
              >
                Enter Discovery
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {viewMode === 'DISCOVERY' ? (
          <motion.div
            key="discovery"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="h-full w-full flex flex-col pb-24 overflow-hidden"
          >
            {/* Header */}
            <div className="pt-16 px-8 pb-4 flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold tracking-tight text-white font-display text-glow">Discovery</h1>
                <div className="flex items-center gap-2 mt-2">
                  <div className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">1,204 People Nearby</span>
                </div>
              </div>
              <button className="w-12 h-12 glass rounded-2xl flex items-center justify-center text-zinc-400 hover:text-white transition-all">
                <Search className="w-6 h-6" />
              </button>
            </div>

            <ScrollArea className="flex-1 px-6">
              <div className="space-y-10 py-8">
                {/* Feature Card */}
                <section>
                  <h3 className="px-2 text-[11px] font-black text-violet-400 uppercase tracking-[0.2em] mb-4">Featured Spot</h3>
                  {venues[0] && (
                    <motion.div 
                      whileTap={{ scale: 0.98 }}
                      onClick={() => navigateTo('VENUE_DETAIL', { venueId: venues[0].id })}
                      className="group relative h-80 rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl transition-all"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-violet-900/40 via-zinc-950 to-zinc-950" />
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(139,92,246,0.2)_0%,transparent_70%)]" />
                      
                      <div className="absolute top-6 right-6">
                        <Badge className="bg-white/10 backdrop-blur-xl text-white border-white/10 px-4 py-2 rounded-2xl flex items-center gap-2 font-black text-[10px] uppercase tracking-widest">
                          <Zap className="w-3 h-3 text-violet-400 fill-violet-400" />
                          Most Active
                        </Badge>
                      </div>

                      <div className="absolute bottom-8 left-8 right-8">
                        <h4 className="text-3xl font-bold text-white font-display mb-2 text-glow">{venues[0].name}</h4>
                        <p className="text-zinc-400 text-sm font-medium mb-6 opacity-80">{venues[0].address}</p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex -space-x-3">
                            {[1, 2, 3, 4].map(i => (
                              <div key={i} className="w-10 h-10 rounded-2xl border-2 border-zinc-950 bg-zinc-800 flex items-center justify-center text-[10px] font-black text-zinc-500">
                                {String.fromCharCode(64 + i)}
                              </div>
                            ))}
                            <div className="w-10 h-10 rounded-2xl border-2 border-zinc-950 bg-violet-600 flex items-center justify-center text-[10px] font-black text-white">
                              +{venues[0].activeCount}
                            </div>
                          </div>
                          <div className="w-14 h-14 bg-white text-black rounded-3xl flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                            <ArrowRight className="w-6 h-6" />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </section>

                {/* Map Preview Launcher */}
                <section>
                  <h3 className="px-2 text-[11px] font-black text-violet-400 uppercase tracking-[0.2em] mb-4">Activity Map</h3>
                  <div 
                    onClick={() => setViewMode('MAP')}
                    className="relative h-44 rounded-[2.5rem] overflow-hidden glass-dark border border-white/10 group cursor-pointer"
                  >
                    <div className="absolute inset-0 bg-violet-500/5 transition-opacity group-hover:opacity-20" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                      <div className="w-14 h-14 glass rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                        <MapPin className="w-7 h-7 text-violet-400" />
                      </div>
                      <h4 className="text-lg font-bold text-white font-display">Explore Live Hubs</h4>
                      <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mt-1">Switch to map view</p>
                    </div>
                  </div>
                </section>

                {/* Trending List */}
                <section className="pb-12">
                  <div className="flex items-center justify-between px-2 mb-6">
                    <h3 className="text-[11px] font-black text-violet-400 uppercase tracking-[0.2em]">Trending Spots</h3>
                    <button className="text-[10px] font-black text-zinc-500 uppercase tracking-widest hover:text-white transition-colors">See All</button>
                  </div>
                  <div className="space-y-4">
                    {venues.slice(1).map((v) => (
                      <motion.div 
                        key={v.id}
                        onClick={() => navigateTo('VENUE_DETAIL', { venueId: v.id })}
                        className="group glass-dark p-5 rounded-[2.5rem] flex items-center gap-5 hover:bg-zinc-900 transition-all cursor-pointer"
                      >
                         <div className="w-16 h-16 bg-zinc-800 rounded-3xl flex items-center justify-center border border-white/5 shrink-0 group-hover:border-violet-500/30">
                           <Zap className="w-8 h-8 text-violet-500/20 fill-violet-500/10" />
                         </div>
                         <div className="flex-1 min-w-0">
                           <h4 className="font-bold text-lg text-white font-display truncate mb-1">{v.name}</h4>
                           <div className="flex items-center gap-3">
                             <div className="flex items-center gap-1.5">
                               <Users className="w-3.5 h-3.5 text-violet-500" />
                               <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">{v.activeCount} Live</span>
                             </div>
                             <div className="w-1.5 h-1.5 rounded-full bg-zinc-800" />
                             <span className="text-[9px] font-black text-zinc-700 uppercase tracking-widest">Nearby</span>
                           </div>
                         </div>
                         <ChevronRight className="w-5 h-5 text-zinc-700 group-hover:text-violet-400 transition-colors" />
                      </motion.div>
                    ))}
                  </div>
                </section>
              </div>
            </ScrollArea>
          </motion.div>
        ) : (
          <motion.div
            key="map"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-full w-full relative"
          >
            {/* Map UI Overlays */}
            <div className="absolute top-12 left-6 right-6 z-10 hidden md:block">
              {/* Desktop Search Placeholder */}
            </div>

            <div className="absolute top-12 left-6 z-10">
              <button 
                onClick={() => setViewMode('DISCOVERY')}
                className="h-14 px-6 glass-dark rounded-2xl flex items-center gap-3 text-white font-bold text-sm shadow-2xl active:scale-95 transition-all"
              >
                <ArrowLeft className="w-5 h-5" />
                Discovery
              </button>
            </div>

            <div className="h-full w-full">
              {venues.length > 0 && (
                <APIProvider apiKey={API_KEY}>
                  <Map
                    defaultCenter={{ lat: 37.7749, lng: -122.4194 }}
                    defaultZoom={13}
                    mapId="COOLCLIQ_MAP"
                    disableDefaultUI={true}
                    style={{ width: '100%', height: '100%' }}
                    internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
                    onTilesLoaded={() => setIsMapLoaded(true)}
                  >
                    {venues.map(venue => (
                      <AdvancedMarker 
                        key={venue.id} 
                        position={venue.location}
                        onClick={() => setSelectedVenue(venue)}
                      >
                        <div className="relative group cursor-pointer">
                          <div className="absolute -inset-4 bg-violet-500/20 blur-xl rounded-full scale-0 group-hover:scale-100 transition-transform duration-500" />
                          <div className="relative bg-violet-600 p-2.5 rounded-2xl border-2 border-white shadow-lg transition-transform group-hover:scale-110 active:scale-95">
                            <Zap className="w-5 h-5 text-white fill-white" />
                          </div>
                        </div>
                      </AdvancedMarker>
                    ))}
                  </Map>
                </APIProvider>
              )}
            </div>

            {/* Venue Card Overlay (Same as before but integrated) */}
            <AnimatePresence>
              {selectedVenue && (
                <motion.div
                  initial={{ y: 100, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 100, opacity: 0 }}
                  className="absolute bottom-28 left-6 right-6 z-20"
                >
                  <div className="glass-dark rounded-[2.5rem] p-6 shadow-2xl border border-white/10">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h3 className="text-2xl font-bold tracking-tight font-display text-glow">{selectedVenue.name}</h3>
                        <p className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.2em] mt-1">{selectedVenue.address}</p>
                      </div>
                      <Badge className="bg-violet-500/10 text-violet-400 border-none px-4 py-1.5 rounded-full flex items-center gap-2 font-black text-[10px] uppercase tracking-widest">
                        <div className="w-2 h-2 rounded-full bg-violet-500 animate-pulse shadow-[0_0_8px_rgba(139,92,246,0.8)]" />
                        {selectedVenue.activeCount} live
                      </Badge>
                    </div>
                    <div className="flex gap-4">
                      <Button 
                        onClick={() => navigateTo('VENUE_DETAIL', { venueId: selectedVenue.id })}
                        className="flex-1 h-14 bg-white text-black hover:bg-zinc-200 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all active:scale-95"
                      >
                        Launch Scan
                      </Button>
                      <button 
                        onClick={() => setSelectedVenue(null)}
                        className="w-14 h-14 glass rounded-2xl flex items-center justify-center text-zinc-400 hover:text-white transition-all active:scale-95"
                      >
                        <X className="w-6 h-6" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      <BottomNav currentScreen={viewMode === 'MAP' ? 'MAP' : 'HOME'} navigateTo={navigateTo} />
    </div>
  );
};
