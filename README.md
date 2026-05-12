# Hush: Anonymous Real-World Social Discovery

Hush is a location-aware social discovery platform that helps people connect anonymously with others around them in real-world spaces like cafés, restaurants, libraries, events, co-working spaces, airports, campuses, and more.

Users verify their physical presence by scanning a venue QR code, allowing them to discover and chat with nearby active people anonymously before deciding whether to reveal their identity and meet safely.

---

# ✨ Features

## 🔐 Anonymous Presence Verification
- Users scan venue-specific QR codes
- Presence gets verified in real time
- Only verified users at the venue can interact

## 📍 Location-Based Discovery
- Discover nearby active users
- Explore active venues around you
- View venue activity dynamically

## 💬 Anonymous Chat
- One-on-one private conversations
- Identity hidden by default
- Minimal and distraction-free chat experience

## 👤 Controlled Identity Reveal
- Reveal table number or meetup location only when comfortable
- Designed with consent-first interaction flow

## 🛡️ Safety Features
- Panic exit system
- Session termination
- Temporary user blocking
- Privacy-first architecture

## 📱 Mobile-First Experience
- Optimized for phone interactions
- Smooth bottom navigation
- Modern dark UI with responsive layouts

---

# 🧠 Problem Statement

Meeting new people in public places is often socially awkward, unsafe, or difficult.

Hush bridges the gap between:
- online social discovery
- and real-world human interaction

by enabling verified anonymous interactions between people sharing the same physical environment.

---

# 🚀 User Flow

```text
App Launch
   ↓
Authentication
   ↓
Profile Setup
   ↓
Home Discovery Feed
   ↓
Venue Discovery / Activity Map
   ↓
QR Verification
   ↓
Verified Presence
   ↓
Nearby Active Users
   ↓
Anonymous Chat
   ↓
Identity Reveal
   ↓
Real-world Meetup
```

---

# 🖼️ Application Modules

## 1. Authentication
- OTP / Google Authentication
- User onboarding
- Identity setup

## 2. Discovery
- Nearby venues
- Active places
- Live user activity feed

## 3. Verification System
- QR code scanning
- Venue authentication
- Presence validation

## 4. Social Layer
- Anonymous messaging
- Reveal requests
- Safety controls

## 5. Utility & Personalization
- Saved venues
- Notifications
- Privacy settings
- Profile controls

---

# 🛠️ Tech Stack

## Frontend
- React
- TypeScript
- TailwindCSS
- Framer Motion
- ShadCN UI

## Backend / Services
- Firebase Authentication
- Google Maps Platform
- Gemini API

## Deployment
- Vercel

---

# 📦 Installation

## Clone Repository

```bash
git clone <your-repository-url>
cd cliq
```

## Install Dependencies

```bash
npm install
```

## Setup Environment Variables

Create a `.env.local` file in the root directory:

```env
GOOGLE_MAPS_PLATFORM_KEY=YOUR_KEY
GEMINI_API_KEY=YOUR_KEY
```

## Start Development Server

```bash
npm run dev
```

---

# 🌐 Deployment

The application is deployed using Vercel.

## Deploy

```bash
vercel
```

Or connect the GitHub repository directly through:
- https://vercel.com

---

# 📌 Demo Notes

This project is built as an internship assignment prototype.

Some realtime systems such as:
- socket infrastructure
- live synchronization
- production-scale authentication

have been simplified for demonstration purposes while preserving the complete user experience and product flow.

---

# 🎯 Future Improvements

- Real-time Socket.IO infrastructure
- AI-based conversation matching
- Smart venue recommendations
- Trust scoring system
- Temporary communities/events
- Audio spaces
- Group meetups
- Moderation systems

---

# 👨‍💻 Author

Krishna Dave

---

# 📄 License

The project is for educational and demonstration purposes.
