import { Module } from "@nestjs/common";
import { CreateAccountController } from "./controllers/create-account.controller";
import { AuthenticateController } from "./controllers/authenticate.controller";
import { CreateQuestionController } from "./controllers/create-question.controller";
import { FetchListenQuestionController } from "./controllers/featch-listen-question.controller";
import { DatabaseModule } from "../database/prisma/database.module";
@Module({
	imports: [
		DatabaseModule
	],
	controllers: [
		CreateAccountController, 
		AuthenticateController,
		CreateQuestionController,
		FetchListenQuestionController,
	],
})
export class HttpModule{}