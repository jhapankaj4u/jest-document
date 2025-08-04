import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UploadedFile,
  UseInterceptors,
  Req,
  InternalServerErrorException
} from '@nestjs/common';

import { Request } from 'express';

import { FileInterceptor } from '@nestjs/platform-express';

import { diskStorage } from 'multer';
import { extname } from 'path';
import { DocumentsService } from './documents.service';

@Controller('documents')
export class DocumentsController {
  constructor(private readonly docService: DocumentsService) {}

  @Get()
  getAll(@Req() req: Request) {
    return this.docService.findAll();
  }

  @Get(':id')
  getOne(@Param('id') id: number) {
    return this.docService.findOne(id);
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const unique = Date.now();
          cb(null, `${file.fieldname}-${unique}${extname(file.originalname)}`);
        },
      }),
    }),
  )

  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Body('title') title: string,
    @Req() req: Request
  ) {
  
    const userId= (req as any).user.id;    
    try{
      await this.docService.create(title, file, userId);
    }catch(err){
      throw new InternalServerErrorException('Unable to upload file');
    }
     return { message:"File has been uploaded successfully" }
  }

  @Put(':id')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const unique = Date.now();
          cb(null, `${file.fieldname}-${unique}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async update(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body('title') title: string
  ) {
    try{
      await this.docService.update(+id, title, file);
    }catch(err){
      throw new InternalServerErrorException('Unable to upload file');
    }
     return { message:"File has been uploaded successfully" }
   }



  @Delete(':id')
  async delete(@Param('id') id: number) {
    try{
      await this.docService.delete(id);
    }catch(err){
      throw new InternalServerErrorException('Unable to delete file');
    }
     return { message:"File has been deleted successfully" }
   }
}
