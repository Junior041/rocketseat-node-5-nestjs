import { BadRequestException, Controller, Delete, HttpCode, Param, UseGuards } from '@nestjs/common';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { DeleteAnswerUseCase } from '@/domain/forum/application/use-cases/delete-answer';

@Controller('/answer/:id')
@UseGuards(JwtAuthGuard)
export class DeleteAnswerController {
	constructor(private readonly deleteAnswer: DeleteAnswerUseCase) {}

  @Delete()
  @HttpCode(204)

	async handle(
        @Param('id') answerId: string,
        @CurrentUser() user: UserPayload,
	) {

		const { sub } = user;
		const result = await this.deleteAnswer.execute(
			{ authorId: sub, answerId}
		);
		if (result.isLeft()) {
			throw new BadRequestException();
		}
	}

}
