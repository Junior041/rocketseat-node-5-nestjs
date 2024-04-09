import { AppModule } from '@/infra/app.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';

describe('Fetch listen questions (E2E)', () => {
	let app: INestApplication;
	let prismaService: PrismaService;
	let jwtService: JwtService;
  
	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();
  
		app = moduleRef.createNestApplication();

		prismaService = moduleRef.get(PrismaService);
		jwtService = moduleRef.get(JwtService);

		await app.init();
	});

	test('[GET] /questions', async() => {
		const user = await prismaService.user.create({
			data: {
				email: 'teste@gmail.com',
				name:'teste',
				password: '1234567890'
			}
		});

		await prismaService.question.createMany({
			data: [
				{
					title: 'Question 1',
					content: 'Question 1 Content',
					authorId: user.id,
					slug: 'question-1'
				},
				{
					title: 'Question 2',
					content: 'Question 2 Content',
					authorId: user.id,
					slug: 'question-2'
				},
				{
					title: 'Question 3',
					content: 'Question 3 Content',
					authorId: user.id,
					slug: 'question-3'
				}
			]
		});

		const accessToken = jwtService.sign({sub: user.id});

		const response = await request(app.getHttpServer())
			.get('/questions?page=1')
			.set('Authorization', `Bearer ${accessToken}`);
			

		expect(response.status).toBe(200);
		expect(response.body).toEqual({
			questions: [
				expect.objectContaining({title: 'Question 1'}),
				expect.objectContaining({title: 'Question 2'}),
				expect.objectContaining({title: 'Question 3'}),
			]
		});
	});

});