import mongoose from 'mongoose';
import { IUser } from '../../../models/User';

export type CreateUserDto = IUser;
export type UserResponseDto = IUser & { _id: mongoose.Types.ObjectId };
