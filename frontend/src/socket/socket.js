import { io } from 'socket.io-client';
import { SOCKET_URL } from '../utils/constants';

// Auto-connect set to false initially, we can connect after auth or on component mount
export const socket = io(SOCKET_URL, {
    autoConnect: false,
});
