// src/modules/videos/videos.controller.ts
import {
  Controller,
  Post,
  UseGuards,
  UploadedFiles,
  UseInterceptors,
  Body,
  Req,
  Get,
  Param,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { Role } from 'src/shared/decorators/role.decorator';
import { UserRole } from 'src/shared/enums/enum';
import { UploadDto } from './dto/upload.dto';
import { VideosService } from './videos.service';

@Controller('videos')
@UseGuards(AuthGuard, RolesGuard)
export class VideosController {
  constructor(private readonly videosService: VideosService) {}

  @Post('upload')
  @Role(UserRole.CREATOR)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'video', maxCount: 1 },
      { name: 'thumbnail', maxCount: 1 },
    ])
  )
  async uploadVideo(
    @UploadedFiles()
    files: {
      video?: Express.Multer.File[];
      thumbnail?: Express.Multer.File[];
    },
    @Body() data: UploadDto,
    @Req() req: any,
  ) {
    // Upload video
    const videoFile = files.video?.[0];
    if (!videoFile) {
      throw new Error('Video file is required.');
    }
    const videoFileName = await this.videosService.uploadToAzure(
      videoFile.buffer,
      videoFile.originalname,
      videoFile.mimetype,
    );

    // Upload thumbnail if provided
    let thumbnailFileName: string | null = null;
    if (files.thumbnail?.[0]) {
      const thumbnailFile = files.thumbnail[0];
      thumbnailFileName = await this.videosService.uploadToAzure(
        thumbnailFile.buffer,
        thumbnailFile.originalname,
        thumbnailFile.mimetype,
      );
    }

    // Save metadata
    const saved = await this.videosService.saveMetadata(
      videoFileName,
      data,
      req.user.sub,
      thumbnailFileName,
    );

    return {
      success: true,
      data: saved,
    };
  }

  @Get('all')
  async getAllVideos() {
    const videos = await this.videosService.getAll();
    return {
      success: true,
      data: videos,
    };
  }
  
  @Get(':id')
  @UseGuards(AuthGuard)
  async getVideoById(@Param('id') id: string, @Req() req) {
    const userId = req.user.sub;
    const data = await this.videosService.getVideoById(id, userId);
    return { success: true, data };
  }
}
