import { Controller, FileTypeValidator, MaxFileSizeValidator, ParseFilePipe, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';


@Controller('/attachments')
export class UploadAttachmentsController {
	// constructor() {}

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
		console.log(file);
	}
}
