import { OrderTransitUseCase } from '@/domain/delivery/application/use-cases/order-in-transit'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt-strategy'
import {
  BadRequestException,
  Controller,
  HttpCode,
  Param,
  Patch,
} from '@nestjs/common'

@Controller('/orders/:id/in-transit')
export class OrderInTransitController {
  constructor(private orderInTransitUseCase: OrderTransitUseCase) {}

  @Patch()
  @HttpCode(204)
  async handle(@Param('id') orderId: string, @CurrentUser() user: UserPayload) {
    const deliveryManId = user.sub

    const response = await this.orderInTransitUseCase.execute({
      orderId,
      deliveryManId,
    })

    if (response.isLeft()) {
      throw new BadRequestException(response.value.message)
    }
  }
}
