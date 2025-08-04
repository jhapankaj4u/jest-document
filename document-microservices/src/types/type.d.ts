
export interface JwtPayload {
  id: string;   
  email: string;
  role: 'admin' | 'editor' | 'viewer';
  iat?: number;
  exp?: number;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}