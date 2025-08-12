import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { CommentService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { AuthGuard } from 'src/shared/guards/auth.guard';

@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @UseGuards(AuthGuard)
  @Post()
  async create(@Req() req: any, @Body() dto: CreateCommentDto) {
    return await this.commentService.create( req.user.sub, dto);
  }

  @Get(':videoId')
  async getByVideo(@Req() req: any) {
    const videoId = req.params['videoId'];
    return await this.commentService.getByVideo(videoId);
  }
}
