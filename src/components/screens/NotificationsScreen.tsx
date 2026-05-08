import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../lib/firebase';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc, writeBatch } from 'firebase/firestore';
import { ScreenType } from '../../types/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Bell, MessageSquare, MapPin, Info, Check, Trash2, Shield } from 'lucide-react';
import { toast } from 'sonner';

interface Notification {
  id: string;
  title: string;
  body: string;
  type: 'message' | 'venue_event' | 'system';
  read: boolean;
  timestamp: any;
  data?: any;
}

export const NotificationsScreen: React.FC<{ navigateTo: (screen: ScreenType, params?: any) => void }> = ({ navigateTo }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'users', user.id, 'notifications'),
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Notification[];
      setNotifications(fetched);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const markAsRead = async (id: string) => {
    if (!user) return;
    try {
      await updateDoc(doc(db, 'users', user.id, 'notifications', id), {
        read: true
      });
    } catch (error) {
       console.error("Error marking as read:", error);
    }
  };

  const deleteNotification = async (id: string) => {
    if (!user) return;
    try {
      await deleteDoc(doc(db, 'users', user.id, 'notifications', id));
      toast.success("Notification dismissed");
    } catch (error) {
       console.error("Error deleting notification:", error);
    }
  };

  const markAllAsRead = async () => {
    if (!user || notifications.length === 0) return;
    const batch = writeBatch(db);
    notifications.forEach(notif => {
      if (!notif.read) {
        batch.update(doc(db, 'users', user.id, 'notifications', notif.id), { read: true });
      }
    });
    try {
      await batch.commit();
      toast.success("All caught up!");
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'message': return <MessageSquare className="w-5 h-5 text-indigo-500" />;
      case 'venue_event': return <MapPin className="w-5 h-5 text-emerald-500" />;
      case 'system': return <Shield className="w-5 h-5 text-amber-500" />;
      default: return <Bell className="w-5 h-5 text-zinc-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 px-8 pt-24 pb-12 overflow-y-auto font-sans relative">
      <button 
        onClick={() => navigateTo('SETTINGS')}
        className="absolute top-8 left-8 w-12 h-12 bg-zinc-900 border border-white/5 rounded-2xl flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-6 h-6" />
      </button>

      {notifications.some(n => !n.read) && (
        <button 
          onClick={markAllAsRead}
          className="absolute top-8 right-8 h-12 px-6 bg-emerald-600/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-500 text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all hover:text-white"
        >
          Mark all read
        </button>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <span className="text-amber-500 font-black tracking-[0.4em] text-[8px] uppercase mb-4 block">Communication Stream</span>
        <h1 className="text-4xl font-bold tracking-tight mb-4 font-display text-glow">Notifications</h1>
        <p className="text-zinc-500 text-base font-medium leading-relaxed">Stay updated with the pulse of your urban network.</p>
      </motion.div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <div className="w-12 h-12 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin" />
          <p className="text-zinc-600 font-black uppercase tracking-widest text-[10px]">Syncing alerts...</p>
        </div>
      ) : notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
          <div className="w-20 h-20 bg-zinc-900 rounded-[2rem] flex items-center justify-center border border-white/5">
            <Bell className="w-8 h-8 text-zinc-800" />
          </div>
          <div className="space-y-2">
            <h3 className="text-zinc-400 font-bold text-lg tracking-tight">Silent for now</h3>
            <p className="text-zinc-600 text-sm max-w-[200px] mx-auto">We'll notify you when someone pings you or interesting events happen at your venues.</p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {notifications.map((notif, idx) => (
              <motion.div
                key={notif.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: idx * 0.05 }}
                className={`group relative overflow-hidden p-6 rounded-[2rem] border transition-all ${
                  notif.read 
                    ? 'bg-zinc-900/20 border-white/5 opacity-60' 
                    : 'bg-zinc-900 border-emerald-500/10 shadow-lg shadow-emerald-950/20'
                }`}
              >
                {!notif.read && (
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500" />
                )}
                
                <div className="flex gap-5">
                  <div className="shrink-0 w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center">
                    {getIcon(notif.type)}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className={`font-bold text-base tracking-tight ${notif.read ? 'text-zinc-400' : 'text-zinc-100'}`}>
                        {notif.title}
                      </h4>
                      <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">
                        {notif.timestamp?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-sm text-zinc-400 font-medium leading-relaxed">
                      {notif.body}
                    </p>
                    
                    <div className="pt-4 flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      {!notif.read && (
                        <button 
                          onClick={() => markAsRead(notif.id)}
                          className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all shadow-sm"
                        >
                          <Check className="w-3.5 h-3.5" />
                          Mark Read
                        </button>
                      )}
                      <button 
                        onClick={() => deleteNotification(notif.id)}
                        className="flex items-center gap-2 px-4 py-2 bg-zinc-800 text-zinc-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Dismiss
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};
