import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { CreateRatingDto } from './dto/create-rating.dto';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { RatingService } from './ratings.service';

@Controller('ratings')
export class RatingController {
  constructor(private readonly ratingService: RatingService) {}

  @UseGuards(AuthGuard)
  @Post('rate')
  async rate(@Req() req: any, @Body() dto: CreateRatingDto) {
    return await this.ratingService.rate(req.user.sub, dto);
  }
}
