import { faker } from '@faker-js/faker';

import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import {
	Student,
	StudentProps,
} from '@/domain/forum/enterprise/entities/student';

export function makeStudent(
	override: Partial<StudentProps> = {},
	id?: UniqueEntityID,
) {
	const student = Student.create(
		{
			email: override.email ?? faker.internet.email(),
			name: override.name ?? faker.person.fullName(),
			password: override.password ?? faker.internet.password(),
			...override,
		},
		id,
	);

	return student;
}
