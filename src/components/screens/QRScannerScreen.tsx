import React, { useEffect, useRef, useState } from 'react';
import QrScanner from 'qr-scanner';
import { ScreenType } from '../../types/navigation';
import { Button } from '@/components/ui/button';
import { Camera, X, Shield, ArrowLeft, QrCode } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { usePresence } from '../../contexts/PresenceContext';

export const QRScannerScreen: React.FC<{ navigateTo: (screen: ScreenType, params?: any) => void }> = ({ navigateTo }) => {
  const { verifyPresence } = usePresence();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [scanner, setScanner] = useState<QrScanner | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (videoRef.current) {
      const qrScanner = new QrScanner(
        videoRef.current,
        (result) => {
          console.log('Decoded QR code:', result);
          if (result && result.data) {
            handleScanSuccess(result.data);
          }
        },
        {
          highlightScanRegion: true,
          highlightCodeOutline: true,
          returnDetailedScanResult: true
        }
      );

      qrScanner.start().then(() => {
        setIsReady(true);
        setScanner(qrScanner);
      }).catch(err => {
        console.error("Failed to start scanner:", err);
        toast.error("Camera access denied or not found");
      });

      return () => {
        qrScanner.destroy();
      };
    }
  }, []);

  const handleScanSuccess = (data: string) => {
    // In a real app, we would validate the venue ID from the QR data
    const venueId = data.includes('venue_') ? data : 'venue_1';
    scanner?.stop();
    verifyPresence(venueId);
    toast.success("Venue Verified! You are now ACTIVE.");
    navigateTo('VENUE_DETAIL', { venueId });
  };

  return (
    <div className="h-screen bg-zinc-950 relative overflow-hidden">
      {/* Camera View - Background */}
      <video 
        ref={videoRef} 
        className="absolute inset-0 w-full h-full object-cover"
        playsInline
      />
      
      {/* Dark Overlay for better contrast */}
      <div className="absolute inset-0 bg-black/20 pointer-events-none" />

      {/* Header */}
      <div className="absolute top-12 left-6 z-30">
        <button onClick={() => navigateTo('HOME')} className="w-12 h-12 bg-black/50 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center justify-center transition-all hover:bg-black/70 active:scale-95">
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
      </div>

      {/* Scanner Visuals / Scanning Guide */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none">
        <div className="w-64 h-64 border-2 border-cyan-500/30 rounded-[40px] relative">
          <div className="absolute -top-1 -left-1 w-12 h-12 border-t-4 border-l-4 border-cyan-500 rounded-tl-[40px]" />
          <div className="absolute -top-1 -right-1 w-12 h-12 border-t-4 border-r-4 border-cyan-500 rounded-tr-[40px]" />
          <div className="absolute -bottom-1 -left-1 w-12 h-12 border-b-4 border-l-4 border-cyan-500 rounded-bl-[40px]" />
          <div className="absolute -bottom-1 -right-1 w-12 h-12 border-b-4 border-r-4 border-cyan-500 rounded-br-[40px]" />
          
          <motion.div 
            animate={{ top: ['0%', '100%'] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="absolute left-0 right-0 h-1 bg-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.8)]"
          />
        </div>
        <div className="mt-8 px-6 py-2 bg-black/60 backdrop-blur-md rounded-full border border-white/10">
          <p className="text-white font-black tracking-[0.2em] uppercase text-[9px]">
            Scanning for Venue QR...
          </p>
        </div>
      </div>

      {/* Bottom Interface */}
      <div className="absolute bottom-0 left-0 right-0 p-8 pb-12 bg-gradient-to-t from-zinc-950 via-zinc-950/90 to-transparent z-40">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="max-w-md mx-auto"
        >
          <div className="glass-dark border border-white/10 p-6 rounded-[2.5rem] shadow-2xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center border border-cyan-500/30">
                <Shield className="w-6 h-6 text-cyan-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-base text-white tracking-tight">Secure Presence</h3>
                <p className="text-[11px] text-zinc-400 font-medium leading-normal">Verify your location to unlock exclusive local features.</p>
              </div>
            </div>
            
            <Button 
              onClick={() => handleScanSuccess('venue_1')}
              className="w-full h-14 bg-violet-600 hover:bg-violet-500 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-violet-600/20 active:scale-95 transition-all"
            >
              Mock Successful Scan
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
