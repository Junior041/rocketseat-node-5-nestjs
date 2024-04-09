import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { z } from 'zod';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';
import { FetchRecentQuestionsUseCase } from '@/domain/forum/application/use-cases/fetch-recent-questions';
import { QuestionPresenter } from '../presenters/question-presenter';

const pageQueryParamSchema = z.coerce.number().optional().default(1);

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema);

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>;

@Controller('/questions')
export class FetchListenQuestionsController {
	constructor(private readonly fetchRecentQuestionsUseCase: FetchRecentQuestionsUseCase) {}

  @Get()
	async handle(
		@Query('page', queryValidationPipe) page: PageQueryParamSchema,
	) {
		const result = await this.fetchRecentQuestionsUseCase.execute({ page });
		
		if (result.isLeft()) {
			throw new BadRequestException();
		}

		const {questions} = result.value;

		return {
			questions:questions.map(QuestionPresenter.toHTTTP)
		};
	}
}
