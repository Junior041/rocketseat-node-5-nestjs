import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/databae.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AnswerFactory } from 'test/factories/make-answer';
import { QuestionFactory } from 'test/factories/make-question';
import { StudentFactory } from 'test/factories/make-student';

describe('Delete answer (E2E)', () => {
	let app: INestApplication;
	let prismaService: PrismaService;
	let jwtService: JwtService;
	let studentFactory: StudentFactory;
	let questionFactory: QuestionFactory;
	let answerFactory: AnswerFactory;
  
	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			providers: [StudentFactory, QuestionFactory, AnswerFactory],
			imports: [AppModule, DatabaseModule],
		}).compile();
  
		app = moduleRef.createNestApplication();

		prismaService = moduleRef.get(PrismaService);
		studentFactory = moduleRef.get(StudentFactory);
		questionFactory = moduleRef.get(QuestionFactory);
		answerFactory = moduleRef.get(AnswerFactory);
		jwtService = moduleRef.get(JwtService);

		await app.init();
	});

	test('[DELETE] /answer/:id', async() => {
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

		const answer = await answerFactory.makePrismaAnswer({
			authorId: user.id,
			questionId: question.id,
		});

		const accessToken = jwtService.sign({sub: user.id.toString()});

		const response = await request(app.getHttpServer())
			.delete(`/answer/${answer.id}`)
			.set('Authorization', `Bearer ${accessToken}`);
			
		
		expect(response.status).toBe(204);
		
		const answerOnDatabase = await prismaService.answer.findUnique({
			where:{
				id: answer.id.toString()
			}
		});

		expect(answerOnDatabase).toBeNull();
	});

});