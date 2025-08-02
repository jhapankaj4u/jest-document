 
import { Request, Response, NextFunction } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import * as jwt from 'jsonwebtoken';

export function createGuardedProxy(target: string, routePrefix: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret');
      req.user = decoded;  
    } catch (err) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const proxy = createProxyMiddleware({
      target,
      changeOrigin: true,
      pathRewrite: {
        [`^${routePrefix}`]: '',
      },
      on: {
          error: (error, req, res) => {
            console.error(`Proxy error for ${target}:`, error.message);          
            res.end(JSON.stringify({ error: 'Proxy error', details: error.message }));
          },
          proxyReq: (proxyReq, req, res) => {
            if (
              req['body'] &&
              Object.keys(req['body']).length &&
              req.headers['content-type']?.includes('application/json')
            ) {
              const bodyData = JSON.stringify(req['body']);
              proxyReq.setHeader('Content-Type', 'application/json');
              proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
              proxyReq.write(bodyData);
            }
          }
       }
    });

    return proxy(req, res, next);
  };
}
