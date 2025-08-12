import { Schema, Types } from 'mongoose';

export const CommentSchema = new Schema({
  videoId: { type: Types.ObjectId, ref: 'Video', required: true },
  userId: { type: Types.ObjectId, ref: 'User', required: true },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});
