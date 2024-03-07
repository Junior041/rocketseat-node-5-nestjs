/* eslint-disable no-mixed-spaces-and-tabs */
import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { JwtAuthGuard } from "@/infra/auth/jwt-auth.guard";
import { UserPayload } from "@/infra/auth/jwt.strategy";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import { PrismaService } from "@/infra/prisma/prisma.service";
import { z } from "zod";

const createquestionBodySchema = z.object({
	title: z.string(),
	content: z.string(),
});

type CreatequestionBodySchema = z.infer<typeof createquestionBodySchema>;

@Controller("/questions")
@UseGuards(JwtAuthGuard)
export class CreateQuestionController {
	constructor(private prisma: PrismaService) {}

  @Post()
	async handle(@CurrentUser() user: UserPayload, @Body(new ZodValidationPipe(createquestionBodySchema)) body: CreatequestionBodySchema) {
		const { title, content } = body;

		await this.prisma.question.create({
			data: {
				authorId: user.sub,
				content,
				title,
				slug: this.convertToSlug(title),
			},
		});

		return "ok";
	}

  private convertToSlug(title: string): string {
  	return title
  		.toLowerCase()
  		.normalize("NFD")
  		.replace(/[\u0300-\u036f]/g, "")
  		.replace(/[^\w\s-]/g, "")
  		.replace(/\s+/g, "-");
  }
}
