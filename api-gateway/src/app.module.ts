import { Module , MiddlewareConsumer, RequestMethod} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { createGuardedProxy } from './guard-proxy.middleware'
import * as dotenv from 'dotenv';
import * as express from 'express'
@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {

  configure(consumer: MiddlewareConsumer) {
    dotenv.config();  
   
    consumer
    .apply(
      express.json(),
      createProxyMiddleware({
        target: process.env.AUTH_SERVICE,
        changeOrigin: true, 
        on: {
              error: (error, req, res, target) => {
                res.end(JSON.stringify({ error: 'Proxy error', details: error.message }));
              },

              proxyReq: (proxyReq, req, res)=>{
                
                if (
                  req['body'] &&
                  Object.keys(req['body']).length &&
                  req.headers['content-type']?.includes('application/json')
                ) {
                  const bodyData = JSON.stringify(req['body']);
                  proxyReq.setHeader('Content-Type', 'application/json');
                  proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
                  proxyReq.write(bodyData);
                  proxyReq.end();
                }
              }

          }    
      }),
      
    )
    .forRoutes({ path: '/auth/*', method: RequestMethod.ALL });
    consumer
      .apply(createGuardedProxy(process.env.DOCUMENT_SERVICE, '/documents'))
      .forRoutes({ path: '/documents/*', method: RequestMethod.ALL });

    consumer
      .apply(createGuardedProxy(process.env.USER_SERVICE, '/user'))
      .forRoutes({ path: '/user/*', method: RequestMethod.ALL });
  }
 


}
