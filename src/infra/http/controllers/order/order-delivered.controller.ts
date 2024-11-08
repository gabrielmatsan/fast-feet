import { OrderDeliveredUseCase } from '@/domain/delivery/application/use-cases/order-delivered'
import {
  BadRequestException,
  Body,
  Controller,
  Param,
  Put,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt-strategy'

const orderDeliveredBodySchema = z.object({
  attachments: z.array(z.string().uuid()),
})

type OrderDeliveredBodySchema = z.infer<typeof orderDeliveredBodySchema>

@Controller('/orders/:id/delivered')
export class OrderDeliveredController {
  constructor(private orderDelivered: OrderDeliveredUseCase) {}

  @Put()
  async handle(
    @Param('id') orderId: string,
    @Body(new ZodValidationPipe(orderDeliveredBodySchema))
    body: OrderDeliveredBodySchema,
    @CurrentUser() user: UserPayload,
  ) {
    const { attachments } = body

    const deliveryManId = user.sub

    const result = await this.orderDelivered.execute({
      deliveryManId,
      orderId,
      attachmentIds: attachments,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
