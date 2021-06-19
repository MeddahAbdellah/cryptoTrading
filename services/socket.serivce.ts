import { Server as SocketIoServer, Socket } from "socket.io";
import http from 'http';
import { RequestListener } from "http";
import LoggerService from 'services/logger.service'
const DEFAULT_PORT = 443;

class SocketService {
  private _io: SocketIoServer;
  private _indicatorsList: string[];
  private _expertAdvisorsList: string[];

  public initializeSockets(app: Express.Application): void {
    if(this._io) { 
      LoggerService.warn('SocketIo Server Already Initialized');
      return;
    }
    this._io = this._createSocketIoServer(app);
    this._createIndicatorEndPoint();
    this._createExpertAdvisorsEndpoint();
    LoggerService.log('SocketIo Server Initialized successfully');
  }

  public send(topic: string, data: any): void {
    this._io.of(topic).emit(topic, data);
  }

  public isInitialized(): boolean {
    return !!this._io;
  }

  private _createSocketIoServer(app: Express.Application): SocketIoServer{
    const httpsServer = http.createServer(app as RequestListener);

    return new SocketIoServer(httpsServer, { cors: { origin: "*", methods: ["GET", "POST"] } });
  }
  
  private _createIndicatorEndPoint(): void {
    this._io.of('/indicators').on('connection', (socket: Socket) => {
      socket.emit('indicators', this._indicatorsList);
      socket.on('getList', () => socket.emit('indicators', this._indicatorsList));
    });
  }

  private _createExpertAdvisorsEndpoint(): void {
    this._io.of('/expertAdvisors').on('connection', (socket: Socket) => {
      socket.emit('expertAdvisors', this._expertAdvisorsList);
      socket.on('getList', () => socket.emit('expertAdvisors', this._expertAdvisorsList));
    });
  }
}

const socketService = new SocketService();

export default socketService;