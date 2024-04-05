import mongoose, { Schema } from 'mongoose';
import mongooseDelete, { SoftDeleteDocument, SoftDeleteModel } from 'mongoose-delete';

import { IPermission } from './Permission';

import { v4 as uuidv4 } from 'uuid';

export interface IRole extends SoftDeleteDocument {
  name: string;
  permissions: IPermission[];
}

interface IRoleModel extends SoftDeleteModel<IPermission> {}

const roleSchema: Schema = new Schema({
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
  permissions: [{
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Permission'
  }]
});

roleSchema.set('autoIndex', true);
roleSchema.plugin(mongooseDelete, { indexFields: 'all', overrideMethods: 'all' });

const Role: IRoleModel = mongoose.model<IRole, IRoleModel>('Role', roleSchema);

export default Role;