import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/databae.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AttachmentFactory } from 'test/factories/make-attachment';
import { QuestionFactory } from 'test/factories/make-question';
import { QuestionAttachmentFactory } from 'test/factories/make-question-attachments';
import { StudentFactory } from 'test/factories/make-student';

describe('Update question (E2E)', () => {
	let app: INestApplication;
	let prismaService: PrismaService;
	let jwtService: JwtService;
	let studentFactory: StudentFactory;
	let attachmentFactory: AttachmentFactory;
	let questionAttachmentFectory: QuestionAttachmentFactory;
	let questionFactory: QuestionFactory;

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			providers: [
				StudentFactory,
				QuestionFactory,
				AttachmentFactory,
				QuestionAttachmentFactory,
			],
			imports: [AppModule, DatabaseModule],
		}).compile();

		app = moduleRef.createNestApplication();

		prismaService = moduleRef.get(PrismaService);
		studentFactory = moduleRef.get(StudentFactory);
		attachmentFactory = moduleRef.get(AttachmentFactory);
		questionAttachmentFectory = moduleRef.get(QuestionAttachmentFactory);
		questionFactory = moduleRef.get(QuestionFactory);
		jwtService = moduleRef.get(JwtService);

		await app.init();
	});

	test('[PUT] /questions/:id', async () => {
		const user = await studentFactory.makePrismaStudent({
			email: 'teste@gmail.com',
			name: 'teste',
			password: '1234567890',
		});
		const question = await questionFactory.makePrismaQuestion({
			authorId: user.id,
		});

		const attachment1 = await attachmentFactory.makePrismaAttachment();
		const attachment2 = await attachmentFactory.makePrismaAttachment();

		await questionAttachmentFectory.makePrismaQuestionAttachment({
			attachmentId: attachment1.id,
			questionId: question.id,
		});

		await questionAttachmentFectory.makePrismaQuestionAttachment({
			attachmentId: attachment2.id,
			questionId: question.id,
		});

		const attachment3 = await attachmentFactory.makePrismaAttachment();

		const accessToken = jwtService.sign({ sub: user.id.toString() });

		const response = await request(app.getHttpServer())
			.put(`/questions/${question.id}`)
			.set('Authorization', `Bearer ${accessToken}`)
			.send({
				title: 'New title',
				content: 'Mew Content',
				attathcments: [attachment1.id.toString(), attachment3.id.toString()],
			});
			
		expect(response.status).toBe(204);

		const questionOnDatabase = await prismaService.question.findUnique({
			where: {
				slug: 'new-title',
			},
		});

		expect(questionOnDatabase).toBeTruthy();

		const attachmentsOnDatabase = await prismaService.attachment.findMany({
			where: {
				questionId: questionOnDatabase?.id,
			},
		});

		expect(attachmentsOnDatabase).toHaveLength(2);
		expect(attachmentsOnDatabase).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					id: attachment1.id.toString(),
				}),
				expect.objectContaining({
					id: attachment3.id.toString(),
				}),
			])
		);
	});
});
