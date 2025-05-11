import mongoose, { Schema, Document, Types } from "mongoose";

export interface IJamOption extends Document {
  option: string;
  votes: Types.ObjectId[];
}

export interface IJam extends Document {
  name: string;
  notes?: string;
  date: Date;
  time?: string;
  location?: string;
  guests: Types.ObjectId[];
  createdBy: Types.ObjectId;
  options: IJamOption[];
}

const JamOptionSchema: Schema<IJamOption> = new Schema({
  option: { type: String, required: true },
  votes: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

const JamSchema: Schema<IJam> = new Schema({
  name: { type: String, required: true },
  notes: { type: String },
  date: { type: Date, required: true },
  time: { type: String },
  location: { type: String },
  guests: [{ type: Schema.Types.ObjectId, ref: "User" }],
  createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  options: [JamOptionSchema],
});

const Jam = mongoose.model<IJam>("Jam", JamSchema);
export default Jam;