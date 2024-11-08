import { DeleteRecipientUseCase } from '@/domain/delivery/application/use-cases/delete-recipient'
import {
  Body,
  Controller,
  Delete,
  HttpCode,
  BadRequestException,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt-strategy'

const deleteRecipientBodySchema = z.object({
  password: z.string().min(1),
})

type DeleteRecipientBodySchema = z.infer<typeof deleteRecipientBodySchema>

@Controller('/recipient')
export class DeleteRecipientController {
  constructor(private deleteRecipient: DeleteRecipientUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(
    @Body(new ZodValidationPipe(deleteRecipientBodySchema))
    body: DeleteRecipientBodySchema,
    @CurrentUser() user: UserPayload,
  ) {
    const { password } = body

    const result = await this.deleteRecipient.execute({
      recipientId: user.sub,
      password,
    })

    if (result.isLeft()) {
      const error = result.value
      throw new BadRequestException(error.message)
    }
  }
}
