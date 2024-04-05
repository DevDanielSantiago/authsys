import mongoose, { Schema } from 'mongoose';
import mongooseDelete, { SoftDeleteDocument, SoftDeleteModel } from 'mongoose-delete';

import bcrypt from 'bcrypt';
import validator from 'validator';
import { v4 as uuidv4 } from 'uuid';

import Role, { IRole } from './Role';

export interface IUser extends SoftDeleteDocument {
  username: string;
  email: string;
  password: string;
  role: IRole;
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
  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role',
    required: true,
  },
}, { timestamps: true });

userSchema.set('autoIndex', true);
userSchema.plugin(mongooseDelete, { indexFields: 'all', overrideMethods: 'all' });

userSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);

    const roleId = this.role;
    const roleExists = await Role.findById(roleId);

    if (!roleExists)
      return next(new Error('Uma ou mais roles são inválidas.'));

    next();
  } catch (error) {
    next(error as Error);
  }
});

const User: IUserModel = mongoose.model<IUser, IUserModel>('User', userSchema);
export default User;