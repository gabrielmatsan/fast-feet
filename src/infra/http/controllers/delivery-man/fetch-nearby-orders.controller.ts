import { FetchNearbyOrdersUseCase } from '@/domain/delivery/application/use-cases/fetch-nearby-orders'
import { BadRequestException, Body, Controller, Get } from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import type { UserPayload } from '@/infra/auth/jwt-strategy'
import { HttpOrdersPresenter } from '../../presenters/http-orders-presenter'

const fetchNearbyOrdersBodySchema = z.object({
  maxDistance: z.number(),
  deliveryManlatitude: z.number().refine((value) => {
    return Math.abs(value) <= 90
  }),
  deliveryManlongitude: z.number().refine((value) => {
    return Math.abs(value) <= 180
  }),
})

type FetchNearbyOrdersBody = z.infer<typeof fetchNearbyOrdersBodySchema>

@Controller('/delivery-man/fetch-nearby-orders')
export class FetchNearbyOrdersController {
  constructor(private fetchNearbyOrdersUseCase: FetchNearbyOrdersUseCase) {}

  @Get()
  async handle(
    @Body(new ZodValidationPipe(fetchNearbyOrdersBodySchema))
    body: FetchNearbyOrdersBody,
    @CurrentUser() user: UserPayload,
  ) {
    const { maxDistance, deliveryManlatitude, deliveryManlongitude } = body
    const deliveryManId = user.sub

    const result = await this.fetchNearbyOrdersUseCase.execute({
      deliveryManId,
      deliveryManlatitude,
      deliveryManlongitude,
      maxDistance,
    })

    if (result.isLeft()) {
      throw new BadRequestException(result.value.message)
    }

    const orders = result.value.orders
    return {
      orders: orders.map((order) => HttpOrdersPresenter.toHttp(order)),
    }
  }
}
