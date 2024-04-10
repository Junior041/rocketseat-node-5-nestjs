
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { QuestionAttachment as QuestionAttachmentDomain} from '@/domain/forum/enterprise/entities/question-attachment';

import { Attachment as PrismaAttachment }  from '@prisma/client';

export class PrismaQuestionAttachmentMapper{
	static toDomain(QuestionAttachmentPrisma: PrismaAttachment): QuestionAttachmentDomain{

		if (!QuestionAttachmentPrisma.questionId) {
			throw new Error('Invalid comment type.');
		}

		return QuestionAttachmentDomain.create({
			attachmentId: new UniqueEntityID(QuestionAttachmentPrisma.id),
			questionId: new UniqueEntityID(QuestionAttachmentPrisma.questionId),
		}, new UniqueEntityID(QuestionAttachmentPrisma.id));
	}
	
}