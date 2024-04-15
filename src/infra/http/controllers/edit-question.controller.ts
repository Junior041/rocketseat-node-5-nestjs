/* eslint-disable no-mixed-spaces-and-tabs */
import { BadRequestException, Body, Controller, HttpCode, Param, Put, UseGuards } from '@nestjs/common';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';
import { z } from 'zod';
import { EditQuestionUseCase } from '@/domain/forum/application/use-cases/edit-question';

const editQuestionBodySchema = z.object({
	title: z.string(),
	content: z.string(),
});

type EditQuestionBodySchema = z.infer<typeof editQuestionBodySchema>;

const bodyValidationType = new ZodValidationPipe(editQuestionBodySchema);

@Controller('/questions/:id')
@UseGuards(JwtAuthGuard)
export class EditQuestionController {
	constructor(private readonly editQuestion: EditQuestionUseCase) {}

  @Put()
  @HttpCode(204)

	async handle(
        @Param('id') questionId: string,
        @CurrentUser() user: UserPayload,
        @Body(bodyValidationType) body: EditQuestionBodySchema, 
	) {

		const { title, content } = body;
		const { sub } = user;
		const result = await this.editQuestion.execute({ questionId,title, content, authorId: sub, attachmentsIds: []});
		if (result.isLeft()) {
			throw new BadRequestException();
		}
	}

}
