import { Question as QuestionDomain } from '@/domain/forum/enterprise/entities/question';

export class QuestionPresenter {
	static toHTTTP(question: QuestionDomain) {
		return {
			id: question.id.toString(),
			title: question.title,
			slug: question.slug.value,
			bestAnswerId: question.bestAnswerId?.toString(),
			createdAt: question.createdAt,
			updatedAt: question.updatedAt,
		};
	}
}