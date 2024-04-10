import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug';
import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/databae.module';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { QuestionFactory } from 'test/factories/make-question';
import { StudentFactory } from 'test/factories/make-student';

describe('Fetch listen questions (E2E)', () => {
	let app: INestApplication;
	let jwtService: JwtService;
	let studentFactory: StudentFactory;
	let questionFactory: QuestionFactory;

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			providers: [StudentFactory, QuestionFactory],
			imports: [AppModule, DatabaseModule],
		}).compile();

		app = moduleRef.createNestApplication();

		jwtService = moduleRef.get(JwtService);
		studentFactory = moduleRef.get(StudentFactory);
		questionFactory = moduleRef.get(QuestionFactory);

		await app.init();
	});

	test('[GET] /questions', async () => {
		const user = await studentFactory.makePrismaStudent({
			email: 'teste@gmail.com',
			name: 'teste',
			password: '1234567890',
		});

		for (let index = 1; index <= 3; index++) {
			await questionFactory.makePrismaQuestion({
				title: `Question ${index}`,
				content: `Question ${index} Content`,
				authorId: user.id,
				slug: Slug.create(`question-${index}`),
			});
		}
		const accessToken = jwtService.sign({ sub: user.id.toString() });

		const response = await request(app.getHttpServer()).get('/questions?page=1').set('Authorization', `Bearer ${accessToken}`);

		expect(response.status).toBe(200);
		expect(response.body).toEqual({
			questions: expect.arrayContaining([expect.objectContaining({ title: 'Question 1' }), expect.objectContaining({ title: 'Question 2' })]),
		});
	});
});
