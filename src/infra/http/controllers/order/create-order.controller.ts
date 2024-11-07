import { CreateOrderUseCase } from '@/domain/delivery/application/use-cases/create-order'
import { BadRequestException, Body, Controller, Post } from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt-strategy'

const orderBodyValidationSchema = z.object({
  deliveryManId: z.string().nullable().optional(),
  addressId: z.string(),
  title: z.string(),
  content: z.string(),
  status: z.enum(['pending', 'awaiting', 'inTransit', 'delivered', 'returned']),
  isRemovable: z.boolean(),
  paymentMethod: z.string(),
  deliveryLatitude: z.number().refine((value) => {
    return Math.abs(value) <= 90
  }),
  deliveryLongitude: z.number().refine((value) => {
    return Math.abs(value) <= 180
  }),
  shipping: z.number(),
})

type OrderBodyValidationSchema = z.infer<typeof orderBodyValidationSchema>

@Controller('/orders')
export class CreateOrderController {
  constructor(private createOrder: CreateOrderUseCase) {}

  @Post()
  async handle(
    @Body(new ZodValidationPipe(orderBodyValidationSchema))
    body: OrderBodyValidationSchema,
    @CurrentUser() user: UserPayload,
  ) {
    const {
      addressId,
      title,
      content,
      status,
      isRemovable,
      paymentMethod,
      deliveryLatitude,
      deliveryLongitude,
      shipping,
    } = body

    const result = await this.createOrder.execute({
      addressId,
      title,
      content,
      status,
      isRemovable,
      paymentMethod,
      deliveryLatitude,
      deliveryLongitude,
      shipping,
      recipientId: user.sub,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
