import { Module } from '@nestjs/common';
import { CommentController } from './comments.controller';
import { CommentService } from './comments.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentSchema } from './entities/comment.schema';
import { RatingSchema } from 'src/ratings/entities/rating.schema';

@Module({  
  imports: [
    MongooseModule.forFeature([
      { name: 'Comment', schema: CommentSchema },
      { name: 'Rating', schema: RatingSchema },
    ]),
  ],
  controllers: [CommentController],
  providers: [CommentService]
})
export class CommentsModule {}
