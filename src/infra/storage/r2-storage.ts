import { Uploader, UploadParams } from '@/domain/forum/application/storage/uploader';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { EnvService } from '../env/env.service';
import { randomUUID } from 'crypto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class R2Storage implements Uploader {

	private client: S3Client;

	constructor(
        private envService: EnvService
	){
		const account_id = this.envService.get('CLOUDFLARE_ACCOUNT_ID');
		this.client = new S3Client({
			endpoint: 
                `https://${account_id}.r2.cloudflarestorage.com`,
			region: 'auto',
			credentials: {
				accessKeyId: this.envService.get('AWS_ACCESS_KEY_ID'),
				secretAccessKey: this.envService.get('AWS_SECRET_KEY')
			}
		});
	}

	async upload({body, fileName, fileType}: UploadParams): Promise<{ url: string; }> {
		const uploadId = randomUUID();
		const uniqueFilename = `${uploadId}-${fileName}`;

		await this.client.send(new PutObjectCommand({
			Bucket: this.envService.get('AWS_BUCKET_NAME'),
			Key: uniqueFilename,
			ContentType: fileType,
			Body: body
		}));

		return {
			url: uniqueFilename
		};
	}

}