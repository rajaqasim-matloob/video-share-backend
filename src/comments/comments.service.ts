import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel('Comment') private commentModel: Model<any>,
  ) {}

  async create(userId: string, dto: CreateCommentDto) {
    const comment = new this.commentModel({ ...dto, userId });
    return await comment.save();
  }

  async getByVideo(videoId: string) {
    return await this.commentModel
      .find({ videoId })
      .populate('userId', 'name email') // Customize as needed
      .sort({ createdAt: -1 })
      .exec();
  }
}
