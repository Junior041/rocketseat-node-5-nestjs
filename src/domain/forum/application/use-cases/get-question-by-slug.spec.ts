import { GetQuestionBySlugUseCase } from './get-question-by-slug';
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository';
import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug';
import { makeQuestion } from 'test/factories/make-question';
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository';
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository';
import { makeStudent } from 'test/factories/make-student';
import { makeAttachment } from 'test/factories/make-attachment';
import { makeQuestionAttachment } from 'test/factories/make-question-attachments';
import { InMemoryStudentRepository } from 'test/repositories/in-memory-students-repository';

let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository;
let inMemoryStudentsRepository: InMemoryStudentRepository;
let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let sut: GetQuestionBySlugUseCase;

describe('Get Question By Slug', () => {
	beforeEach(() => {
		inMemoryQuestionAttachmentsRepository =new InMemoryQuestionAttachmentsRepository();
		inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository();
		inMemoryStudentsRepository = new InMemoryStudentRepository();

		inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
			inMemoryQuestionAttachmentsRepository,
			inMemoryAttachmentsRepository,
			inMemoryStudentsRepository,
		);
		sut = new GetQuestionBySlugUseCase(inMemoryQuestionsRepository);
	});

	it('should be able to get a question by slug', async () => {
		const student = makeStudent({ name: 'John Doe' });

		await inMemoryStudentsRepository.create(student);

		const newQuestion = makeQuestion({
			authorId: student.id,
			slug: Slug.create('example-question'),
		});

		await inMemoryQuestionsRepository.create(newQuestion);

		const attachment = makeAttachment({
			title: 'Some attachment',
		});

		inMemoryAttachmentsRepository.items.push(attachment);

		inMemoryQuestionAttachmentsRepository.items.push(
			makeQuestionAttachment({
				attachmentId: attachment.id,
				questionId: newQuestion.id,
			}),
		);

		const result = await sut.execute({
			slug: 'example-question',
		});

		expect(result.value).toMatchObject({
			question: expect.objectContaining({
				title: newQuestion.title,
				author: 'John Doe',
				attachments: [
					expect.objectContaining({
						title: attachment.title,
					}),
				],
			}),
		});
	});
});