import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  HttpCode,
  UsePipes,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'
import { DeleteDeliveryManUseCase } from '@/domain/delivery/application/use-cases/delete-delivery-man'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt-strategy'

const deleteDeliveryManBodySchema = z.object({
  password: z.string(),
})

type DeleteDeliveryManBodySchema = z.infer<typeof deleteDeliveryManBodySchema>

@Controller('/delivery-man')
export class DeleteDeliveryManController {
  constructor(private deleteDeliveryMan: DeleteDeliveryManUseCase) {}

  @Delete()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(deleteDeliveryManBodySchema))
  async handle(
    @Body()
    body: DeleteDeliveryManBodySchema,
    @CurrentUser() user: UserPayload,
  ) {
    console.log('Received body:', body)
    console.log('AQUI!!!')

    const { password } = body

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
