import { Request, Response } from 'express';

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import dotenv from 'dotenv';

import { handleError } from '../utils/errorHandler';
import { validateAllowedFields } from '../utils/validateFields';

import User from '../models/User';
import Role from '../models/Role';

import formatUserResponse from '../helpers/userResponseHelper';

dotenv.config();

export const loginUser = async (req: Request, res: Response) => {
  const privateKey = process.env.PRIVATE_KEY;
  if (!privateKey)
    return res.status(500).json({
      status: 500,
      message: 'Internal server error. Please try again later.',
      errors: { server: 'internalServerError' },
    });

  try {
    const user = await User.findOne(
      { email: req.body.email },
      { _id: 1, username: 1, email: 1, password: 1 }
    ).exec();

    if (user && (await bcrypt.compare(req.body.password, user.password))) {
      const token = jwt.sign({ userId: user._id }, privateKey, {
        algorithm: 'RS256',
        expiresIn: '24h',
      });

      const { _id, password, ...data } = user.toObject();
      res.status(200).json({ ...data, token });
    } else {
      res.status(401).json({
        status: 401,
        message: 'Unauthorized access',
        errors: { server: 'unauthorized' },
      });
    }
  } catch (error) {
    handleError(error as Error, res);
  }
};

export const updateRole = async (req: Request, res: Response) => {
  try {
    const allowedFields = ['role'];
    const errors = validateAllowedFields(Object.keys(req.body), allowedFields);

    if (Object.keys(errors).length)
      return res.status(400).json({
        status: 400,
        message: 'One or more fields are not allowed.',
        errors,
      });

    const authHeader = req.headers.authorization;

    if (!authHeader)
      return res.status(401).json({
        status: 401,
        message: 'Token not provided.',
        errors: { token: 'notProvided' },
      });

    const token = authHeader.split(' ')[1];
    const publicKey = process.env.PUBLIC_KEY;
    if (!publicKey)
      return res.status(500).json({
        status: 500,
        message: 'Internal server error. Please try again later.',
        errors: { server: 'internalServerError' },
      });

    const decoded: any = jwt.verify(token, publicKey, {
      algorithms: ['RS256'],
    });
    const userMakingRequest = await User.findById(decoded.userId).populate({
      path: 'role',
    });
    const userToUpdate = await User.findById(req.params.id);

    if (!userMakingRequest || !userToUpdate)
      return res.status(404).json({
        status: 404,
        message: 'User not found.',
        erros: { user: 'notFound' },
      });

    const role = await Role.findById(req.body.role);

    if (!role)
      return res.status(404).send({
        status: 400,
        message: 'Role not found.',
        errors: { role: 'notFound' },
      });

    if (userMakingRequest.role.name === 'admin') {
      if (
        userMakingRequest.id === userToUpdate.id ||
        role.name === 'superAdmin'
      ) {
        return res.status(403).json({
          status: 403,
          message: 'Access denied.',
          errors: { role: 'operationNotAllowed' },
        });
      }
    }

    if (userMakingRequest.role.name === 'superAdmin') {
      if (
        userMakingRequest.id === userToUpdate.id &&
        role.name !== 'superAdmin'
      ) {
        return res.status(403).json({
          status: 403,
          message: 'Operation not allowed',
          errors: { role: 'cannotRemoveSuperAdmin' },
        });
      }
    } else {
      if (userToUpdate.role.name === 'superAdmin') {
        return res.status(403).json({
          status: 403,
          message: 'Operation not allowed',
          errors: { role: 'cannotEditSuperAdmin' },
        });
      }
    }

    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
      populate: { path: 'role' },
      projection: { _id: 1, username: 1, email: 1, role: 1 },
    });

    if (!user)
      return res.status(404).send({
        status: 400,
        message: 'User not found.',
        errors: { user: 'notFound' },
      });
    res.status(200).send(formatUserResponse(user));
  } catch (error) {
    handleError(error as Error, res);
  }
};
