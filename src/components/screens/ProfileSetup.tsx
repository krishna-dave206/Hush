import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { motion } from 'motion/react';
import { User, Sparkles, X } from 'lucide-react';
import { toast } from 'sonner';

const INTERESTS = ['Music', 'Coffee', 'Gaming', 'Art', 'Fitness', 'Tech', 'Hiking', 'Reading', 'Travel', 'Food', 'Design', 'Yoga'];

export const ProfileSetup: React.FC = () => {
  const { setProfile } = useAuth();
  const [handle, setHandle] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev => 
      prev.includes(interest) ? prev.filter(i => i !== interest) : [...prev, interest]
    );
  };

  const handleSubmit = async () => {
    if (!handle || !age) {
      toast.error("Please fill in handle and age");
      return;
    }
    if (parseInt(age) < 18) {
      toast.error("You must be 18+ to use CoolCliq");
      return;
    }

    setLoading(true);
    try {
      await setProfile({
        handle: handle.startsWith('@') ? handle : `@${handle}`,
        age: parseInt(age),
        gender,
        interests: selectedInterests,
      });
      toast.success("Profile created!");
    } catch (error) {
      toast.error("Failed to save profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 px-8 pt-20 pb-12 overflow-y-auto font-sans">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <span className="text-emerald-500 font-black tracking-[0.4em] text-[8px] uppercase mb-4 block">Identity Configuration</span>
        <h1 className="text-4xl font-bold tracking-tight mb-4 font-display text-glow">Setup Profile</h1>
        <p className="text-zinc-500 text-base font-medium leading-relaxed">The digital mask you choose defines your experience in the Cliq.</p>
      </motion.div>

      <div className="space-y-10">
        <div className="space-y-5">
          <label className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] px-2">Core Identity</label>
          <div className="relative group">
            <User className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-emerald-500 transition-colors" />
            <Input
              placeholder="@your_handle"
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              className="h-16 pl-14 bg-zinc-900 border-white/5 rounded-3xl text-lg font-bold tracking-tight focus:ring-emerald-500/20 placeholder:text-zinc-800"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              type="number"
              placeholder="Age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="h-16 bg-zinc-900 border-white/5 rounded-3xl text-lg font-bold focus:ring-emerald-500/20 text-center"
            />
            <div className="relative">
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full h-16 px-6 bg-zinc-900 border-white/5 rounded-3xl text-sm font-bold text-zinc-400 focus:ring-emerald-500/20 outline-none appearance-none cursor-pointer"
              >
                <option value="" disabled>Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
                <option value="Hidden">Secret</option>
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="flex items-center justify-between px-2">
            <label className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em]">Interest Tags</label>
            <Sparkles className="w-4 h-4 text-emerald-500 animate-pulse" />
          </div>
          <div className="flex flex-wrap gap-2.5">
            {INTERESTS.map(interest => (
              <Badge
                key={interest}
                onClick={() => toggleInterest(interest)}
                className={`px-5 py-2.5 rounded-2xl cursor-pointer transition-all border shadow-sm text-[10px] uppercase font-black tracking-widest ${
                  selectedInterests.includes(interest)
                    ? 'bg-emerald-600 text-white border-emerald-500 shadow-emerald-900/20'
                    : 'bg-zinc-900 text-zinc-500 border-white/5 hover:bg-zinc-800'
                }`}
              >
                {interest}
                {selectedInterests.includes(interest) && <X className="ml-2 w-3.5 h-3.5" />}
              </Badge>
            ))}
          </div>
        </div>

        <Button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full h-16 bg-white text-black hover:bg-zinc-200 rounded-3xl text-sm font-black uppercase tracking-[0.2em] shadow-2xl shadow-black/50 disabled:opacity-50 active:scale-95 transition-all mt-8"
        >
          {loading ? 'Initializing...' : 'Confirm Identity'}
        </Button>
      </div>
    </div>
  );
};
