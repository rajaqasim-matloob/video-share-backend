import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type VideoDocument = Video & Document;

@Schema({ timestamps: true })
export class Video {
    @Prop({ required: true })
    title: string;

    @Prop({ required: true })
    fileName: string;

    @Prop({ required: true })
    publisher: string;

    @Prop({ required: true })
    producer: string;

    @Prop({ required: true })
    genre: string;

    @Prop({ required: true })
    ageRating: string;

    @Prop({ required: true })
    url: string;

    @Prop({ default: 0 })
    likes: number;

    @Prop({ default: 0 })
    rating: number;

    @Prop({ type: 'ObjectId', ref: 'User', required: true })
    uploaderId: string;

    @Prop()
    thumbnailUrl: string;

}

export const VideoSchema = SchemaFactory.createForClass(Video);