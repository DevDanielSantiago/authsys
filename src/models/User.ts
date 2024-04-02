import mongoose, { Schema, Document } from 'mongoose';
import mongooseDelete, { SoftDeleteDocument, SoftDeleteModel } from 'mongoose-delete';

import validator from 'validator';
import { v4 as uuidv4 } from 'uuid';

export interface IUser extends SoftDeleteDocument {
  username: string;
  email: string;
  password: string;
}

interface IUserModel extends SoftDeleteModel<IUser> {}

const userSchema: Schema = new Schema({
  _id: { 
    type: String,
    default: uuidv4 
  },
  username: {
    type: String,
    required: [true, 'required'],
    trim: true,
    unique: true,
    minlength: [3, 'minlength'],
    maxLength: [20, 'maxLength'],
  },
  email: {
    type: String,
    required: [true, 'required'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'email']
  },
  password: {
    type: String,
    required: [true, 'required'],
    minlength: [8, 'minlength'],
    trim: true,
    validate: {
      validator: function(value: string) {
        if (!/[A-Z]/.test(value)) {
          throw new Error('minUppercase');
        }
        if (!/[a-z]/.test(value)) {
          throw new Error('minLowercase');
        }
        if (!/\d/.test(value)) {
          throw new Error('minNumber');
        }
        if (!/[^A-Za-z0-9]/.test(value)) {
          throw new Error('minSpecialCharacter');
        }
        return true;
      },
    }
  },
}, { timestamps: true });

userSchema.set('autoIndex', true);
userSchema.plugin(mongooseDelete, { indexFields: 'all', overrideMethods: 'all' });

const User: IUserModel = mongoose.model<IUser, IUserModel>('User', userSchema);
export default User;