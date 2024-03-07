import { Module } from "@nestjs/common";
import { CreateAccountController } from "./controllers/create-account.controller";
import { AuthenticateController } from "./controllers/authenticate.controller";
import { CreateQuestionController } from "./controllers/create-question.controller";
import { FetchListenQuestionController } from "./controllers/featch-listen-question.controller";
import { PrismaService } from "../prisma/prisma.service";
@Module({
	controllers: [
		CreateAccountController, 
		AuthenticateController,
		CreateQuestionController,
		FetchListenQuestionController,
	],
	providers: [PrismaService]
})
export class HttpModule{}