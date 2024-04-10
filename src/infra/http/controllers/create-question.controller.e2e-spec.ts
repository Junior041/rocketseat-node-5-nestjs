import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/databae.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { StudentFactory } from 'test/factories/make-student';

describe('Create question (E2E)', () => {
	let app: INestApplication;
	let prismaService: PrismaService;
	let jwtService: JwtService;
	let studentFactory: StudentFactory;
  
	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			providers: [StudentFactory],
			imports: [AppModule, DatabaseModule],
		}).compile();
  
		app = moduleRef.createNestApplication();

		prismaService = moduleRef.get(PrismaService);
		studentFactory = moduleRef.get(StudentFactory);
		jwtService = moduleRef.get(JwtService);

		await app.init();
	});

	test('[POST] /questions', async() => {
		const user = await studentFactory.makePrismaStudent(
			{
				email: 'teste@gmail.com',
				name:'teste',
				password: '1234567890'
			}
		);

		const accessToken = jwtService.sign({sub: user.id.toString()});

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