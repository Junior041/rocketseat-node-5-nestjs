import { RegisterStudentUseCase } from './register-student';
import { InMemoryStudentRepository } from 'test/repositories/in-memory-students-repository';
import { FakeHasher } from 'test/cryptography/fake-hasher';

let inMemoryStudentRepository: InMemoryStudentRepository;
let fakeHasher: FakeHasher;
let sut: RegisterStudentUseCase;

describe('Register Student', () => {
	beforeEach(() => {
		inMemoryStudentRepository = new InMemoryStudentRepository();
		fakeHasher = new FakeHasher();
		sut = new RegisterStudentUseCase(inMemoryStudentRepository,fakeHasher);
	});

	it('should be able to register a new student', async () => {
		const result = await sut.execute({
			email: 'any_email',
			name: 'any_name',
			password:'any_password'
		});

		expect(result.isRight()).toBeTruthy();
		expect(result.value).toEqual({
			student: inMemoryStudentRepository.items[0]
		});
	});

	it('should hash student password upon registration', async () => {
		const result = await sut.execute({
			email: 'any_email',
			name: 'any_name',
			password:'any_password'
		});

		expect(result.isRight()).toBeTruthy();
		expect(inMemoryStudentRepository.items[0].password).toEqual('any_password-hashed');
	});
});
