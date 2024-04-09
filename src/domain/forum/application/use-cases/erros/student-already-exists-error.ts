import { UseCaseError } from '@/core/errors/use-case-error';

export class StudentAlreadyExistsError extends Error implements UseCaseError{
	constructor(identfier: string) {
		super(`Student "${identfier}" address already exists.`);
	}
}