import { Injectable } from "@nestjs/common";
import { S3 } from 'aws-sdk'
import { ConfigService } from "@nestjs/config";
import { v4 as uuidv4 } from 'uuid';
import moment from "moment";

@Injectable()
export class S3Service {

    private client: AWS.S3

    constructor(
        private readonly configService: ConfigService
    ) {
        this.client = new S3({
            region: this.configService.getOrThrow("AWS_S3_REGION"),
            credentials: {
                accessKeyId: this.configService.getOrThrow('AWS_ACCESS_KEY_ID'),
                secretAccessKey: this.configService.getOrThrow('AWS_SECRET_ACCESS_KEY')
            }
        })
    }

    async upload(file: Express.Multer.File) {
        try {
            const key = uuidv4()
            const params = {
                Bucket: this.configService.getOrThrow('AWS_S3_BUCKET_NAME'),
                Key: key,
                Body: file.buffer,
                ContentType: file.mimetype
            }
            const uploadResponse = await this.client.upload(params).promise()
            const url = await this.getPresignedUrl(key, file.originalname)
            return { ...uploadResponse, url }
        } catch (error) {
            console.log(error)
            throw error
        }
    }

    async get(bucket: string, key: string) {
        const params = {
            Bucket: bucket,
            Key: key,
        };
        return await this.client.getObject(params).promise();
    }

    async getPresignedUrl(key: string, originalname: string) {
        const params = {
            Bucket: this.configService.getOrThrow('AWS_S3_BUCKET_NAME'),
            Key: key,
            Expires: 60 * 60 * 24 * 7,
            ResponseContentDisposition:
                'attachment; filename ="' + originalname + '"',
        };
        return await this.client.getSignedUrlPromise('getObject', params);
    }

    async isPreSignedUrlExpired(url: string) {
        const parsedUrl = new URL(url);
        const search_params = parsedUrl.searchParams;

        if (!search_params.has('X-Amz-Expires')) {
            return true;
        }
        const urlGeneratedDate = search_params.get('X-Amz-Date');
        const parsedGeneratedDate = moment(urlGeneratedDate, 'YYYYMMDDTHHmmssZ');
        const expirationTime = search_params.get('X-Amz-Expires') || '';

        const expirationDate = parsedGeneratedDate.add(
            parseInt(expirationTime),
            'seconds',
        );
        return moment().isAfter(expirationDate);
    }

}