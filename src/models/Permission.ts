import mongoose, { Schema } from 'mongoose';
import mongooseDelete, { SoftDeleteDocument, SoftDeleteModel } from 'mongoose-delete';

import { v4 as uuidv4 } from 'uuid';

export interface IPermission extends SoftDeleteDocument {
  name: string;
  description: string;
}

interface IPermissionModel extends SoftDeleteModel<IPermission> {}

const permissionSchema: Schema = new Schema({
  _id: { 
    type: String,
    default: uuidv4 
  },
  name: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true,
    minlength: [3, 'minlength'],
    maxLength: [20, 'maxLength'],
  },
    description: { 
    type: String, 
    required: true,
    trim: true,
    minlength: [10, 'minlength'],
    maxLength: [100, 'maxLength'],
  },
});

permissionSchema.set('autoIndex', true);
permissionSchema.plugin(mongooseDelete, { indexFields: 'all', overrideMethods: 'all' });

const Permission: IPermissionModel = mongoose.model<IPermission, IPermissionModel>('Permission', permissionSchema);

export default Permission;
