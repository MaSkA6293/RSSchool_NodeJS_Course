import { WebSocketServer } from 'ws';

const WS_PORT = 8080;

const wss = new WebSocketServer({ port: WS_PORT });

export default wss;
