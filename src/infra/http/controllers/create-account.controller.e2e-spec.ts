import { AppModule } from "@/infra/app.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";

describe("Create Account (E2E)", () => {
	let app: INestApplication;
	let prisma: PrismaService;

	beforeAll(async() => {
		const moduleRef = await Test.createTestingModule({
			imports:[AppModule]
		}).compile();

		app = moduleRef.createNestApplication();
		prisma = moduleRef.get(PrismaService);
		await app.init();
	});

	test("[POST] /accounts" , async() => {
		expect(await prisma.user.count()).toEqual(0);
		const response = await request(app.getHttpServer())
			.post("/accounts")
			.send({
				name: "Teste",
				email: "teste@gmail.com",
				password: "123456"
			})
		; 
		expect(await prisma.user.findUnique({where: {email:"teste@gmail.com"}})).toBeTruthy();
		expect(response.statusCode).toEqual(201);
	});

});