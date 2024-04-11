import mongoose from 'mongoose';

import UserAuditLog from '../../../models/UserAuditLog';

import { IUserAuditLogService } from '../../../interfaces/IUserAuditLogService';

import { UserResponseDto } from '../../dtos/users/CreateUserDto';

export class AuditLogService implements IUserAuditLogService {
  async createUserLog(
    newUser: UserResponseDto,
    session: mongoose.mongo.ClientSession
  ) {
    const log = new UserAuditLog({
      userId: newUser._id,
      action: 'CREATE',
      changes: { newUser },
      changedBy: 'SYSTEM',
      changedAt: new Date(),
    });
    await log.save({ session });
  }
}
