import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { rateLimit } from 'express-rate-limit';
import * as dotenv from 'dotenv';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import LokiTransport from 'winston-loki'; 

async function bootstrap() {
  dotenv.config();

  const logger = WinstonModule.createLogger({
    transports: [
      
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.timestamp(),
          winston.format.printf(({ timestamp, level, message }) => {
            return `[${timestamp}] ${level}: ${message}`;
          }),
        ),
      }),

   
      new LokiTransport({
        host: process.env.LOKI_URL,
        labels: { app: 'nestjs-gateway'},
        json: true,
        batching: true,
        interval: 5, 
      }),
    ],
  });


  const app = await NestFactory.create(AppModule,{logger});
   
  app.use(
    rateLimit({
      windowMs: 1 * 60 * 1000, 
      max: 100,  
    }),
  );

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Authorization',
  })

  await app.listen(process.env.API_GATEWAY_PORT ?? 3000);
}
bootstrap();
