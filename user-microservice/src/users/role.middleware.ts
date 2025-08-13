import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class RoleMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  use(req: Request, res: Response, next: NextFunction) {
  
    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Missing token' });
    }

    try {
      const decoded: any = this.jwtService.verify(token,{ secret :  process.env.JWT_SECRET || 'default_secret'});
      const allowedRoles = ['admin'] ; 
       
 
      if (!allowedRoles.includes(decoded.role)) {
        return res.status(403).json({ message: 'Forbidden: Insufficient role' });
      }
      (req as any).user = decoded;
      console.log(req.user,'------',decoded)

      next();
    } catch (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }
  }
}
