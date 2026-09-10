import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import * as http from 'http';
import { createPetRouter } from './routes';
import { Logger } from '../utils/Logger';

export class BackendServer {
  private static instance: BackendServer;
  private app: Express;
  private server: http.Server | null = null;
  private port: number = 0;
  private authToken: string = '';

  private constructor() {
    this.app = express();
  }

  public static getInstance(): BackendServer {
    if (!BackendServer.instance) {
      BackendServer.instance = new BackendServer();
    }
    return BackendServer.instance;
  }

  public async start(desiredPort = 0, authToken: string): Promise<number> {
    this.authToken = authToken;
    this.app = express();

    // Middleware setup
    this.app.use(cors({
      origin: true,
      credentials: true
    }));
    this.app.use(express.json({ limit: '1mb' }));

    // Auth Middleware: verifies token header or query param
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      // Health check endpoint is public for probing
      if (req.path === '/api/health' || req.path === '/health') {
        return next();
      }

      const headerToken = req.headers['x-pet-auth-token'] as string;
      const queryToken = req.query.token as string;

      if ((headerToken && headerToken === this.authToken) || (queryToken && queryToken === this.authToken)) {
        return next();
      }

      Logger.warn(`[BackendServer] Unauthorized API request to ${req.path}`);
      return res.status(401).json({
        success: false,
        error: 'Unauthorized: Invalid authentication token',
        timestamp: Date.now()
      });
    });

    // Mount REST API
    this.app.use('/api', createPetRouter());

    // Global Error Handler
    this.app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      Logger.error('Internal API error in BackendServer', err);
      res.status(500).json({
        success: false,
        error: 'Internal server error in pet backend',
        timestamp: Date.now()
      });
    });

    return new Promise((resolve, reject) => {
      try {
        this.server = this.app.listen(desiredPort, '127.0.0.1', () => {
          const addr = this.server?.address();
          if (addr && typeof addr === 'object') {
            this.port = addr.port;
            Logger.info(`VS Code Pet Express server listening on http://127.0.0.1:${this.port}`);
            resolve(this.port);
          } else {
            reject(new Error('Could not obtain server address'));
          }
        });

        this.server.on('error', (err) => {
          Logger.error('Express server encountered an error', err);
          reject(err);
        });
      } catch (err) {
        Logger.error('Failed to start Express server', err);
        reject(err);
      }
    });
  }

  public getPort(): number {
    return this.port;
  }

  public getAuthToken(): string {
    return this.authToken;
  }

  public getBaseUrl(): string {
    return `http://127.0.0.1:${this.port}/api`;
  }

  public async stop(): Promise<void> {
    return new Promise((resolve) => {
      if (this.server) {
        this.server.close(() => {
          Logger.info('VS Code Pet Express server stopped.');
          this.server = null;
          resolve();
        });
      } else {
        resolve();
      }
    });
  }
}
