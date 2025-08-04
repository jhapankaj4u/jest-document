// documents/documents.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Document } from './document.model';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectModel(Document)
    private documentModel: typeof Document,
  ) {}

  findAll(): Promise<Document[]> {
    return this.documentModel.findAll();
  }

  findOne(id: number): Promise<Document> {
    return this.documentModel.findByPk(id);
  }

  async update(id:number,title:string, file: Express.Multer.File){

    let docs = await this.documentModel.findOne({ where :{ id : id}});
    if(!docs) throw new NotFoundException("Document not found");
    
    docs.title= title;
    docs.filename = file.filename,
    docs.path = file.path
    docs.mimetype = file.mimetype

    return docs.save;

  }

  async create(title: string, file: Express.Multer.File , userId : number): Promise<Document> {
    
    return await this.documentModel.create({
      userid: +userId,
      title,
      filename: file.filename,
      path: file.path,
      mimetype: file.mimetype,
    });
  }

  async delete(id: number): Promise<number> {
    return await this.documentModel.destroy({ where: { id } });
  }
}
