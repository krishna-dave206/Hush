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
    <div className="h-screen bg-zinc-950 flex flex-col relative overflow-hidden">
      {/* Header */}
      <div className="absolute top-12 left-6 z-20">
        <button onClick={() => navigateTo('HOME')} className="w-12 h-12 bg-black/50 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center justify-center">
          <ArrowLeft className="w-6 h-6" />
        </button>
      </div>

      {/* Scanner Visuals */}
      <div className="flex-1 relative">
        <video 
          ref={videoRef} 
          className="w-full h-full object-cover"
        />
        
        {/* Overlay Guide */}
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none">
          <div className="w-72 h-72 border-2 border-indigo-500/50 rounded-[40px] relative">
            <div className="absolute -top-1 -left-1 w-12 h-12 border-t-4 border-l-4 border-indigo-500 rounded-tl-[40px]" />
            <div className="absolute -top-1 -right-1 w-12 h-12 border-t-4 border-r-4 border-indigo-500 rounded-tr-[40px]" />
            <div className="absolute -bottom-1 -left-1 w-12 h-12 border-b-4 border-l-4 border-indigo-500 rounded-bl-[40px]" />
            <div className="absolute -bottom-1 -right-1 w-12 h-12 border-b-4 border-r-4 border-indigo-500 rounded-br-[40px]" />
            
            <motion.div 
              animate={{ top: ['0%', '100%'] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="absolute left-0 right-0 h-1 bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.8)] opacity-50"
            />
          </div>
          <p className="mt-12 text-white font-black tracking-[0.2em] uppercase text-[10px] glass-dark px-8 py-4 rounded-3xl border border-white/10">
            Scanning for Venue QR...
          </p>
        </div>
      </div>

      {/* Bottom Info */}
      <div className="p-10 glass-dark border-t border-white/5 rounded-t-[3rem] relative z-20 -mt-12">
        <div className="flex items-center gap-5 mb-8">
          <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center border border-indigo-500/20">
            <Shield className="w-7 h-7 text-indigo-500" />
          </div>
          <div>
            <h3 className="font-bold text-lg font-display">Secure Presence</h3>
            <p className="text-sm text-zinc-500 leading-tight font-medium">Verify your location to unlock anonymous local chat.</p>
          </div>
        </div>
        <Button 
          variant="outline" 
          onClick={() => handleScanSuccess('venue_1')}
          className="w-full h-16 border-white/5 bg-zinc-900/50 hover:bg-white hover:text-black rounded-2xl font-black uppercase tracking-widest text-[11px] transition-all"
        >
          Mock Successful Scan
        </Button>
      </div>
    </div>
  );
};
