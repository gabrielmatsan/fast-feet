import { OrderDeliveredUseCase } from '@/domain/delivery/application/use-cases/order-delivered'
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Put,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt-strategy'

const orderDeliveredBodySchema = z.object({
  attachmentsIds: z.array(z.string().uuid()),
})

type OrderDeliveredBodySchema = z.infer<typeof orderDeliveredBodySchema>

@Controller('/orders/:id/delivered')
export class OrderDeliveredController {
  constructor(private orderDelivered: OrderDeliveredUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @Param('id') orderId: string,
    @Body(new ZodValidationPipe(orderDeliveredBodySchema))
    body: OrderDeliveredBodySchema,
    @CurrentUser() user: UserPayload,
  ) {
    const { attachmentsIds } = body

    const deliveryManId = user.sub

    const result = await this.orderDelivered.execute({
      deliveryManId,
      orderId,
      attachmentIds: attachmentsIds,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
