import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Answer as AnswerDomain} from '@/domain/forum/enterprise/entities/answer';
import { Answer as AnswerPrisma, Prisma }  from '@prisma/client';

export class PrismaAnswerMapper{
	static toDomain(AnswerPrisma: AnswerPrisma): AnswerDomain{
		return AnswerDomain.create({
			authorId: new UniqueEntityID(AnswerPrisma.authorId),
			questionId: new UniqueEntityID(AnswerPrisma.questionId),
			content: AnswerPrisma.content,
			createdAt: AnswerPrisma.createdAt,
			updatedAt: AnswerPrisma.updatedAt,
		}, new UniqueEntityID(AnswerPrisma.id));
	}
	static toPrisma(AnswerDomain: AnswerDomain): Prisma.AnswerUncheckedCreateInput{
		return {
			id: AnswerDomain.id.toString(),
			questionId: AnswerDomain.questionId.toString(),
			authorId: AnswerDomain.authorId.toString(),
			content: AnswerDomain.content,
			createdAt: AnswerDomain.createdAt,
			updatedAt: AnswerDomain.updatedAt,
		};
	}
}