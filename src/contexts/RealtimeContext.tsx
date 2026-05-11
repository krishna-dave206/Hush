import React, { createContext, useContext } from 'react';

interface RealtimeContextType {
  socket: null;
  isConnected: boolean;
}

const RealtimeContext = createContext<RealtimeContextType>({
  socket: null,
  isConnected: false,
});

export const useRealtime = () => useContext(RealtimeContext);

export const RealtimeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <RealtimeContext.Provider
      value={{
        socket: null,
        isConnected: false,
      }}
    >
      {children}
    </RealtimeContext.Provider>
  );
};