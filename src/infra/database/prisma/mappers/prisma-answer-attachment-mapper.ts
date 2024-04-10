

import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { AnswerAttachment as AnswerAttachmentDomain} from '@/domain/forum/enterprise/entities/answer-attachment';

import { Attachment as PrismaAttachment }  from '@prisma/client';

export class PrismaAnswerAttachmentMapper{
	static toDomain(AnswerAttachmentPrisma: PrismaAttachment): AnswerAttachmentDomain{

		if (!AnswerAttachmentPrisma.answerId) {
			throw new Error('Invalid comment type.');
		}

		return AnswerAttachmentDomain.create({
			attachmentId: new UniqueEntityID(AnswerAttachmentPrisma.id),
			answerId: new UniqueEntityID(AnswerAttachmentPrisma.answerId),
		}, new UniqueEntityID(AnswerAttachmentPrisma.id));
	}
	
}