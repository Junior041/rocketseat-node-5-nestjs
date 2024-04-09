import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Question as QuestionDomain} from '@/domain/forum/enterprise/entities/question';
import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug';
import { Question as QuestionPrisma, Prisma }  from '@prisma/client';

export class PrismaQuestionMapper{
	static toDomain(QuestionPrisma: QuestionPrisma): QuestionDomain{
		return QuestionDomain.create({
			authorId: new UniqueEntityID(QuestionPrisma.authorId),
			title: QuestionPrisma.title,
			content: QuestionPrisma.content,
			slug: Slug.create(QuestionPrisma.slug),
			createdAt: QuestionPrisma.createdAt,
			updatedAt: QuestionPrisma.updatedAt,
			bestAnswerId: QuestionPrisma.bestAnswerId ? new UniqueEntityID(QuestionPrisma.bestAnswerId) : null,
		}, new UniqueEntityID(QuestionPrisma.id));
	}
	static toPrisma(QuestionDomain: QuestionDomain): Prisma.QuestionUncheckedCreateInput{
		return {
			id: QuestionDomain.id.toString(),
			authorId: QuestionDomain.authorId.toString(),
			bestAnswerId: QuestionDomain.bestAnswerId?.toString(),
			title: QuestionDomain.title,
			content: QuestionDomain.content,
			slug: QuestionDomain.slug.value,
			createdAt: QuestionDomain.createdAt,
			updatedAt: QuestionDomain.updatedAt,
		};
	}
}