import { Role, Status } from '@/interfaces/type';
import { model, Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: Role;
  profilePhoto?: string;
  status: string;
}
const userSchema = new Schema<IUser>(
  {
    name: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: Object.values(Role), default: Role.USER },
    status: {
      type: String,
      enum: Object.values(Status),
      default: Status.ACTIVE,
    },
    profilePhoto: { type: String },
  },
  { timestamps: true }
);

const User = model<IUser>('User', userSchema);

export default User;
