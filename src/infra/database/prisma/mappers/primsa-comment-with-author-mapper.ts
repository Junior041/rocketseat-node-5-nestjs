import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/comment-with-autor';
import { Comment as PrismaComment, User as PrismaUser } from '@prisma/client';

type PrismaCommentWithAuthorType =  PrismaComment & {
    author: PrismaUser
}

export class PrismaCommentWithAuthor {
	static toDomain(commentWithAuthor: PrismaCommentWithAuthorType): CommentWithAuthor {
		return CommentWithAuthor.create({
			commentId: new UniqueEntityID(commentWithAuthor.id),
			authorId: new UniqueEntityID(commentWithAuthor.author.id),
			author: commentWithAuthor.author.name,
			content: commentWithAuthor.content,
			createdAt: commentWithAuthor.createdAt,
			updatedAt: commentWithAuthor.updatedAt
		});
	}
}