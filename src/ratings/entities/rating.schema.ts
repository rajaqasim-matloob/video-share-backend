import { Schema, Types } from 'mongoose';

export const RatingSchema = new Schema({
  videoId: { type: Types.ObjectId, ref: 'Video', required: true },
  userId: { type: Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  createdAt: { type: Date, default: Date.now },
});
