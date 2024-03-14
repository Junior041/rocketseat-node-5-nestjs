import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Question } from "@/domain/forum/enterprise/entities/question";
import { Slug } from "@/domain/forum/enterprise/entities/value-objects/slug";
import { Question as PrismaQuestion } from "@prisma/client";

export class PrismaQuestionMapper {
	static toDomain({id, authorId,content,title,createdAt,slug,updatedAt}: PrismaQuestion): Question{
		return Question.create({
			authorId: new UniqueEntityID(authorId),
			content,
			title,
			bestAnswerId: undefined,
			createdAt,
			slug: Slug.createFromText(slug),
			updatedAt: updatedAt,
		}, new UniqueEntityID(id));
	}
}