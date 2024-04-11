import mongoose, { Schema, Document } from 'mongoose';

interface IUserAuditLog extends Document {
  userId: string;
  action: string;
  changes: any;
  changedBy: string;
  changedAt: Date;
}

const userAuditLogSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  action: {
    type: String,
    required: true,
    enum: ['CREATE', 'UPDATE', 'DELETE'],
  },
  changes: mongoose.Schema.Types.Mixed,
  changedBy: {
    type: String,
    required: true,
  },
  changedAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

const UserAuditLog = mongoose.model<IUserAuditLog>(
  'UserAuditLog',
  userAuditLogSchema
);

export default UserAuditLog;
