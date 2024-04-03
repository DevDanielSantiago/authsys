import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader)
    return res.status(401).json({ status: 401, errors: { token: 'notProvided' } });

  const parts = authHeader.split(' ');

  if (parts.length !== 2)
    return res.status(401).json({ status: 401, errors: { token: 'error' } });

  const [scheme, token] = parts;

  if (!/^Bearer$/i.test(scheme)) 
    return res.status(401).json({ status: 401, errors: { token: 'malFormatted' } });

  try {
    const publicKey = process.env.PUBLIC_KEY;
    if (!publicKey)
      return res.status(500).json({ status: 500, errors: { server: 'internalServerError' }});
    
    jwt.verify(token, publicKey, { algorithms: ['RS256'] });
    next();
  } catch (error) {
    return res.status(401).json({ status: 401, errors: { token: 'invalid' } });
  }
};
