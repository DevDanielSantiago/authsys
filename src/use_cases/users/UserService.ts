import mongoose from 'mongoose';

import User from '../../models/User';

import { IUserService } from '../../interfaces/IUserService';

import { CreateUserDto, UserResponseDto } from '../dtos/users/CreateUserDto';

export class UserService implements IUserService {
  async createUser(
    data: CreateUserDto,
    session: mongoose.mongo.ClientSession
  ): Promise<UserResponseDto> {
    const user = new User(data);
    await user.save({ session });
    return user.toObject();
  }
}
