import mongoose from 'mongoose';
import { UserResponseDto } from '../use_cases/dtos/users/CreateUserDto';

export interface IUserAuditLogService {
  createUserLog(
    newUser: UserResponseDto,
    session: mongoose.mongo.ClientSession
  ): Promise<void>;
}
