import { Question as PrismaQuestion, Prisma } from "@prisma/client";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Question } from "@/domain/forum/enterprise/entities/question";
import { Slug } from "@/domain/forum/enterprise/entities/value-objects/slug";

export class PrismaQuestionMapper {
	static toDomain({id, authorId,content,title,createdAt,slug,updatedAt, bestAnswerId}: PrismaQuestion): Question{
		return Question.create({
			authorId: new UniqueEntityID(authorId),
			content,
			title,
			bestAnswerId: bestAnswerId 
				? new UniqueEntityID(bestAnswerId) 
				: null,
			createdAt,
			slug: Slug.createFromText(slug),
			updatedAt: updatedAt,
		}, new UniqueEntityID(id));
	}
	static toPrisma(question: Question): Prisma.QuestionUncheckedCreateInput {
		return {
			id: question.id.toString(),
			authorId: question.authorId.toString(),
			bestAnswerId: question.authorId?.toString(),
			title: question.title,
			content: question.content,
			slug: question.slug.value,
			createdAt: question.createdAt,
			updatedAt: question.updatedAt,
		};
	}
}