import { Request, Response, NextFunction } from 'express';
import { createGuardedProxy } from './guard-proxy.middleware';
jest.mock('jsonwebtoken');
jest.mock('./redis');

  const mockRequest = (headers = {}, body = {}, originalUrl = '/auth') =>
    ({
      headers,
      body,
      originalUrl,
    });

    const mockResponse = () => {
        const res = {} as Response;
        res.status = jest.fn().mockReturnValue(res);
        res.json = jest.fn().mockReturnValue(res);       
        return res;
    }; 


  describe('createGuardedProxy', () => {
    const next = jest.fn();
  
  
    it('should return 403 if no token is present', async () => {
      const req:any = mockRequest();
      const res = mockResponse();
  
      const middleware = await createGuardedProxy('http://localhost:3001', '/auth', true, '');
      await middleware(req, res, next);
  
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized' });
    });

  })    