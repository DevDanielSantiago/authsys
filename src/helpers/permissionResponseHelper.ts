import { Document, Types } from "mongoose";
import { IPermission } from "../models/Permission";

type ResponseData = (Document<unknown, {}, IPermission> & IPermission & {
    _id: Types.ObjectId;
}) | (Document<unknown, {}, IPermission> & IPermission & {
    _id: Types.ObjectId;
})[] 

const formatPermissionResponse = (data: ResponseData) => {
  if (Array.isArray(data)) {
    return data.map((item) => ({
      _id: item._id,
      name: item.name,
      description: item.description
    }));
  }

  return {
    _id: data._id,
    name: data.name,
    description: data.description
  };
};

export default formatPermissionResponse