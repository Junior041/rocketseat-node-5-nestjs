import { AppModule } from '@/infra/app.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { hash } from 'bcryptjs';
import request from 'supertest';

describe('Authenticate (E2E)', () => {
	let app: INestApplication;
	let prismaService: PrismaService;
  
	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();
  
		app = moduleRef.createNestApplication();
		prismaService = moduleRef.get(PrismaService);
		await app.init();
	});

	test('[POST] /sessions', async() => {
		await prismaService.user.create({
			data: {
				email: 'teste@gmail.com',
				name:'teste',
				password: await hash('1234567890', 8)
			}
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