import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useRealtime } from "../../contexts/RealtimeContext";
import { ScreenType } from "../../types/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  Send,
  ShieldAlert,
  UserCheck,
  MapPin,
  MoreHorizontal,
  AlertTriangle,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface Message {
  id: string;
  senderId: string;
  senderHandle: string;
  text: string;
  timestamp: string;
  type?: "text" | "reveal_request" | "reveal_confirmed";
}

export const ChatScreen: React.FC<{
  chatId?: string;
  recipientId?: string;
  navigateTo: (screen: ScreenType, params?: any) => void;
}> = ({ chatId, recipientId, navigateTo }) => {
  const { user } = useAuth();
  const { socket }: any = null;
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isPanicOpen, setIsPanicOpen] = useState(false);
  const [isRevealOpen, setIsRevealOpen] = useState(false);
  const [hasRevealed, setHasRevealed] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const mockRecipient = {
    id: recipientId || "1",
    handle: "@urban_knight",
  };

  useEffect(() => {
    if (!socket || !user) return;

    const roomId = chatId || `chat_${user.id}_${mockRecipient.id}`;
    socket.emit("join-room", roomId);

    socket.on("receive-message", (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("receive-message");
    };
  }, [socket, user, chatId, mockRecipient.id]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo(0, scrollRef.current.scrollHeight);
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputText.trim() || !user) return;

    const newMsg: Message = {
      id: Date.now().toString(),
      senderId: user.id,
      senderHandle: user.handle,
      text: inputText,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputText("");
  };

  const handlePanicExit = () => {
    setIsPanicOpen(false);
    toast.error("Session terminated for safety.");
    navigateTo("HOME");
  };

  const handleReveal = () => {
    setIsRevealOpen(false);
    setHasRevealed(true);
    toast.success("Identity revealed! Meet safely.");
    const newMsg: Message = {
      id: Date.now().toString(),
      senderId: user!.id,
      senderHandle: user!.handle,
      text: "I've revealed my location/identity! Click to view.",
      timestamp: new Date().toISOString(),
      type: "reveal_confirmed",
    };
    socket?.emit("send-message", {
      roomId: chatId || `chat_${user!.id}_${mockRecipient.id}`,
      ...newMsg,
    });
  };

  return (
    <div className="h-screen bg-zinc-950 flex flex-col pt-12">
      {/* Chat Header */}
      <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-zinc-950/80 backdrop-blur-xl sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigateTo("HOME")}
            className="w-10 h-10 flex items-center justify-center transition-all bg-zinc-900 border border-white/5 rounded-xl"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10 rounded-xl border border-white/10">
              <AvatarFallback className="bg-orange-500/10 text-orange-500 font-bold">
                {mockRecipient.handle[1].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="font-bold text-sm tracking-tight">
                {mockRecipient.handle}
              </h2>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                  Active Nearby
                </span>
              </div>
            </div>
          </div>
        </div>
        <button
          onClick={() => setIsPanicOpen(true)}
          className="w-10 h-10 flex items-center justify-center bg-red-500/10 text-red-500 rounded-xl border border-red-500/20 active:scale-90 transition-all"
        >
          <ShieldAlert className="w-5 h-5" />
        </button>
      </div>

      {/* Messages area */}
      <ScrollArea className="flex-1 px-6">
        <div ref={scrollRef} className="py-8 flex flex-col gap-6">
          <div className="flex flex-col items-center justify-center text-center px-8 mb-8">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
              <ShieldAlert className="w-8 h-8 text-zinc-600" />
            </div>
            <h4 className="text-sm font-bold text-zinc-400 mb-1 tracking-tight">
              Encryption Active
            </h4>
            <p className="text-[10px] text-zinc-600 uppercase tracking-[0.2em] font-medium max-w-[200px]">
              Your identity is hidden until you choose to reveal.
            </p>
          </div>

          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={`flex flex-col ${msg.senderId === user?.id ? "items-end" : "items-start"}`}
            >
              {msg.type === "reveal_confirmed" ? (
                <div className="bg-orange-500/10 border border-orange-500/20 p-4 rounded-3xl max-w-[80%] flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-500 rounded-2xl flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-orange-500 uppercase tracking-widest mb-1">
                      Location Shared
                    </p>
                    <p className="text-sm text-white/90">Meet at Table #4</p>
                  </div>
                </div>
              ) : (
                <div
                  className={`max-w-[80%] px-5 py-3 rounded-[24px] text-sm leading-relaxed shadow-sm ${
                    msg.senderId === user?.id
                      ? "bg-orange-600 text-white rounded-br-none"
                      : "bg-zinc-900 text-white rounded-bl-none border border-white/5"
                  }`}
                >
                  {msg.text}
                </div>
              )}
              <span className="text-[9px] font-bold text-zinc-600 tracking-widest mt-1.5 flex items-center gap-1 uppercase">
                {new Date(msg.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
                {msg.senderId === user?.id && (
                  <span className="opacity-50">· Sent</span>
                )}
              </span>
            </motion.div>
          ))}
        </div>
      </ScrollArea>

      {/* Input area */}
      <div className="px-6 pb-12 pt-4 bg-zinc-950 border-t border-white/5 space-y-4">
        {!hasRevealed && (
          <button
            onClick={() => setIsRevealOpen(true)}
            className="w-full h-10 bg-zinc-900 border border-white/5 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 rounded-xl flex items-center justify-center gap-2 hover:bg-zinc-800 transition-all active:scale-95"
          >
            <UserCheck className="w-3 h-3" />
            Reveal table or meetup spot
          </button>
        )}

        <div className="flex gap-3">
          <div className="flex-1 relative group">
            <Input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Send anonymous message..."
              className="h-14 bg-zinc-900 border-zinc-800/50 rounded-2xl pl-12 pr-4 focus:ring-orange-500/20 text-sm"
            />
            <MoreHorizontal className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600" />
          </div>
          <Button
            onClick={handleSendMessage}
            className="w-14 h-14 bg-orange-600 hover:bg-orange-700 rounded-2xl flex items-center justify-center shadow-xl shadow-orange-600/10 active:scale-90 transition-all"
          >
            <Send className="w-6 h-6 text-white" />
          </Button>
        </div>
      </div>

      {/* Panic Modal */}
      <Dialog open={isPanicOpen} onOpenChange={setIsPanicOpen}>
        <DialogContent className="bg-zinc-900 border-red-500/20 rounded-[32px] max-w-[90vw] mx-auto sm:max-w-md">
          <DialogHeader className="flex flex-col items-center text-center space-y-4">
            <div className="w-16 h-16 bg-red-500/10 rounded-3xl flex items-center justify-center text-red-500 border border-red-500/20">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <DialogTitle className="text-2xl font-bold tracking-tight text-white">
              Panic Exit?
            </DialogTitle>
            <DialogDescription className="text-zinc-400 text-base">
              This will instantly end the chat, block this user for the session,
              and clear your presence from the venue.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col gap-3 sm:flex-col mt-4">
            <Button
              onClick={handlePanicExit}
              className="h-14 bg-red-600 hover:bg-red-700 text-white font-bold rounded-2xl w-full"
            >
              Yes, Terminate Session
            </Button>
            <Button
              variant="ghost"
              onClick={() => setIsPanicOpen(false)}
              className="text-zinc-500 font-bold w-full uppercase text-xs tracking-widest"
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reveal Modal */}
      <Dialog open={isRevealOpen} onOpenChange={setIsRevealOpen}>
        <DialogContent className="bg-zinc-900 border-white/10 rounded-[32px] max-w-[90vw] mx-auto sm:max-w-md">
          <DialogHeader className="flex flex-col items-center text-center space-y-4">
            <div className="w-16 h-16 bg-orange-500/10 rounded-3xl flex items-center justify-center text-orange-500 border border-orange-500/20">
              <UserCheck className="w-8 h-8" />
            </div>
            <DialogTitle className="text-2xl font-bold tracking-tight text-white">
              Reveal Identity?
            </DialogTitle>
            <DialogDescription className="text-zinc-400 text-base">
              This will show your table number and profile photo to this user.
              Only reveal if you feel safe meeting.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col gap-3 sm:flex-col mt-4">
            <Button
              onClick={handleReveal}
              className="h-14 bg-white text-black hover:bg-zinc-200 font-bold rounded-2xl w-full"
            >
              I'm ready to meet
            </Button>
            <Button
              variant="ghost"
              onClick={() => setIsRevealOpen(false)}
              className="text-zinc-500 font-bold w-full uppercase text-xs tracking-widest text-[10px]"
            >
              Stay Anonymous
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
