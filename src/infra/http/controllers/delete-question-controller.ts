import { BadRequestException, Controller, Delete, HttpCode, Param, UseGuards } from '@nestjs/common';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { DeleteQuestionUseCase } from '@/domain/forum/application/use-cases/delete-question';

@Controller('/questions/:id')
@UseGuards(JwtAuthGuard)
export class DeleteQuestionController {
	constructor(private readonly deleteQuestion: DeleteQuestionUseCase) {}

  @Delete()
  @HttpCode(204)

	async handle(
        @Param('id') questionId: string,
        @CurrentUser() user: UserPayload,
	) {

		const { sub } = user;
		const result = await this.deleteQuestion.execute(
			{ authorId: sub, questionId}
		);
		if (result.isLeft()) {
			throw new BadRequestException();
		}
	}

}
