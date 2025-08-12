import { IsString, IsOptional } from 'class-validator';

export class UploadDto {
  @IsString()
  title: string;

  @IsString()
  publisher: string;

  @IsOptional()
  @IsString()
  producer?: string;

  @IsString()
  genre: string;

  @IsString()
  ageRating: string; // Examples: G, PG, 13+, 18+
}
