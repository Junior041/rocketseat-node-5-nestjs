import { AppModule } from '@/infra/app.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';

describe('Get question by slug (E2E)', () => {
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

	test('[GET] /questions/:slug', async() => {
		const user = await prismaService.user.create({
			data: {
				email: 'teste@gmail.com',
				name:'teste',
				password: '1234567890'
			}
		});

		await prismaService.question.create({
			data: {
				title: 'Question 1',
				content: 'Question 1 Content',
				authorId: user.id,
				slug: 'question-1'
			}
		});

		const accessToken = jwtService.sign({sub: user.id});

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