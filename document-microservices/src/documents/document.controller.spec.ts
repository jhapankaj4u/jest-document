import { Test, TestingModule } from '@nestjs/testing';
import { DocumentsController } from './documents.controller';
import { DocumentsService } from './documents.service';
import { InternalServerErrorException } from '@nestjs/common';
describe('DocumentsController', () => {
    let controller: DocumentsController;
    let service: DocumentsService;
  
    const mockDocumentsService = {
      findAll: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };


    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
          controllers: [DocumentsController],
          providers: [
            {
              provide: DocumentsService,
              useValue: mockDocumentsService,
            },
          ],
        }).compile();
    
        controller = module.get<DocumentsController>(DocumentsController);
        service = module.get<DocumentsService>(DocumentsService);
      });


      describe('should upload', () => {
            const mockFile = {
            originalname: 'test.pdf',
            filename: 'file-123.pdf',
            path: './uploads/file-123.pdf',
            mimetype: 'application/pdf',
            } as Express.Multer.File;
        
            it('should upload file successfully', async () => {
            mockDocumentsService.create.mockResolvedValue(undefined);
        
            const req = { user: { id: 5 } } as any;
        
            const res = await controller.upload(mockFile, 'My Title', req);
        
            expect(mockDocumentsService.create).toHaveBeenCalledWith('My Title', mockFile, 5);
            expect(res).toEqual({ message: 'File has been uploaded successfully' });
            });

        });



        describe('should update file', () => {
            const mockFile = {
              originalname: 'test.pdf',
              filename: 'file-123.pdf',
              path: './uploads/file-123.pdf',
              mimetype: 'application/pdf',
            } as Express.Multer.File;
        
            it('should update file successfully', async () => {
              mockDocumentsService.update.mockResolvedValue(undefined);
              const res = await controller.update('1', mockFile, 'Updated Title');
              expect(mockDocumentsService.update).toHaveBeenCalledWith(1, 'Updated Title', mockFile);
              expect(res).toEqual({ message: 'File has been uploaded successfully' });
            });

        })   
        
        

        describe('should delete', () => {
            it('should delete file successfully', async () => {
              mockDocumentsService.delete.mockResolvedValue(undefined);
              const res = await controller.delete(1);
              expect(mockDocumentsService.delete).toHaveBeenCalledWith(1);
              expect(res).toEqual({ message: 'File has been deleted successfully' });
            });
        
            it('should throw if delete fails', async () => {
              mockDocumentsService.delete.mockRejectedValue(new Error('Fail'));
              await expect(controller.delete(1)).rejects.toThrow(InternalServerErrorException);
            });

        })
        
        describe('should getAll', () => {
            it('should return all documents', async () => {
              const docs = [{ id: 1, title: 'Doc1' }];
              mockDocumentsService.findAll.mockResolvedValue(docs);
              expect(await controller.getAll({} as any)).toEqual(docs);
            });
          });


          describe('getOne', () => {
            it('should return one document', async () => {
              const doc = { id: 1, title: 'Doc1' };
              mockDocumentsService.findOne.mockResolvedValue(doc);
              expect(await controller.getOne(1)).toEqual(doc);
            });
          });

    })