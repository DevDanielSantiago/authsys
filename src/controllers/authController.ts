import { Request, Response } from 'express';

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import dotenv from 'dotenv';

import { handleError } from '../utils/errorHandler';
import { validateAllowedFields } from '../utils/validateFields';

import User from '../models/User';

import formatUserResponse from '../helpers/userResponseHelper';

dotenv.config();

export const loginUser = async (req: Request, res: Response) => {
  const privateKey = process.env.PRIVATE_KEY;
  if (!privateKey)
    return res.status(500).json({ status: 500, errors: { server: 'internalServerError' }});
  
  try {
    const user = await User.findOne({ email: req.body.email }).exec();
    
    if (user && await bcrypt.compare(req.body.password, user.password)) {
      const token = jwt.sign({ userId: user._id }, privateKey, { algorithm: 'RS256', expiresIn: '24h' });
      res.status(200).json({ username: user.username, email: user.email, token });
    } else {
      res.status(401).json({ status: 401, errors: { server: 'unauthorized'} });
    }
  } catch (error) {
    handleError(error as Error, res);
  }
}

export const updateRole = async (req: Request, res: Response) => {
  try {
    const allowedFields = ['roles'];
    const errors = validateAllowedFields(Object.keys(req.body), allowedFields);
    
    if (Object.keys(errors).length)
      return res.status(400).json({ errors });

    const authHeader = req.headers.authorization;

    if (!authHeader)
      return res.status(401).json({ status: 401, errors: { token: 'notProvided' } });

    const token = authHeader.split(' ')[1];
    const publicKey = process.env.PUBLIC_KEY;
    if (!publicKey)
      return res.status(500).json({ status: 500, errors: { server: 'internalServerError' }});
    
    const decoded: any = jwt.verify(token, publicKey, { algorithms: ['RS256'] });
    const userMakingRequest = await User.findById(decoded.userId);
    const userToUpdate = await User.findById(req.params.id);

    if (!userMakingRequest || !userToUpdate)
      return res.status(404).json({ status: 404, erros: { user: 'notFound' } })

    if (userMakingRequest.roles.includes('admin')) {
      if (userMakingRequest.id === userToUpdate.id || req.body.roles.includes('superAdmin')) {
        return res.status(403).json({ errors: { roles: 'operationNotAllowed' } });
      }
    }
  
    if (userMakingRequest.roles.includes('superAdmin')) {
      if (userMakingRequest.id === userToUpdate.id && !req.body.roles.includes('superAdmin')) {
        return res.status(403).json({ errors: { roles: 'cannotRemoveSuperAdmin' } });
      }
    } else {
      if (userToUpdate.roles.includes('superAdmin')) {
        return res.status(403).json({ errors: { roles: 'cannotEditSuperAdmin' } });
      }
    }
    
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    
    if (!user) return res.status(404).send({ status: 400, errors: { user: 'notFound'} });   
    res.status(200).send(formatUserResponse(user));
  } catch (error) {
    handleError(error as Error, res);
  }
}