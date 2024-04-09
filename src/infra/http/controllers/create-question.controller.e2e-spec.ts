import { AppModule } from '@/infra/app.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';

describe('Create question (E2E)', () => {
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

	test('[POST] /questions', async() => {
		const user = await prismaService.user.create({
			data: {
				email: 'teste@gmail.com',
				name:'teste',
				password: '1234567890'
			}
		});

		const accessToken = jwtService.sign({sub: user.id});

		const response = await request(app.getHttpServer())
			.post('/questions')
			.set('Authorization', `Bearer ${accessToken}`)
			.send({
				title: 'Test Question',
				content:'Test Question Content'
			});
			
			
		expect(response.status).toBe(201);
		
		const questionOnDatabase = await prismaService.question.findUnique({
			where:{
				slug: 'test-question'
			}
		});

		expect(questionOnDatabase).toBeTruthy();
	});

});