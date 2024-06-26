import { PaginationParams } from '@/core/repositories/pagination-params';
import { QuestionCommentsRepository } from '@/domain/forum/application/repositories/question-comments-repository';
import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment';
import { InMemoryStudentRepository } from './in-memory-students-repository';
import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/comment-with-autor';

export class InMemoryQuestionCommentsRepository
implements QuestionCommentsRepository
{
	public items: QuestionComment[] = [];

	constructor(private studentsRepository: InMemoryStudentRepository){}

	async findById(id: string) {
		const questionComment = this.items.find((item) => item.id.toString() === id);

		if (!questionComment) {
			return null;
		}

		return questionComment;
	}

	async findManyByQuestionId(questionId: string, { page }: PaginationParams) {
		const questionComments = this.items
			.filter((item) => item.questionId.toString() === questionId)
			.slice((page - 1) * 20, page * 20);

		return questionComments;
	}

	async findManyByQuestionIdWithAuthor(questionId: string, { page }: PaginationParams) {
		const questionComments = this.items
			.filter((item) => item.questionId.toString() === questionId)
			.slice((page - 1) * 20, page * 20)
			.map(comment => {

				const author = this.studentsRepository.items.find(student => {
					return student.id.equals(comment.authorId);
				});
				if (!author) {
					throw new Error(`Author with id ${comment.authorId} not found`);
				}

				return CommentWithAuthor.create({
					commentId: comment.id,
					content: comment.content,
					author: author.name,
					authorId: author.id,
					createdAt: comment.createdAt,
					updatedAt: comment.updatedAt,
				});
			});

		return questionComments;
	}

	async create(questionComment: QuestionComment) {
		this.items.push(questionComment);
	}

	async delete(questionComment: QuestionComment) {
		const itemIndex = this.items.findIndex(
			(item) => item.id === questionComment.id,
		);

		this.items.splice(itemIndex, 1);
	}
}
