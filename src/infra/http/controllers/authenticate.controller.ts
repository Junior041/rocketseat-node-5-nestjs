import { BadRequestException, Body, Controller, Post, UnauthorizedException, UsePipes } from '@nestjs/common';
import { z } from 'zod';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';
import { AuthenticateStudentUseCase } from '@/domain/forum/application/use-cases/authenticate-student';
import { WrongCredentialsError } from '@/domain/forum/application/use-cases/erros/wrong-credentials-error';
import { Public } from '@/infra/auth/public';

const authenticateControllerBodySchema = z.object({
	email: z.string().email(),
	password: z.string(),
});

type AuthenticateControllerBodySchema = z.infer<typeof authenticateControllerBodySchema>;

@Controller('/sessions')
@Public()
export class AuthenticateController {	
	constructor(
        private readonly authenticateStudent: AuthenticateStudentUseCase,
        
	){}

    @Post()
    @UsePipes(new ZodValidationPipe(authenticateControllerBodySchema))
	async handle(@Body() body: AuthenticateControllerBodySchema){
		const {email, password} = body;

		const result = await this.authenticateStudent.execute({
			email,
			password
		}); 

		if (result.isLeft()) {
			const error = result.value;
			switch (error.constructor) {
			case WrongCredentialsError:
				throw new UnauthorizedException(error.message);
			default:
				throw new BadRequestException(error.message);
			}
		}

		return {access_token: result.value.accessToken};
	}
}