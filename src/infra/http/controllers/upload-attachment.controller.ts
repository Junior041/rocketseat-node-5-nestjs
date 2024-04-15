import { InvalidAttachmentTypeError } from '@/domain/forum/application/use-cases/erros/invalid-attachment-type';
import { UploadAndCreateAttachmentUseCase } from '@/domain/forum/application/use-cases/upload-and-create-attachments';
import { BadRequestException, Controller, FileTypeValidator, MaxFileSizeValidator, ParseFilePipe, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';


@Controller('/attachments')
export class UploadAttachmentsController {
	constructor(
		private uploadAndCreateAttachment: UploadAndCreateAttachmentUseCase
	) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
	async handle(@UploadedFile(
		new ParseFilePipe({
			validators: [
				new MaxFileSizeValidator({maxSize: 2 * 1024 * 1024}),
				new FileTypeValidator({
					fileType: '.(png|jpeg|jpg|pdf)'
				})
			]
		})
	) file: Express.Multer.File){

		const result = await this.uploadAndCreateAttachment.execute({
			body: file.buffer,
			fileName: file.originalname,
			fileType: file.mimetype,
		});

		if (result.isLeft()) {
			const error = result.value;
			switch (error.constructor) {
			case InvalidAttachmentTypeError:
				throw new BadRequestException(error.message);
			default:
				throw new BadRequestException(error.message);
			}
		}
		const { attachment } = result.value;
		return {
			attachmentId: attachment.id.toString(),
		};
	}
}
