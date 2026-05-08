export interface User {
  id: string;
  handle: string;
  age: number;
  gender?: string;
  interests: string[];
  photoURL?: string;
  savedVenues?: string[];
  createdAt: string;
}

export interface Venue {
  id: string;
  name: string;
  address: string;
  location: { lat: number; lng: number };
  radius: number;
  activeCount: number;
  qrCode: string;
}

export interface ActiveSession {
  id: string;
  userId: string;
  venueId: string;
  status: 'ACTIVE' | 'EXPIRED';
  expiresAt: string;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  senderHandle: string;
  text: string;
  timestamp: string;
  type: 'text' | 'reveal_request' | 'reveal_confirmed';
}

export interface Chat {
  id: string;
  participants: string[];
  lastMessage?: string;
  updatedAt: string;
  venueId: string;
  otherUser?: User; // Dynamically added
}
