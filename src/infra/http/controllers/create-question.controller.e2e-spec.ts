import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/databae.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AttachmentFactory } from 'test/factories/make-attachment';
import { StudentFactory } from 'test/factories/make-student';

describe('Create question (E2E)', () => {
	let app: INestApplication;
	let prismaService: PrismaService;
	let jwtService: JwtService;
	let studentFactory: StudentFactory;
	let atachmentFactory: AttachmentFactory;

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule, DatabaseModule],
			providers: [StudentFactory, AttachmentFactory],
		}).compile();

		app = moduleRef.createNestApplication();

		prismaService = moduleRef.get(PrismaService);
		studentFactory = moduleRef.get(StudentFactory);
		jwtService = moduleRef.get(JwtService);
		atachmentFactory = moduleRef.get(AttachmentFactory);

		await app.init();
	});

	test('[POST] /questions', async () => {
		const user = await studentFactory.makePrismaStudent({
			email: 'teste@gmail.com',
			name: 'teste',
			password: '1234567890',
		});

		const accessToken = jwtService.sign({ sub: user.id.toString() });

		const attachment1 = await atachmentFactory.makePrismaAttachment();
		const attachment2 = await atachmentFactory.makePrismaAttachment();

		const response = await request(app.getHttpServer())
			.post('/questions')
			.set('Authorization', `Bearer ${accessToken}`)
			.send({
				title: 'Test Question',
				content: 'Test Question Content',
				attachments: [attachment1.id.toString(), attachment2.id.toString()],
			});

		expect(response.status).toBe(201);

		const questionOnDatabase = await prismaService.question.findUnique({
			where: {
				slug: 'test-question',
			},
		});

		expect(questionOnDatabase).toBeTruthy();
		const attachmentsOnDatabase = await prismaService.attachment.findMany({
			where: {
				questionId: questionOnDatabase?.id,
			},
		});

		expect(attachmentsOnDatabase).toHaveLength(2);
	});
});
