import { Request, Response } from 'express';

import { handleError } from '../utils/errorHandler';
import { validateAllowedFields } from '../utils/validateFields';

import Permission from '../models/Permission';

import formatPermissionResponse from '../helpers/permissionResponseHelper';
import Role from '../models/Role';

export const createPermission = async (req: Request, res: Response) => {
  const allowedFields = ['name', 'description'];
  const errors = validateAllowedFields(Object.keys(req.body), allowedFields);

  if (Object.keys(errors).length)
    return res.status(400).json({ status: 400, errors });

  try {
    const permission = new Permission(req.body);
    await permission.save();

    res.status(201).send(formatPermissionResponse(permission));
  } catch (error) {
    handleError(error as Error, res);
  }
};

export const listPermissions = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.headers.page as string) || 1;
    const limit = parseInt(req.headers.limit as string) || 10;

    const filterString = req.headers.filter;
    let filter: Record<string, any> = {};

    try {
      if (filterString) filter = JSON.parse(filterString as string);
    } catch (parseError) {
      return res
        .status(400)
        .send({ status: 400, errors: { filter: 'malFormatted' } });
    }

    const allowedFields = ['name'];
    allowedFields.forEach(field => {
      if (filter[field]) filter[field] = new RegExp(filter[field], 'i');
    });

    const skip = (page - 1) * limit;
    const list = await Permission.find(filter, '-__v').skip(skip).limit(limit);
    const total = await Permission.countDocuments(filter);

    res.json({ total, list: formatPermissionResponse(list) });
  } catch (error) {
    handleError(error as Error, res);
  }
};

export const updatePermission = async (req: Request, res: Response) => {
  const allowedFields = ['name', 'description'];
  const errors = validateAllowedFields(Object.keys(req.body), allowedFields);

  if (Object.keys(errors).length) return res.status(400).json({ errors });

  try {
    const permission = await Permission.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!permission)
      return res
        .status(404)
        .send({ status: 400, errors: { user: 'notFound' } });

    res.status(200).send(formatPermissionResponse(permission));
  } catch (error) {
    handleError(error as Error, res);
  }
};

export const deletePermission = async (req: Request, res: Response) => {
  try {
    const isPermissionUsed = await Role.findOne({ permissions: req.params.id });

    if (isPermissionUsed)
      return res
        .status(403)
        .json({ errors: { permission: 'Permission is in use' } });

    const permission = await Permission.findByIdAndUpdate(
      req.params.id,
      {
        deleted: true,
        deletedAt: new Date(),
      },
      { new: true }
    );

    if (!permission)
      return res
        .status(404)
        .send({ status: 400, errors: { user: 'notFound' } });

    res.status(200).send(formatPermissionResponse(permission));
  } catch (error) {
    handleError(error as Error, res);
  }
};

export const restorePermission = async (req: Request, res: Response) => {
  try {
    const permissionId = req.params.id;
    const permission = await Permission.restore({ _id: permissionId });

    if (!permission)
      return res
        .status(404)
        .send({ status: 400, errors: { user: 'notFound' } });

    res.status(200).send(permission);
  } catch (error) {
    handleError(error as Error, res);
  }
};
