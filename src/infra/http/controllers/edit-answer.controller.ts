/* eslint-disable no-mixed-spaces-and-tabs */
import { BadRequestException, Body, Controller, HttpCode, Param, Put, UseGuards } from '@nestjs/common';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';
import { z } from 'zod';
import { EditAnswerUseCase } from '@/domain/forum/application/use-cases/edit-answer';

const editAnswerBodySchema = z.object({
	content: z.string(),
	attachments: z.array(z.string().uuid()),
});

type EditAnswerBodySchema = z.infer<typeof editAnswerBodySchema>;

const bodyValidationType = new ZodValidationPipe(editAnswerBodySchema);

@Controller('/answers/:id')
@UseGuards(JwtAuthGuard)
export class EditAnswerController {
	constructor(private readonly editAnswer: EditAnswerUseCase) {}

  @Put()
  @HttpCode(204)

	async handle(
        @Param('id') answerId: string,
        @CurrentUser() user: UserPayload,
        @Body(bodyValidationType) body: EditAnswerBodySchema, 
	) {

		const { content, attachments } = body;
		const { sub } = user;
		const result = await this.editAnswer.execute(
			{ 
				answerId,
				attachmentsIds: attachments,
				authorId: sub,
				content,
			});
            
		if (result.isLeft()) {
			throw new BadRequestException();
		}
	}

}
