import { Module , MiddlewareConsumer, RequestMethod} from '@nestjs/common';
import { createGuardedProxy } from './guard-proxy.middleware'
import * as dotenv from 'dotenv';
import * as express from 'express'
@Module({
  imports: [],
  controllers: [],
  providers: [],
})
export class AppModule {

  configure(consumer: MiddlewareConsumer) {
    dotenv.config();  
   
    consumer
    .apply(
      express.json(),
      createGuardedProxy(process.env.AUTH_SERVICE,'/auth',false,'/auth/logout'))
      .forRoutes({ path: '/auth/*', method: RequestMethod.ALL });
    consumer
      .apply(createGuardedProxy(process.env.DOCUMENT_SERVICE, '/documents',true,''))
      .forRoutes({ path: '/documents/*', method: RequestMethod.ALL });

    consumer
      .apply(createGuardedProxy(process.env.USER_SERVICE, '/user',true,''))
      .forRoutes({ path: '/user/*', method: RequestMethod.ALL });
  }
 


}
