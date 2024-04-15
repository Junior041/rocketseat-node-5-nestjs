import { Answer as AnswerDomain } from '@/domain/forum/enterprise/entities/answer';

export class AnswerPresenter {
	static toHTTP(answer: AnswerDomain) {
		return {
			id: answer.id.toString(),
			content: answer.content,
			createdAt: answer.createdAt,
			updatedAt: answer.updatedAt,
		};
	}
}