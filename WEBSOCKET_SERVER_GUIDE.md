# WebSocket Server Guide voor Real-time Collaboration

## 🎯 Wat is een WebSocket Server?

Een WebSocket server is een server die **real-time** communicatie mogelijk maakt tussen gebruikers. In plaats van dat je app steeds moet vragen "is er iets nieuws?" (polling), houdt de server een **open verbinding** en stuurt direct updates.

## 🚀 Optie 1: Supabase Realtime (Aanbevolen - Makkelijkst)

Supabase heeft **al** real-time features ingebouwd! Je hoeft geen aparte server te bouwen.

### Hoe het werkt:
1. Supabase database heeft **Realtime** ingeschakeld
2. Je app luistert naar database changes
3. Wanneer iemand een script update → anderen krijgen direct een update

### Implementatie:

```javascript
// In je ScriptEditor component
import { supabase } from '@/lib/supabase';

// Luister naar changes in de scripts table
useEffect(() => {
  const channel = supabase
    .channel('script-changes')
    .on('postgres_changes', {
      event: 'UPDATE',
      schema: 'public',
      table: 'scripts',
      filter: `id=eq.${scriptId}`
    }, (payload) => {
      // Iemand heeft het script geüpdatet!
      console.log('Script updated:', payload.new);
      // Update de editor content
      setEditorContent(payload.new.content);
    })
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, [scriptId]);
```

### Voordelen:
- ✅ Geen extra server nodig
- ✅ Gratis (binnen Supabase limits)
- ✅ Automatisch beveiligd met Row Level Security
- ✅ Werkt direct met je bestaande database

### Nadelen:
- ⚠️ Minder controle over de real-time logica
- ⚠️ Geen custom cursor tracking (tenzij je dat zelf bouwt)

---

## 🔧 Optie 2: Eigen WebSocket Server (Volledige Controle)

Als je volledige controle wilt, kun je je eigen server bouwen.

### Architectuur:

```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│   Browser   │ ◄─────► │ WebSocket    │ ◄─────► │   Browser   │
│  (User 1)   │         │   Server     │         │  (User 2)   │
└─────────────┘         └──────────────┘         └─────────────┘
                              │
                              ▼
                        ┌──────────────┐
                        │   Database   │
                        │  (Supabase)  │
                        └──────────────┘
```

### Stap 1: Server Opzetten (Node.js + Socket.io)

Maak een nieuwe folder: `server/`

```bash
mkdir server
cd server
npm init -y
npm install socket.io express cors
```

**server/index.js:**
```javascript
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Je Vite dev server
    methods: ["GET", "POST"]
  }
});

// Store active connections per script
const scriptRooms = new Map(); // scriptId -> Set of socketIds

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join a script room
  socket.on('join-script', (scriptId) => {
    socket.join(`script-${scriptId}`);
    
    if (!scriptRooms.has(scriptId)) {
      scriptRooms.set(scriptId, new Set());
    }
    scriptRooms.get(scriptId).add(socket.id);
    
    // Notify others that someone joined
    socket.to(`script-${scriptId}`).emit('user-joined', {
      userId: socket.id,
      timestamp: Date.now()
    });
    
    console.log(`User ${socket.id} joined script ${scriptId}`);
  });

  // Handle script content updates
  socket.on('script-update', (data) => {
    const { scriptId, content, userId } = data;
    
    // Broadcast to all others in the room (except sender)
    socket.to(`script-${scriptId}`).emit('script-changed', {
      content,
      userId,
      timestamp: Date.now()
    });
    
    console.log(`Script ${scriptId} updated by ${userId}`);
  });

  // Handle cursor position updates
  socket.on('cursor-update', (data) => {
    const { scriptId, position, userId } = data;
    
    // Broadcast cursor position to others
    socket.to(`script-${scriptId}`).emit('cursor-moved', {
      position,
      userId,
      timestamp: Date.now()
    });
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    
    // Remove from all rooms
    scriptRooms.forEach((users, scriptId) => {
      if (users.has(socket.id)) {
        users.delete(socket.id);
        socket.to(`script-${scriptId}`).emit('user-left', {
          userId: socket.id
        });
      }
    });
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🚀 WebSocket server running on port ${PORT}`);
});
```

### Stap 2: Server Deployen

**Optie A: Vercel Serverless Functions**
```javascript
// vercel.json
{
  "functions": {
    "server/index.js": {
      "runtime": "nodejs18.x"
    }
  }
}
```

**Optie B: Railway/Render (Dedicated Server)**
- Upload je code naar Railway of Render
- Ze geven je een URL zoals: `https://your-server.railway.app`
- Update je frontend om naar die URL te connecten

**Optie C: Docker + VPS**
```dockerfile
# Dockerfile
FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3001
CMD ["node", "server/index.js"]
```

### Stap 3: Frontend Integratie

**Install Socket.io client:**
```bash
npm install socket.io-client
```

**In je ScriptEditor component:**
```javascript
import { useEffect, useRef } from 'react';
import io from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_WEBSOCKET_URL || 'http://localhost:3001';

export default function ScriptEditor({ scriptId, content, onChange }) {
  const socketRef = useRef(null);

  useEffect(() => {
    // Connect to WebSocket server
    socketRef.current = io(SOCKET_URL);
    
    // Join script room
    socketRef.current.emit('join-script', scriptId);
    
    // Listen for updates from others
    socketRef.current.on('script-changed', (data) => {
      // Update editor with content from other user
      onChange(data.content);
    });
    
    // Listen for cursor movements
    socketRef.current.on('cursor-moved', (data) => {
      // Show other user's cursor
      showRemoteCursor(data.userId, data.position);
    });
    
    // Cleanup
    return () => {
      socketRef.current?.disconnect();
    };
  }, [scriptId]);

  const handleContentChange = (newContent) => {
    // Send update to server
    socketRef.current?.emit('script-update', {
      scriptId,
      content: newContent,
      userId: socketRef.current.id
    });
    
    onChange(newContent);
  };

  // ... rest of component
}
```

---

## 📊 Vergelijking

| Feature | Supabase Realtime | Eigen WebSocket Server |
|---------|------------------|----------------------|
| **Setup** | ✅ 5 minuten | ⚠️ 1-2 uur |
| **Kosten** | ✅ Gratis (limits) | ✅ Gratis (hosting) |
| **Onderhoud** | ✅ Geen | ⚠️ Zelf onderhouden |
| **Controle** | ⚠️ Beperkt | ✅ Volledige controle |
| **Custom Features** | ⚠️ Moeilijk | ✅ Alles mogelijk |
| **Schaalbaarheid** | ✅ Automatisch | ⚠️ Zelf regelen |

---

## 🎯 Mijn Aanbeveling

**Start met Supabase Realtime** - het is makkelijker en werkt direct met je bestaande setup.

Als je later meer controle nodig hebt (bijv. custom cursor tracking, presence indicators, etc.), kun je altijd nog een eigen server bouwen.

---

## 🚀 Quick Start: Supabase Realtime

Wil je dat ik Supabase Realtime integreer in je ScriptEditor? Dan kunnen meerdere mensen tegelijk in hetzelfde script werken!

