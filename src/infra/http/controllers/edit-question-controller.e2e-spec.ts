import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/databae.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { QuestionFactory } from 'test/factories/make-question';
import { StudentFactory } from 'test/factories/make-student';

describe('Update question (E2E)', () => {
	let app: INestApplication;
	let prismaService: PrismaService;
	let jwtService: JwtService;
	let studentFactory: StudentFactory;
	let questionFactory: QuestionFactory;
  
	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			providers: [StudentFactory, QuestionFactory],
			imports: [AppModule, DatabaseModule],
		}).compile();
  
		app = moduleRef.createNestApplication();

		prismaService = moduleRef.get(PrismaService);
		studentFactory = moduleRef.get(StudentFactory);
		questionFactory = moduleRef.get(QuestionFactory);
		jwtService = moduleRef.get(JwtService);

		await app.init();
	});

	test('[PUT] /questions/:id', async() => {
		const user = await studentFactory.makePrismaStudent(
			{
				email: 'teste@gmail.com',
				name:'teste',
				password: '1234567890'
			}
		);
		const question = await questionFactory.makePrismaQuestion(
			{
				authorId: user.id
			}
		);

		const accessToken = jwtService.sign({sub: user.id.toString()});

		const response = await request(app.getHttpServer())
			.put(`/questions/${question.id}`)
			.set('Authorization', `Bearer ${accessToken}`)
			.send({
				title: 'New title',
				content:'Mew Content'
			});
			
			
		expect(response.status).toBe(204);
		
		const questionOnDatabase = await prismaService.question.findUnique({
			where:{
				slug: 'new-title'
			}
		});

		expect(questionOnDatabase).toBeTruthy();
	});

});