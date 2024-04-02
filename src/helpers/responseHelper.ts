import { Document, Types } from "mongoose";
import { IUser } from "../models/User";

type ResponseData = (Document<unknown, {}, IUser> & IUser & {
    _id: Types.ObjectId;
}) | (Document<unknown, {}, IUser> & IUser & {
    _id: Types.ObjectId;
})[] 

const formatResponse = (data: ResponseData) => {
  if (Array.isArray(data)) {
    return data.map((item) => ({
      _id: item._id,
      username: item.username,
      email: item.email,
    }));
  }

  return {
    _id: data._id,
    username: data.username,
    email: data.email,
  };
};

export default formatResponse