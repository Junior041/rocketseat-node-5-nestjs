/* eslint-disable no-mixed-spaces-and-tabs */
import { BadRequestException, Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';
import { z } from 'zod';
import { CreateQuestionUseCase } from '@/domain/forum/application/use-cases/create-question';

const createQuestionBodySchema = z.object({
	title: z.string(),
	content: z.string(),
});

type CreateQuestionBodySchema = z.infer<typeof createQuestionBodySchema>;

const bodyValidationType = new ZodValidationPipe(createQuestionBodySchema);

@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class CreateQuestionController {
	constructor(private readonly createQuestion: CreateQuestionUseCase) {}

  @Post()
	async handle(@Body(bodyValidationType) body: CreateQuestionBodySchema, @CurrentUser() user: UserPayload) {
		const { title, content } = body;
		const { sub } = user;
		const result = await this.createQuestion.execute({ title, content, authorId: sub, attachmentsIds: []});
		if (result.isLeft()) {
			throw new BadRequestException();
		}
	}

}
