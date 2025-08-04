export interface JwtPayload {
    sub: string;            // user ID
    email: string;
    role: 'admin' | 'editor' | 'viewer';  // or whatever roles you use
    iat?: number;
    exp?: number;
  }