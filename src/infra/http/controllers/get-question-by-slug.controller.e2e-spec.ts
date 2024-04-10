import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug';
import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/databae.module';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { QuestionFactory } from 'test/factories/make-question';
import { StudentFactory } from 'test/factories/make-student';

describe('Get question by slug (E2E)', () => {
	let app: INestApplication;
	let jwtService: JwtService;
	let studentFactory: StudentFactory;
	let questionFactory: QuestionFactory;
  
	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			providers: [StudentFactory, QuestionFactory],
			imports: [AppModule,DatabaseModule],
		}).compile();
  
		app = moduleRef.createNestApplication();

		jwtService = moduleRef.get(JwtService);
		studentFactory = moduleRef.get(StudentFactory);
		questionFactory = moduleRef.get(QuestionFactory);

		await app.init();
	});

	test('[GET] /questions/:slug', async() => {
		const user = await studentFactory.makePrismaStudent();

		await questionFactory.makePrismaQuestion(
			{
				title: 'Question 1',
				content: 'Question 1 Content',
				authorId: user.id,
				slug: Slug.create('question-1')
			}
		);
		const accessToken = jwtService.sign({sub: user.id.toString()});

		const response = await request(app.getHttpServer())
			.get('/questions/question-1')
			.set('Authorization', `Bearer ${accessToken}`);
			

		expect(response.status).toBe(200);
		expect(response.body).toEqual({
			question:
				expect.objectContaining({title: 'Question 1'}),
			
		});
	});

});