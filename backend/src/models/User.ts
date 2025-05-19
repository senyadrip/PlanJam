import mongoose, { Schema, Document, Types } from "mongoose";

export interface IUser extends Document {
  name: string;
}

const UserSchema: Schema<IUser> = new Schema({
  name: { type: String, required: true },
});

const User = mongoose.model<IUser>("User", UserSchema);

export default User;
