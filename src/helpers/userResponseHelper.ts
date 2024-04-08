import { Document, Types } from 'mongoose';
import { IUser } from '../models/User';

type ResponseData =
  | (Document<unknown, {}, IUser> &
      IUser & {
        _id: Types.ObjectId;
      })
  | (Document<unknown, {}, IUser> &
      IUser & {
        _id: Types.ObjectId;
      })[];

const formatUserResponse = (data: ResponseData) => {
  if (Array.isArray(data)) {
    return data.map(item => ({
      _id: item._id,
      username: item.username,
      email: item.email,
      role: item.role.name,
    }));
  }

  return {
    _id: data._id,
    username: data.username,
    email: data.email,
    role: data.role.name,
  };
};

export default formatUserResponse;
