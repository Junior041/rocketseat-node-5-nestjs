import { PaginationParams } from '@/core/repositories/pagination-params';
import { AnswerCommentsRepository } from '@/domain/forum/application/repositories/answer-comments-repository';
import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { PrismaAnswerCommentMapper } from '../mappers/prisma-answer-comment-mapper';

@Injectable()
export class PrismaAnswerCommentsRepository implements AnswerCommentsRepository {
	constructor(private prisma: PrismaService){}


	async findById(id: string): Promise<AnswerComment | null> {
		const qeustionComment = await this.prisma.comment.findUnique({
			where: {
				id
			}
		});
		if (!qeustionComment) {
			return null;
		}
		return PrismaAnswerCommentMapper.toDomain(qeustionComment);
	}
	async findManyByAnswerId(questionId: string, {page}: PaginationParams): Promise<AnswerComment[]> {
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
		return quetionComment.map(PrismaAnswerCommentMapper.toDomain);
	}
	async create(answerComment: AnswerComment): Promise<void> {
		const data = PrismaAnswerCommentMapper.toPrisma(answerComment);
		
		await this.prisma.comment.create({
			data
		});
	}
	async delete(answerComment: AnswerComment): Promise<void> {
		await this.prisma.comment.delete({
			where: {
				id: answerComment.id.toString()
			},
		});
	}
}
