import { Module } from '@nestjs/common';
import { CreateAccountController } from './controllers/create-account.controller';
import { AuthenticateController } from './controllers/authenticate.controller';
import { CreateQuestionController } from './controllers/create-question.controller';
import { FetchListenQuestionsController } from './controllers/fetch-listen-questions.controller';
import { DatabaseModule } from '../database/databae.module';
import { CreateQuestionUseCase } from '@/domain/forum/application/use-cases/create-question';
import { FetchRecentQuestionsUseCase } from '@/domain/forum/application/use-cases/fetch-recent-questions';
import { RegisterStudentUseCase } from '@/domain/forum/application/use-cases/register-student';
import { AuthenticateStudentUseCase } from '@/domain/forum/application/use-cases/authenticate-student';
import { cryptographyModule } from '../cryptography/cryptography.module';

@Module({
	imports: [DatabaseModule, cryptographyModule],
	controllers: [
		CreateAccountController,
		AuthenticateController,
		CreateQuestionController,
		FetchListenQuestionsController
	],
	providers: [
		CreateQuestionUseCase,
		FetchRecentQuestionsUseCase,
		RegisterStudentUseCase,
		AuthenticateStudentUseCase
	]
})
export class HttpModule{}