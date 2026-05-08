import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { RealtimeProvider } from './contexts/RealtimeContext';
import { Toaster } from './components/ui/sonner';
import { Splash } from './components/screens/Splash';
import { Onboarding } from './components/screens/Onboarding';
import { AuthScreen } from './components/screens/AuthScreen';
import { ProfileSetup } from './components/screens/ProfileSetup';
import { HomeScreen } from './components/screens/HomeScreen';
import { VenueDetail } from './components/screens/VenueDetail';
import { ChatScreen } from './components/screens/ChatScreen';
import { QRScannerScreen } from './components/screens/QRScannerScreen';
import { SettingsScreen } from './components/screens/SettingsScreen';
import { ChatList } from './components/screens/ChatList';
import { EditProfile } from './components/screens/EditProfile';
import { SavedVenues } from './components/screens/SavedVenues';
import { NotificationsScreen } from './components/screens/NotificationsScreen';
import { AdminDashboard } from './components/screens/AdminDashboard';
import { ActiveUsersList } from './components/screens/ActiveUsersList';
import { ScreenType } from './types/navigation';
import { TooltipProvider } from '@/components/ui/tooltip';
import { PresenceProvider } from './contexts/PresenceContext';

const MainApp = () => {
  const { user, firebaseUser, loading } = useAuth();
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('SPLASH');
  const [screenParams, setScreenParams] = useState<any>(null);

  const navigateTo = (screen: ScreenType, params?: any) => {
    setCurrentScreen(screen);
    setScreenParams(params || null);
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    if (loading) return;

    if (!firebaseUser) {
      if (currentScreen !== 'ONBOARDING' && currentScreen !== 'SPLASH') {
        setCurrentScreen('AUTH');
      }
    } else if (!user) {
      setCurrentScreen('PROFILE_SETUP');
    } else if (currentScreen === 'SPLASH' || currentScreen === 'AUTH' || currentScreen === 'PROFILE_SETUP') {
      setCurrentScreen('HOME');
    }
  }, [user, firebaseUser, loading]);

  const renderScreen = () => {
    switch (currentScreen) {
      case 'SPLASH': return <Splash onFinish={() => navigateTo('ONBOARDING')} />;
      case 'ONBOARDING': return <Onboarding onFinish={() => navigateTo('AUTH')} />;
      case 'AUTH': return <AuthScreen />;
      case 'PROFILE_SETUP': return <ProfileSetup />;
      case 'HOME': return <HomeScreen navigateTo={navigateTo} />;
      case 'VENUE_DETAIL': return <VenueDetail venueId={screenParams?.venueId} navigateTo={navigateTo} />;
      case 'CHAT': return <ChatScreen chatId={screenParams?.chatId} recipientId={screenParams?.recipientId} navigateTo={navigateTo} />;
      case 'QR_SCANNER': return <QRScannerScreen navigateTo={navigateTo} />;
      case 'SETTINGS': return <SettingsScreen navigateTo={navigateTo} />;
      case 'CHAT_LIST': return <ChatList navigateTo={navigateTo} />;
      case 'EDIT_PROFILE': return <EditProfile navigateTo={navigateTo} />;
      case 'SAVED_VENUES': return <SavedVenues navigateTo={navigateTo} />;
      case 'NOTIFICATIONS': return <NotificationsScreen navigateTo={navigateTo} />;
      case 'ADMIN': return <AdminDashboard navigateTo={navigateTo} />;
      case 'ACTIVE_USERS': return <ActiveUsersList venueId={screenParams?.venueId} navigateTo={navigateTo} />;
      default: return <HomeScreen navigateTo={navigateTo} />;
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans selection:bg-indigo-500/30">
      {renderScreen()}
      <Toaster position="top-center" expand={false} richColors />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <PresenceProvider>
        <RealtimeProvider>
          <TooltipProvider>
            <MainApp />
          </TooltipProvider>
        </RealtimeProvider>
      </PresenceProvider>
    </AuthProvider>
  );
}
