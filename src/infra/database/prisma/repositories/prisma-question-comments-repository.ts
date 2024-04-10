import { PaginationParams } from '@/core/repositories/pagination-params';
import { QuestionCommentsRepository } from '@/domain/forum/application/repositories/question-comments-repository';
import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { PrismaQuestionCommentMapper } from '../mappers/prisma-question-comment-mapper';

@Injectable()
export class PrismaQuestionCommentsRepository implements QuestionCommentsRepository{

	constructor(private prisma: PrismaService){}


	async findById(id: string): Promise<QuestionComment | null> {
		const qeustionComment = await this.prisma.comment.findUnique({
			where: {
				id
			}
		});
		if (!qeustionComment) {
			return null;
		}
		return PrismaQuestionCommentMapper.toDomain(qeustionComment);
	}
	async findManyByQuestionId(questionId: string, {page}: PaginationParams): Promise<QuestionComment[]> {
		const quetionComment = await this.prisma.comment.findMany({
			orderBy: {
				createdAt: 'desc'
			},
			where: {
				id: questionId
			},
			take: 20,
			skip: (page - 1) * 20
		});
		return quetionComment.map(PrismaQuestionCommentMapper.toDomain);
	}
	async create(questionComment: QuestionComment): Promise<void> {
		const data = PrismaQuestionCommentMapper.toPrisma(questionComment);
		
		await this.prisma.comment.create({
			data
		});
	}
	async delete(questionComment: QuestionComment): Promise<void> {
		await this.prisma.comment.delete({
			where: {
				id: questionComment.id.toString()
			},
		});
	}
    
}