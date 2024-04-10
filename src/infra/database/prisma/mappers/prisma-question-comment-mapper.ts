import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { QuestionComment as QuestionCommentDomain} from '@/domain/forum/enterprise/entities/question-comment';

import { Comment as QuestionCommentPrisma, Prisma }  from '@prisma/client';

export class PrismaQuestionCommentMapper{
	static toDomain(QuestionCommentPrisma: QuestionCommentPrisma): QuestionCommentDomain{

		if (!QuestionCommentPrisma.questionId) {
			throw new Error('Invalid comment type.');
		}

		return QuestionCommentDomain.create({
			content: QuestionCommentPrisma.content,
			authorId: new UniqueEntityID(QuestionCommentPrisma.authorId),
			questionId: new UniqueEntityID(QuestionCommentPrisma.questionId),
			createdAt: QuestionCommentPrisma.createdAt,
			updatedAt: QuestionCommentPrisma.updatedAt,
		}, new UniqueEntityID(QuestionCommentPrisma.id));
	}
	static toPrisma(QuestionCommentDomain: QuestionCommentDomain): Prisma.CommentUncheckedCreateInput{
		return {
			id: QuestionCommentDomain.id.toString(),
			authorId: QuestionCommentDomain.authorId.toString(),
			questionId: QuestionCommentDomain.questionId.toString(),
			content: QuestionCommentDomain.content,
			createdAt: QuestionCommentDomain.createdAt,
			updatedAt: QuestionCommentDomain.updatedAt,
		};
	}
}