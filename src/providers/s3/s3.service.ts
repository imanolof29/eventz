import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import * as sharp from 'sharp';

@Injectable()
export class S3Service {
    private readonly s3Client = new S3Client({
        region: this.configService.getOrThrow('AWS_S3_REGION'),
    });

    constructor(
        private readonly configService: ConfigService
    ) { }

    convert = require('heic-convert');

    async heicToJpeg(file: Buffer) {
        const outputBuffer = await this.convert({
            buffer: file,
            format: 'JPEG',
            quality: 1,
        });

        return outputBuffer as Buffer;
    }

    async upload(
        files: Express.Multer.File[],
        userId: string,
    ): Promise<string[]> {
        const uploadedUris: string[] = [];

        for (const file of files) {
            if (!file.mimetype.startsWith('image')) {
                throw new HttpException(
                    "You're trying to upload a non-image file",
                    HttpStatus.PRECONDITION_FAILED,
                );
            }

            let readyImage = file.buffer;

            const isHeic = file.mimetype === 'image/heic';

            if (isHeic) {
                const convertedImage = await this.heicToJpeg(file.buffer);
                readyImage = convertedImage;
            }

            const processedImage = await sharp(readyImage)
                .resize(1000)
                .toFormat('jpeg')
                .toBuffer();

            const s3ImageKey = `${userId}-${Date.now()}-${Math.floor(Math.random() * 6)}.jpeg`;

            await this.s3Client.send(
                new PutObjectCommand({
                    Bucket: 'find-image-uploads',
                    Key: s3ImageKey,
                    Body: processedImage,
                }),
            );
            //CAMBIAR URL A MI PROPIO BUCKET
            const s3Uri = `https://.s3.amazonaws.com/${s3ImageKey}`;
            uploadedUris.push(s3Uri);
        }

        return uploadedUris;
    }

}