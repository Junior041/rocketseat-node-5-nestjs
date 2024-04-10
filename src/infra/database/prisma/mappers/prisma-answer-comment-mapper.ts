import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { AnswerComment as AnswerCommentDomain} from '@/domain/forum/enterprise/entities/answer-comment';

import { Comment as AnswerCommentPrisma, Prisma }  from '@prisma/client';

export class PrismaAnswerCommentMapper{
	static toDomain(AnswerCommentPrisma: AnswerCommentPrisma): AnswerCommentDomain{

		if (!AnswerCommentPrisma.answerId) {
			throw new Error('Invalid comment type.');
		}

		return AnswerCommentDomain.create({
			content: AnswerCommentPrisma.content,
			authorId: new UniqueEntityID(AnswerCommentPrisma.authorId),
			answerId: new UniqueEntityID(AnswerCommentPrisma.answerId),
			createdAt: AnswerCommentPrisma.createdAt,
			updatedAt: AnswerCommentPrisma.updatedAt,
		}, new UniqueEntityID(AnswerCommentPrisma.id));
	}
	static toPrisma(AnswerCommentDomain: AnswerCommentDomain): Prisma.CommentUncheckedCreateInput{
		return {
			id: AnswerCommentDomain.id.toString(),
			authorId: AnswerCommentDomain.authorId.toString(),
			answerId: AnswerCommentDomain.answerId.toString(),
			content: AnswerCommentDomain.content,
			createdAt: AnswerCommentDomain.createdAt,
			updatedAt: AnswerCommentDomain.updatedAt,
		};
	}
}