import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import User from '../models/User';

export const roleMiddleware = (requiredRoles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader)
      return res.status(401).json({ status: 401, errors: { token: 'notProvided' } });

    const token = authHeader.split(' ')[1];
    const publicKey = process.env.PUBLIC_KEY;
    if (!publicKey)
      return res.status(500).json({ status: 500, errors: { server: 'internalServerError' }});

    try {
      const decoded: any = jwt.verify(token, publicKey, { algorithms: ['RS256'] });

      const user = await User.findById(decoded.userId);
      if (!user) return res.status(404).json({ status: 404, erros: { user: 'notFound' } });

      const userRoles = user.roles;
      const hasRequiredRole = requiredRoles.some(role => userRoles.includes(role));

      if (!hasRequiredRole)
        return res.status(403).json({ status: 403, errors: { roles: 'forbidden' } });

      next();
    } catch (error) {
      return res.status(401).json({ status: 401, errors: { token: 'invalid' } });
    }
  };
};