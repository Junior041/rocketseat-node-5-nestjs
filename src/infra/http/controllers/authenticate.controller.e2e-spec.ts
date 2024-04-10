import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/databae.module';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { hash } from 'bcryptjs';
import request from 'supertest';
import { StudentFactory } from 'test/factories/make-student';

describe('Authenticate (E2E)', () => {
	let app: INestApplication;
	let studentFactory: StudentFactory;
  
	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			providers: [StudentFactory],
			imports: [AppModule, DatabaseModule],
		}).compile();
  
		app = moduleRef.createNestApplication();
		studentFactory = moduleRef.get(StudentFactory);
		await app.init();
	});

	test('[POST] /sessions', async() => {
		await studentFactory.makePrismaStudent({
			email: 'teste@gmail.com',
			name:'teste',
			password: await hash('1234567890', 8)
		});

		const response = await request(app.getHttpServer())
			.post('/sessions')
			.send({
				email: 'teste@gmail.com',
				password:'1234567890'
			});

		expect(response.status).toBe(201);
		expect(response.body).toEqual({
			access_token: expect.any(String)
		});
		
	});

});