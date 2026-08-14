/**
 * Socket.IO Client Manager
 * 
 * Features:
 * - WebSocket-first with polling fallback
 * - JWT authentication via headers
 * - Room management for chat
 * - Auto-reconnection with cleanup
 * - Singleton pattern for single socket instance
 * - Room join queue for when socket is disconnected
 * - Exponential backoff for server-initiated disconnects
 */

import { io, Socket } from 'socket.io-client';

// ============================================
// Singleton Socket Instance
// ============================================

let socket: Socket | null = null;
let currentToken: string | null = null;

// Track joined rooms to prevent duplicate joins
const activeRooms = new Set<string>();

// Track rooms that need to be joined when the socket connects
const pendingRooms = new Set<string>();

// Track reconnection attempts for server-initiated disconnects
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 10;

// Timer to reset reconnection attempts only after a stable connection
let reconnectResetTimer: ReturnType<typeof setTimeout> | null = null;

// ============================================
// Public API
// ============================================

/**
 * Get or create socket connection
 * @param token - JWT authentication token
 * @returns Socket instance or null
 */
export function getSocket(token: string): Socket | null {
  // SSR safety check
  if (typeof window === 'undefined') {
    return null;
  }

  // Return existing socket if created with same token (connecting or connected)
  if (socket && currentToken === token) {
    return socket;
  }

  // Cleanup old socket if switching token
  cleanupSocket();

  // Create new connection
  currentToken = token;
  const rawUrl = process.env.NEXT_PUBLIC_SOCKET_URL || process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_ENDPOINT || '';
  // Ensure base URL has no trailing slashes or appended query params
  const baseUrl = rawUrl.replace(/\/+$/, '');

  socket = io(baseUrl, {
    transports: ['polling', 'websocket'],
    upgrade:true,
    // Send token as HTTP header (socket.handshake.headers)
    extraHeaders: {
      authorization: `Bearer ${token}`,
    },
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
  });
  setupEventHandlers();

  return socket;
}


export function joinRoom(conversationId: string): void {
  if (!conversationId) {
    console.warn('[Socket] Cannot join room: No conversation ID provided');
    return;
  }

  // Prevent duplicate joins
  if (activeRooms.has(conversationId)) {
    return;
  }

  if (!isSocketConnected()) {
    pendingRooms.add(conversationId);
    return;
  }

  // Join the room
  socket!.emit('joinRoom', {
    room_id: conversationId,
    conversation_id: conversationId,
  });

  activeRooms.add(conversationId);
}

/**
 * Join multiple rooms at once
 * @param conversationIds - Array of conversation IDs
 */
export function joinRooms(conversationIds: string[]): void {
  if (!conversationIds.length) return;
  conversationIds.forEach(id => joinRoom(id));
}

/**
 * Leave a chat room
 * @param conversationId - The conversation/room ID to leave
 */
export function leaveRoom(conversationId: string): void {
  if (!conversationId) return;

  // Remove from pending queue if present
  pendingRooms.delete(conversationId);

  if (!isSocketConnected()) return;

  socket!.emit('leaveRoom', {
    room_id: conversationId,
    conversation_id: conversationId,
  });

  activeRooms.delete(conversationId);
}

/**
 * Disconnect socket and cleanup all resources
 */
export function disconnectSocket(): void {
  if (!socket) return;

  cleanupSocket();
}

/**
 * Check if socket is currently connected
 * @returns true if connected, false otherwise
 */
export function isSocketConnected(): boolean {
  return socket?.connected ?? false;
}

/**
 * Check if a room is currently joined
 * @param conversationId - The conversation ID to check
 * @returns true if joined, false otherwise
 */
export function isRoomJoined(conversationId: string): boolean {
  return activeRooms.has(conversationId);
}

/**
 * Clear all joined rooms (for testing/debugging)
 */
export function clearJoinedRooms(): void {
  activeRooms.clear();
  pendingRooms.clear();
}

// ============================================
// Private Helper Functions
// ============================================

/**
 * Setup socket event handlers
 */
function setupEventHandlers(): void {
  if (!socket) return;

  // Successful connection
  socket.on('connect', () => {
    if (reconnectResetTimer) clearTimeout(reconnectResetTimer);
    reconnectResetTimer = setTimeout(() => {
      reconnectAttempts = 0;
      reconnectResetTimer = null;
    }, 10000);
    processPendingRooms();
  });

  // Disconnection handler
  socket.on('disconnect', (reason) => {
    console.warn('[Socket] Disconnected:', reason);

    // Server-initiated disconnect - clear rooms and manually reconnect
    // with exponential backoff
    if (reason === 'io server disconnect') {
      activeRooms.clear();

      // Cancel the stable-connection timer since the server disconnected
      // before the connection was considered stable.
      if (reconnectResetTimer) {
        clearTimeout(reconnectResetTimer);
        reconnectResetTimer = null;
      }

      // Socket.IO does NOT auto-reconnect on server-initiated disconnect.
      // Only attempt reconnection if we haven't exceeded the max attempts.
      reconnectAttempts++;

      if (reconnectAttempts > MAX_RECONNECT_ATTEMPTS) {
        console.error(
          `[Socket] Max reconnection attempts (${MAX_RECONNECT_ATTEMPTS}) reached. ` +
          'The server keeps disconnecting. Stopping reconnection attempts.'
        );
        return;
      }

      // Exponential backoff: 2s, 4s, 8s, 16s, 30s, 30s, ...
      const delay = Math.min(
      2000 * Math.pow(2, reconnectAttempts - 1),
      30000,
     );
     setTimeout(() => {
        if (socket && currentToken && !socket.connected) {
          socket.connect();
        }
      }, delay);
    }
  });

  // Connection error handler
  socket.on('connect_error', (error) => {
    console.error('[Socket] Connection error:', error.message);
  });
}

/**
 * Process pending room joins (called on connect)
 */
function processPendingRooms(): void {
  if (pendingRooms.size === 0) return;

  const rooms = Array.from(pendingRooms);
  pendingRooms.clear();

  rooms.forEach(roomId => {
    // Skip already-joined rooms
    if (activeRooms.has(roomId)) return;

    if (socket?.connected) {
      socket.emit('joinRoom', {
        room_id: roomId,
        conversation_id: roomId,
      });
      activeRooms.add(roomId);
    } else {
      // Socket disconnected while processing - re-queue
      pendingRooms.add(roomId);
    }
  });
}

/**
 * Cleanup socket and reset state
 */
function cleanupSocket(): void {
  if (socket) {
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
  }

  if (reconnectResetTimer) {
    clearTimeout(reconnectResetTimer);
    reconnectResetTimer = null;
  }

  currentToken = null;
  activeRooms.clear();
  pendingRooms.clear();
  reconnectAttempts = 0;
}
