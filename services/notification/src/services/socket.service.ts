import { Server as HttpServer } from 'http';
import { Server, Namespace, Socket } from 'socket.io';
import { createLogger } from '@ecom/common';

const logger = createLogger('notification-service');

// Map of userId -> Set<socketId> (a user may have multiple tabs/devices)
const userSocketMap = new Map<string, Set<string>>();

let io: Server;
let notificationsNamespace: Namespace;

export interface NotificationPayload {
  type: string;
  title: string;
  message: string;
  data?: Record<string, unknown>;
  timestamp: string;
}

/**
 * Initializes the Socket.IO server on the /notifications namespace.
 * Users connect with their userId as a query param.
 */
export const initSocketServer = (httpServer: HttpServer): Server => {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.CORS_ORIGIN || '*',
      methods: ['GET', 'POST'],
    },
  });

  notificationsNamespace = io.of('/notifications');

  notificationsNamespace.on('connection', (socket: Socket) => {
    const userId = socket.handshake.query.userId as string | undefined;

    if (!userId) {
      logger.warn('Socket connection rejected — missing userId', { socketId: socket.id });
      socket.disconnect(true);
      return;
    }

    // Register the socket for this user
    if (!userSocketMap.has(userId)) {
      userSocketMap.set(userId, new Set());
    }
    userSocketMap.get(userId)!.add(socket.id);

    logger.info('Client connected', {
      userId,
      socketId: socket.id,
      totalConnections: userSocketMap.get(userId)!.size,
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      const sockets = userSocketMap.get(userId);
      if (sockets) {
        sockets.delete(socket.id);
        if (sockets.size === 0) {
          userSocketMap.delete(userId);
        }
      }
      logger.info('Client disconnected', { userId, socketId: socket.id });
    });
  });

  logger.info('Socket.IO server initialized on /notifications namespace');
  return io;
};

/**
 * Sends a real-time notification to a specific user via Socket.IO.
 * If the user is not connected, the notification is silently skipped
 * (it will still be persisted in the database for later retrieval).
 */
export const emitToUser = (userId: string, payload: NotificationPayload): boolean => {
  const sockets = userSocketMap.get(userId);

  if (!sockets || sockets.size === 0) {
    logger.debug('User not connected via socket — skipping real-time emit', { userId });
    return false;
  }

  for (const socketId of sockets) {
    notificationsNamespace.to(socketId).emit('notification', payload);
  }

  logger.info('Real-time notification sent', {
    userId,
    type: payload.type,
    socketCount: sockets.size,
  });

  return true;
};

/**
 * Returns the number of currently connected unique users.
 */
export const getConnectedUserCount = (): number => {
  return userSocketMap.size;
};

/**
 * Returns the Socket.IO server instance.
 */
export const getIO = (): Server => {
  return io;
};
