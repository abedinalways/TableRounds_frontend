import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;
let socketToken: string | null = null;
const pendingJoins = new Set<string>();
const joinedRooms = new Set<string>(); // Track rooms already joined

const roomJoinPayload = (conversationId: string) => ({
  room_id: conversationId,
  conversation_id: conversationId,
});

function emitJoinRoom(sock: Socket, conversationId: string) {
  const payload = roomJoinPayload(conversationId);
  console.log(`[Chat Socket] Emitting joinRoom for room: ${conversationId}`);
  sock.emit('joinRoom', payload);
}

function flushPendingJoins(sock: Socket) {
  console.log(`[Chat Socket] Flushing ${pendingJoins.size} pending joins`);
  const idsToJoin: string[] = [];
  pendingJoins.forEach(id => {
    if (!joinedRooms.has(id)) {
      joinedRooms.add(id);
      idsToJoin.push(id);
    }
  });
  pendingJoins.clear();

  // Join rooms that were in pending joins
  idsToJoin.forEach(id => emitJoinRoom(sock, id));
}

/**
 * Rejoin all rooms that were previously joined.
 * Used after a server-initiated disconnect to restore room subscriptions.
 */
function rejoinAllRooms(sock: Socket) {
  if (joinedRooms.size === 0) {
    console.log('[Chat Socket] No rooms to rejoin');
    return;
  }
  console.log(`[Chat Socket] Rejoining ${joinedRooms.size} rooms after reconnect`);
  joinedRooms.forEach(id => emitJoinRoom(sock, id));
}

export function joinRoom(conversationId: string) {
  if (!conversationId) return;

  // Prevent duplicate room joins
  if (joinedRooms.has(conversationId)) {
    console.log(`[Chat Socket] Room ${conversationId} already joined, skipping`);
    return;
  }

  if (!socket?.connected) {
    console.log(`[Chat Socket] Socket not connected. Adding ${conversationId} to pending joins.`);
    pendingJoins.add(conversationId);
    return;
  }

  joinedRooms.add(conversationId);
  emitJoinRoom(socket, conversationId);
}

export function joinRooms(conversationIds: string[]) {
  conversationIds.forEach(joinRoom);
}

// Export function to check if room is already joined (for useChatSocket to use)
export function isRoomJoined(conversationId: string): boolean {
  return joinedRooms.has(conversationId);
}

// Export function to clear joined rooms (for testing/debugging)
export function clearJoinedRooms() {
  joinedRooms.clear();
}

export const getSocket = (token?: string): Socket | null => {
  if (typeof window === 'undefined') return null; // Prevent SSR errors

  // If no token provided, return existing socket or null
  if (!token) return socket;

  // If token changed, disconnect old socket
  if (socket && socketToken !== token) {
    console.log('[Chat Socket] Token changed, disconnecting old socket');
    socket.removeAllListeners(); // Clean up all listeners to prevent duplicates
    socket.disconnect();
    socket = null;
    pendingJoins.clear();
    joinedRooms.clear();
  }

  // Return existing socket if already initialized with same token
  if (socket) {
    return socket;
  }

  // Create new socket if we don't have one
  socketToken = token;
  const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL!;
  console.log('[Chat Socket] Initializing connection to:', socketUrl);

  socket = io(socketUrl, {
    transports: ['polling'],
    extraHeaders: {
      authorization: `Bearer ${token}`,
    },
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
  });

  socket.on('connect', () => {
    console.log('[Chat Socket] Connected successfully! ID:', socket?.id);
    flushPendingJoins(socket!);
  });

  socket.on('disconnect', (reason) => {
    console.warn('[Chat Socket] Disconnected! Reason:', reason);
    if (reason === 'io server disconnect') {
      joinedRooms.clear();
      pendingJoins.clear();
      if (socket) socket.connect();
    }
  });

  socket.on('connect_error', (error) => {
    console.error('[Chat Socket] Connection error:', error.message);
  });

  socket.on('reconnect', (attempt) => {
    console.log('[Chat Socket] Reconnected after', attempt, 'attempts');
    // Rejoin all previously joined rooms on reconnect
    rejoinAllRooms(socket!);
  });

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    console.log('[Chat Socket] Explicitly disconnecting socket');
    socket.removeAllListeners(); // Clean up all listeners
    socket.disconnect();
    socket = null;
    socketToken = null;
    pendingJoins.clear();
    joinedRooms.clear();
  }
};

// Add a function to remove duplicate pending joins
export const clearPendingJoins = () => {
  pendingJoins.clear();
};
