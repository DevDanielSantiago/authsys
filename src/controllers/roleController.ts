import { Request, Response } from 'express';

import { handleError } from '../utils/errorHandler';
import { validateAllowedFields } from '../utils/validateFields';

import Role from '../models/Role';
import Permission from '../models/Permission';

import formatRoleResponse from '../helpers/roleResponseHelper';
import User from '../models/User';

export const createRole = async (req: Request, res: Response) => {
  const allowedFields = ['name', 'permissions'];
  const errors = validateAllowedFields(Object.keys(req.body), allowedFields);
  
  if (Object.keys(errors).length)
    return res.status(400).json({ status: 400, errors });

  try {
    const { name, permissions } = req.body;

    for (let i = 0; i < permissions.length; i++) {
      const permissionExists = await Permission.findById(permissions[i]);
      if (!permissionExists) {
        return res.status(404).json({ message: `Permissão com ID ${permissions[i]} não encontrada.` });
      }
    }

    const newRole = new Role({ name, permissions });
    const savedRole = await newRole.save();

    res.status(201).json(formatRoleResponse(savedRole));
  } catch (error) {
    handleError(error as Error, res);
  }
}

export const listRoles = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.headers.page as string) || 1;
    const limit = parseInt(req.headers.limit as string) || 10;

    const filterString = req.headers.filter;
    let filter: Record<string, any> = {};

    try {
      if (filterString) filter = JSON.parse(filterString as string);
    } catch (parseError) {
      return res.status(400).send({ status: 400, errors: { filter: 'malFormatted'} });
    }

    const allowedFields = ['name'];
    allowedFields.forEach(field => {
      if (filter[field]) filter[field] = new RegExp(filter[field], 'i');
    });

    const skip = (page - 1) * limit;
    const list = await Role.find(filter, '-__v').populate({
      path: 'permissions'
    }).skip(skip).limit(limit);
    const total = await Role.countDocuments(filter);

    res.json({ total, list: formatRoleResponse(list) });
  } catch (error) {
    handleError(error as Error, res);
  }
}

export const updateRole = async (req: Request, res: Response) => {
  const allowedFields = ['name', 'permissions'];
  const errors = validateAllowedFields(Object.keys(req.body), allowedFields);
  
  if (Object.keys(errors).length)
    return res.status(400).json({ errors });
  
  try {
    const role = await Role.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!role) return res.status(404).send({ status: 400, errors: { user: 'notFound'} });   

    res.status(200).send(formatRoleResponse(role));
  } catch (error) {
    handleError(error as Error, res);
  }
}

export const deleteRole = async (req: Request, res: Response) => {
  try {
    const isRoleUsed = await User.findOne({ role: req.params.id });

    if (isRoleUsed)
      return res.status(403).json({ errors: { role: 'Role is in use' } });

    const permission = await Role.findByIdAndUpdate(req.params.id, { 
      deleted: true, deletedAt: new Date() 
    }, { new: true });

    if (!permission) return res.status(404).send({ status: 400, errors: { user: 'notFound'} })

    res.status(200).send(formatRoleResponse(permission));
  } catch (error) {
    handleError(error as Error, res);
  }
}

export const restoreRole = async (req: Request, res: Response) => {
  try {
    const roleId = req.params.id;
    const role = await Role.restore({ _id: roleId });
    
    if (!role)
      return res.status(404).send({ status: 400, errors: { user: 'notFound'} });
    
    res.status(200).send(role);
  } catch (error) {
    handleError(error as Error, res);
  }
}