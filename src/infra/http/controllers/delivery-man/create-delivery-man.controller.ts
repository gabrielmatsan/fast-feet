import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
  UsePipes,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'
import { Public } from '@/infra/auth/public'
import { CreateDeliveryManUseCase } from '@/domain/delivery/application/use-cases/create-delivery-man'
import { DeliveryManAlreadyExistsError } from '@/domain/delivery/application/use-cases/error/delivery-man-already-exists-error'

const createDeliveryManBodySchema = z.object({
  cpf: z.string(),
  name: z.string(),
  password: z.string(),
  phone: z.string(),
  deliveryManLatitude: z.number().refine((value) => {
    return Math.abs(value) <= 90
  }),
  deliveryManLongitude: z.number().refine((value) => {
    return Math.abs(value) <= 180
  }),
})

type CreateDeliveryManBodySchema = z.infer<typeof createDeliveryManBodySchema>

@Controller('/delivery-man')
export class CreateDeliveryManController {
  constructor(private createDeliveryMan: CreateDeliveryManUseCase) {}

  @Post()
  @Public()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createDeliveryManBodySchema))
  async handle(@Body() body: CreateDeliveryManBodySchema) {
    const {
      name,
      cpf,
      password,
      phone,
      deliveryManLatitude,
      deliveryManLongitude,
    } = body

    const result = await this.createDeliveryMan.execute({
      name,
      cpf,
      password,
      phone,
      deliveryManLatitude,
      deliveryManLongitude,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case DeliveryManAlreadyExistsError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
