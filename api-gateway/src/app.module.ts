import { Module , MiddlewareConsumer, RequestMethod} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { createGuardedProxy } from './guard-proxy.middleware'

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {

  configure(consumer: MiddlewareConsumer) {
    consumer
    .apply(
      createProxyMiddleware({
        target: process.env.AUTH_SERVICE,
        changeOrigin: true,
        pathRewrite: { '^/auth': '' },
      }),
    )
    .forRoutes({ path: '/auth/*', method: RequestMethod.ALL });
    consumer
      .apply(createGuardedProxy(process.env.DOCUMENT_SERVICE, '/document'))
      .forRoutes({ path: '/document/*', method: RequestMethod.ALL });

    consumer
      .apply(createGuardedProxy(process.env.USER_SERVICE, '/user'))
      .forRoutes({ path: '/user/*', method: RequestMethod.ALL });
  }
 


}
