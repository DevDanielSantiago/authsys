import mongoose from 'mongoose';
import {
  CreateUserDto,
  UserResponseDto,
} from '../use_cases/dtos/users/CreateUserDto';

export interface IUserService {
  createUser(
    userData: CreateUserDto,
    session: mongoose.mongo.ClientSession
  ): Promise<UserResponseDto>;
}
