import React, { createContext, useContext, useState } from 'react';

interface PresenceContextType {
  verifiedVenueId: string | null;
  verifyPresence: (venueId: string) => void;
  clearPresence: () => void;
}

const PresenceContext = createContext<PresenceContextType>({
  verifiedVenueId: null,
  verifyPresence: () => {},
  clearPresence: () => {},
});

export const usePresence = () => useContext(PresenceContext);

export const PresenceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [verifiedVenueId, setVerifiedVenueId] = useState<string | null>(null);

  const verifyPresence = (venueId: string) => {
    setVerifiedVenueId(venueId);
  };

  const clearPresence = () => {
    setVerifiedVenueId(null);
  };

  return (
    <PresenceContext.Provider value={{ verifiedVenueId, verifyPresence, clearPresence }}>
      {children}
    </PresenceContext.Provider>
  );
};
