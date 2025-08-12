// src/modules/videos/videos.module.ts
import { Module } from '@nestjs/common';
import { VideosController } from './videos.controller';
import { VideosService} from './videos.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Video } from './entities/video.schema';
import { VideoSchema } from './entities/video.schema';
import { CommentSchema } from 'src/comments/entities/comment.schema';
import { RatingSchema } from 'src/ratings/entities/rating.schema';
import { UserSchema } from 'src/users/entities/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Video.name, schema: VideoSchema }, 
      { name: 'Comment', schema: CommentSchema }, 
      { name: 'Rating', schema: RatingSchema },
      { name: 'User', schema: UserSchema
       },
    ]),
  ],
  controllers: [VideosController],
  providers: [VideosService],
})
export class VideosModule {}