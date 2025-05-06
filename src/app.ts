import path from 'path';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import morgan from 'morgan';
import { connect, set, disconnect } from 'mongoose';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import {
  NODE_ENV,
  PORT,
  MONGODB_URL,
  LOG_FORMAT,
  ORIGIN,
  CREDENTIALS,
} from '@config';
import { logger, stream } from '@/utils/logger';
import { Routes } from '@interfaces/routes.interface';
import errorMiddleware from '@middlewares/error.middleware';

class App {
  public app: express.Application;
  public env: string;
  public port: string | number;

  constructor(routes) {
    this.app = express();
    this.env = NODE_ENV || 'development';
    this.port = PORT || 8080;

    this.connectToDatabase();
    this.initializeMiddlewares();
    this.initializeRoutes(routes);
    this.initializeSwagger();
    this.initializeErrorHandling();
  }

  public listen() {
    this.app.listen(this.port, () => {});
    logger.info(`=================================`);
    logger.info(`======= ENV: ${this.env} =======`);
    logger.info(`🚀 App listening on the port ${this.port}`);
    logger.info(`=================================`);
  }

  public async closeDatabaseConnection(): Promise<void> {
    try {
      await disconnect();
      console.log('Disconnected from MongoDB');
    } catch (error) {
      console.error('Error closing database connection:', error);
    }
  }

  public getServer() {
    return this.app;
  }

  private async connectToDatabase() {
    if (this.env !== 'production') {
      set('debug', true);
    }

    await connect(MONGODB_URL);
  }

  private initializeMiddlewares() {
    this.app.use(morgan(LOG_FORMAT, { stream }));
    this.app.use(
      cors({
        origin: ORIGIN,
        credentials: CREDENTIALS,
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
      })
    );
    this.app.use(hpp());
    this.app.use(helmet());
    this.app.use(compression());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());

    // Serve the uploads folder as static
    this.app.use(
      '/uploads',
      (req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        next();
      },
      express.static(
        NODE_ENV === 'development'
          ? path.join(process.cwd(), 'uploads')
          : path.join('/opt/render/project/src/uploads')
      )
    );
  }

  private initializeRoutes(routes: Routes[]) {
    routes.forEach((route) => {
      this.app.use('/api/v1', route.router);
    });
  }

  private initializeSwagger() {
    const options = {
      swaggerDefinition: {
        openapi: '3.0.0',
        info: {
          title: 'Cyzygy API docs',
          version: '1.0.0',
          description: 'A Cyzygy backend assessement API docs',
          contact: {
            name: 'Oluwayelu Ifeoluwa',
            email: 'oluwayeluifeoluwa@gmail.com',
          },
        },
        servers: [
          {
            url: 'http://localhost:4000/api/v1',
            description: 'Local server',
          },
          {
            url: 'https://cyzygy-backend-assessment.onrender.com/api/v1',
            description: 'Live server',
          },
        ],
      },
      // apis: ['swagger.yaml'],
      apis: ['./src/routes/**/*.ts'],
    };

    const specs = swaggerJSDoc(options);
    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }
}

export default App;
