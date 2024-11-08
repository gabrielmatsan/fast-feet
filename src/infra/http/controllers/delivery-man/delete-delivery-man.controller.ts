import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  HttpCode,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'
import { DeleteDeliveryManUseCase } from '@/domain/delivery/application/use-cases/delete-delivery-man'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt-strategy'

const deleteDeliveryManBodySchema = z.object({
  password: z.string().min(1),
})

type DeleteDeliveryManBodySchema = z.infer<typeof deleteDeliveryManBodySchema>

@Controller('/delivery-man')
export class DeleteDeliveryManController {
  constructor(private deleteDeliveryMan: DeleteDeliveryManUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(
    @Body(new ZodValidationPipe(deleteDeliveryManBodySchema))
    body: DeleteDeliveryManBodySchema,
    @CurrentUser() user: UserPayload,
  ) {
    const { password } = body

    console.log()
    console.log('Received body:', body)
    console.log('AQUI!!!')

    const result = await this.deleteDeliveryMan.execute({
      deliveryManId: user.sub,
      password,
    })

    if (result.isLeft()) {
      const error = result.value
      throw new BadRequestException(error.message)
    }
  }
}
