import { Module , MiddlewareConsumer ,RequestMethod} from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Document } from './document.model';
import { DocumentsController } from './documents.controller';
import { DocumentsService } from './documents.service';
import {  DocumentMiddleware } from './document.middleware';
import { JwtService } from '@nestjs/jwt';
import { JwtModule } from '@nestjs/jwt'; 

@Module({
  imports: [
   
    SequelizeModule.forFeature([Document])   
  ],
  controllers: [DocumentsController],
  providers: [DocumentsService, DocumentMiddleware, JwtService],
})
export class DocumentsModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(DocumentMiddleware)    
      .forRoutes('*');
    };
}
