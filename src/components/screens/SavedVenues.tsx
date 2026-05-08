import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../lib/firebase';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { ScreenType } from '../../types/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Heart, MapPin, Navigation, Info } from 'lucide-react';
import { Venue } from '../../types';
import { toast } from 'sonner';

export const SavedVenues: React.FC<{ navigateTo: (screen: ScreenType, params?: any) => void }> = ({ navigateTo }) => {
  const { user } = useAuth();
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSavedVenues = async () => {
      if (!user?.savedVenues || user.savedVenues.length === 0) {
        setVenues([]);
        setLoading(false);
        return;
      }

      try {
        const venuePromises = user.savedVenues.map(id => getDoc(doc(db, 'venues', id)));
        const venueDocs = await Promise.all(venuePromises);
        const fetchedVenues = venueDocs
          .filter(doc => doc.exists())
          .map(doc => ({ id: doc.id, ...doc.data() } as Venue));
        
        setVenues(fetchedVenues);
      } catch (error) {
        console.error("Error fetching saved venues:", error);
        toast.error("Failed to load saved venues");
      } finally {
        setLoading(false);
      }
    };

    fetchSavedVenues();
  }, [user]);

  return (
    <div className="min-h-screen bg-zinc-950 px-8 pt-24 pb-12 overflow-y-auto font-sans relative">
      <button 
        onClick={() => navigateTo('SETTINGS')}
        className="absolute top-8 left-8 w-12 h-12 bg-zinc-900 border border-white/5 rounded-2xl flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-6 h-6" />
      </button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <span className="text-rose-500 font-black tracking-[0.4em] text-[8px] uppercase mb-4 block">Personal Curation</span>
        <h1 className="text-4xl font-bold tracking-tight mb-4 font-display text-glow">Saved Venues</h1>
        <p className="text-zinc-500 text-base font-medium leading-relaxed">Your favorite urban sanctuaries, collected across your journey.</p>
      </motion.div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <div className="w-12 h-12 border-4 border-rose-500/20 border-t-rose-500 rounded-full animate-spin" />
          <p className="text-zinc-600 font-black uppercase tracking-widest text-[10px]">Retrieving bookmarks...</p>
        </div>
      ) : venues.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
          <div className="w-20 h-20 bg-zinc-900 rounded-[2rem] flex items-center justify-center border border-white/5">
            <Heart className="w-8 h-8 text-zinc-800" />
          </div>
          <div className="space-y-2">
            <h3 className="text-zinc-400 font-bold text-lg tracking-tight">No bookmarks yet</h3>
            <p className="text-zinc-600 text-sm max-w-[200px] mx-auto">Explore venues and tap the heart icon to save them here.</p>
          </div>
          <button 
            onClick={() => navigateTo('HOME')}
            className="px-8 py-4 bg-zinc-900 border border-white/10 rounded-2xl text-xs font-black uppercase tracking-widest text-zinc-400 hover:text-white transition-colors"
          >
            Explore Venues
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {venues.map((venue, idx) => (
              <motion.button
                key={venue.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => navigateTo('VENUE_DETAIL', { venueId: venue.id })}
                className="w-full flex items-center gap-5 p-5 bg-zinc-900/40 hover:bg-zinc-900 border border-white/5 rounded-[2rem] transition-all group active:scale-98"
              >
                <div className="w-16 h-16 bg-rose-500/10 rounded-2xl flex items-center justify-center text-rose-500 shadow-inner group-hover:scale-110 transition-transform">
                  <MapPin className="w-8 h-8" />
                </div>
                <div className="flex-1 text-left">
                  <h4 className="font-bold text-lg text-zinc-200 tracking-tight mb-1">{venue.name}</h4>
                  <p className="text-xs text-zinc-500 font-medium line-clamp-1">{venue.address}</p>
                </div>
                <div className="w-10 h-10 border border-white/5 rounded-xl flex items-center justify-center text-zinc-700 group-hover:text-rose-500 transition-colors">
                  <Navigation className="w-5 h-5" />
                </div>
              </motion.button>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};
