import { Module } from '@nestjs/common';
import { RatingController } from './ratings.controller';
import { RatingService } from './ratings.service';
import { RatingSchema } from './entities/rating.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { VideoSchema } from '../videos/entities/video.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Rating', schema: RatingSchema },
      { name: 'Video', schema: VideoSchema },
    ]),
  ],
  controllers: [RatingController],
  providers: [RatingService]
})
export class RatingsModule {}
