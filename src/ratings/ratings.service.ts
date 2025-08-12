import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateRatingDto } from './dto/create-rating.dto';

@Injectable()
export class RatingService {
  constructor(
    @InjectModel('Rating') private ratingModel: Model<any>,
    @InjectModel('Video') private videoModel: Model<any>,
  ) {}

    async rate(userId: string, dto: CreateRatingDto) {
        const existing = await this.ratingModel.findOne({ userId, videoId: dto.videoId });
        console.log(existing)
        if (existing) {
            existing.rating = dto.rating;
            await existing.save();
        } else {
            await new this.ratingModel({ ...dto, userId }).save();
        }

        // Update avg rating on video
        const ratings = await this.ratingModel.find({ videoId: dto.videoId });
        const average = ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;

        await this.videoModel.findByIdAndUpdate(dto.videoId, { rating: average.toFixed(1) });

        return { success: true, average: average.toFixed(1) };
    }
}
