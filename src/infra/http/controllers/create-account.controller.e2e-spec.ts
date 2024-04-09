import { AppModule } from '@/infra/app.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';

describe('Create account (E2E)', () => {
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

	test('[POST] /accounts', async() => {
		const email = 'teste@gmail.com';
		const response = await request(app.getHttpServer())
			.post('/accounts')
			.send({
				email,
				name:'teste',
				password:'123456'
			});

		expect(response.status).toBe(201);

		const userOnDatabase = await prismaService.user.findUnique({
			where: {
				email
			}
		});

		expect(userOnDatabase).toBeTruthy();
	});

});