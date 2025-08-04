 
import { Request, Response, NextFunction } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import * as jwt from 'jsonwebtoken';
import redis from './redis';


const tokenCheck = async(authHeader:string)=>{

    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return { message: 'Unauthorized' , status:false };

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret');
      if(!decoded){
        return { message: 'Unauthorized Acess' , status:false };
      }
   
      const expired = await redis.get(`auth:token:${decoded['id']}`);
      if (!expired) {
        return { message: 'Token Blacklisted' , status:false };
      }

      return {status : true , decoded}

    } catch (err) {
      console.log(err);
      return { message: 'Forbidden' , status:false };
    }

}


export  function createGuardedProxy(target: string, routePrefix: string, checkToken:boolean , methodTocheckIfnoToken:string) {
  return async(req: Request, res: Response, next: NextFunction) => {

    if(checkToken ||  (req.originalUrl==methodTocheckIfnoToken)  ){
      const authHeader = req.headers['authorization'];

      let tokenCk = await tokenCheck(authHeader);
      if(!tokenCk?.status){
        return res.status(403).json({ message: tokenCk.message });
      }
    }

    const proxy = createProxyMiddleware({
      target,
      changeOrigin: true,
      
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
