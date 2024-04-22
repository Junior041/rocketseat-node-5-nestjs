import { InMemoryStudentRepository } from 'test/repositories/in-memory-students-repository';
import { FakeHasher } from 'test/cryptography/fake-hasher';
import { AuthenticateStudentUseCase } from './authenticate-student';
import { FakeEncrypter } from 'test/cryptography/fake-encrypter';
import { makeStudent } from 'test/factories/make-student';

let inMemoryStudentRepository: InMemoryStudentRepository;
let fakeEncrypter: FakeEncrypter;
let fakeHasher: FakeHasher;
let sut: AuthenticateStudentUseCase;

describe('Authenticate Student', () => {
	beforeEach(() => {
		inMemoryStudentRepository = new InMemoryStudentRepository();
		fakeEncrypter = new FakeEncrypter();
		fakeHasher = new FakeHasher();
		sut = new AuthenticateStudentUseCase(inMemoryStudentRepository,fakeHasher,fakeEncrypter);
	});

	it('should be able to authenticate a student', async () => {
		const student = makeStudent({
			email: 'any_email@gmail.com',
			name: 'any_name',
			password: await fakeHasher.hash('any_password'),
		});
        
		inMemoryStudentRepository.items.push(student);

		const result = await sut.execute({
			email: 'any_email@gmail.com',
			password:'any_password'
		});
        
		expect(result.isRight()).toBeTruthy();
		expect(result.value).toEqual({
			accessToken: expect.any(String)
		});
	});

});
