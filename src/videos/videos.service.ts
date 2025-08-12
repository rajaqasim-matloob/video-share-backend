// src/modules/videos/videos.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { UploadDto } from './dto/upload.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BlobServiceClient, StorageSharedKeyCredential, generateBlobSASQueryParameters, BlobSASPermissions, SASProtocol } from '@azure/storage-blob';
import { ConfigService } from '@nestjs/config';
import { Video, VideoDocument } from './entities/video.schema';
import { v4 as uuid } from 'uuid';

@Injectable()
export class VideosService {
    private blobServiceClient: BlobServiceClient;
    private containerClient;

    constructor(
        @InjectModel(Video.name) private videoModel: Model<VideoDocument>,
        @InjectModel('Comment') private commentModel: Model<any>,
        @InjectModel('Rating') private ratingModel: Model<any>,
        @InjectModel('User') private userModel: Model<any>,
        private configService: ConfigService,
    ) {
        const account = this.configService.get<string>('AZURE_STORAGE_ACCOUNT_NAME') || '';
        const accountKey = this.configService.get<string>('AZURE_STORAGE_ACCOUNT_KEY') || '';
        const containerName = this.configService.get<string>('AZURE_STORAGE_CONTAINER_NAME') || '';

        const credentials = new StorageSharedKeyCredential(account, accountKey);
        this.blobServiceClient = new BlobServiceClient(`https://${account}.blob.core.windows.net`, credentials);
        this.containerClient = this.blobServiceClient.getContainerClient(containerName);
    }

    async uploadToAzure(buffer: Buffer, originalName: string, mimetype: string): Promise<string> {
        const blobName = `${Date.now()}-${uuid()}-${originalName}`;
        const blockBlobClient = this.containerClient.getBlockBlobClient(blobName);

        await blockBlobClient.uploadData(buffer, {
        blobHTTPHeaders: {
            blobContentType: mimetype,
        },
        });

        return blobName;
    }

    generateSasUrl(blobName: string): string {
        const account = this.configService.get<string>('AZURE_STORAGE_ACCOUNT_NAME');
        const accountKey = this.configService.get<string>('AZURE_STORAGE_ACCOUNT_KEY');
        if (!account || !accountKey) {
            throw new Error('Azure Storage account name or key is not configured.');
        }

        const credentials = new StorageSharedKeyCredential(account, accountKey);

        // 🔁 Set expiry to 2 years in the future
        const expiresOn = new Date();
        expiresOn.setFullYear(expiresOn.getFullYear() + 2);

        const sasToken = generateBlobSASQueryParameters(
            {
            containerName: this.containerClient.containerName,
            blobName,
            expiresOn,
            permissions: BlobSASPermissions.parse('r'),
            protocol: SASProtocol.Https,
            },
            credentials,
        ).toString();

        return `${this.containerClient.getBlockBlobClient(blobName).url}?${sasToken}`;
    }

    async saveMetadata(fileName: string, data: UploadDto, uploaderId: string, thumbnailFileName: string | null) {
        const video = new this.videoModel({
        ...data,
        fileName,
        uploaderId,
        uploadedAt: new Date(),
        url: this.generateSasUrl(fileName),  // Use SAS URL
        thumbnailUrl: thumbnailFileName ? this.generateSasUrl(thumbnailFileName) : null,
        });

        return await video.save();
    }

    async getAll() {
        const videos = await this.videoModel.find().exec();

        return videos.map(video => ({
        ...video.toObject(),
        url: this.generateSasUrl(video.fileName),
        }));
    }

    async getVideoById(videoId: string, userId: string) {
        const video = await this.videoModel.findById(videoId).lean();
        if (!video) throw new NotFoundException('Video not found');

        const comments = await this.commentModel
            .find({ videoId })
            .populate('userId', 'name') // only select 'name'
            .lean();

        const ratings = await this.ratingModel.find({ videoId }).lean();

        const avgRating =
            ratings.length > 0
            ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
            : 0;

        const userRating = ratings.find((r) => r.userId.toString() === userId)?.rating || 0;

        // only get name from quer
        const uploader = await this.userModel.findById(video.uploaderId, 'name').lean();

        return {
            ...video,
            comments: comments.map((c) => ({
            comment: c.comment,
            user: {
                name: c.userId?.name || 'Unknown',
            },
            })),
            uploader,
            Rating: +avgRating.toFixed(1),
            userRating,
            alreadyRated: userRating > 0
        };
    }
}
