import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Student as StudentDomain} from '@/domain/forum/enterprise/entities/student';
import { User as StudentPrisma, Prisma }  from '@prisma/client';

export class PrismaStudentMapper{
	static toDomain(StudentPrisma: StudentPrisma): StudentDomain{
		return StudentDomain.create({
			email: StudentPrisma.email,
			name: StudentPrisma.name,
			password: StudentPrisma.password,
		}, new UniqueEntityID(StudentPrisma.id));
	}
	static toPrisma(StudentDomain: StudentDomain): Prisma.UserUncheckedCreateInput{
		return {
			id: StudentDomain.id.toString(),
			email: StudentDomain.email,
			name: StudentDomain.name,
			password: StudentDomain.password,
		};
	}
}