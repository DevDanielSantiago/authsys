import { Document, Types } from 'mongoose';
import { IRole } from '../models/Role';

type ResponseData =
  | (Document<unknown, {}, IRole> &
      IRole & {
        _id: Types.ObjectId;
      })
  | (Document<unknown, {}, IRole> &
      IRole & {
        _id: Types.ObjectId;
      })[];

const formatRoleResponse = (data: ResponseData) => {
  if (Array.isArray(data)) {
    return data.map(item => ({
      _id: item._id,
      name: item.name,
      permissions: item.permissions.map(permission => ({
        _id: permission._id,
        name: permission.name,
        description: permission.description,
      })),
    }));
  }

  return {
    _id: data._id,
    name: data.name,
    permissions: data.permissions,
  };
};

export default formatRoleResponse;
