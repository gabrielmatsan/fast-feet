import { CreateAddressUseCase } from '@/domain/delivery/application/use-cases/create-address'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import type { UserPayload } from '@/infra/auth/jwt-strategy'
import { BadRequestException, Body, Controller, Post } from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const addressBodyValidationSchema = z.object({
  recipientId: z.string(),
  street: z.string(),
  number: z.string(),
  zipcode: z.string(),
  city: z.string(),
  state: z.string(),
  complement: z.string(),
  neighborhood: z.string(),
  latitude: z.number().refine((value) => {
    return Math.abs(value) <= 90
  }),
  longitude: z.number().refine((value) => {
    return Math.abs(value) <= 180
  }),
})

type AddressBodyValidationSchema = z.infer<typeof addressBodyValidationSchema>

@Controller('/addresses')
export class CreateAddressController {
  constructor(private createAddress: CreateAddressUseCase) {}

  @Post()
  async handle(
    @Body(new ZodValidationPipe(addressBodyValidationSchema))
    body: AddressBodyValidationSchema,
    @CurrentUser() user: UserPayload, // Usado para obter o `recipientId`
  ) {
    const { street, number, zipcode, city, state, complement, neighborhood } =
      body

    const result = await this.createAddress.execute({
      recipientId: user.sub, // Definido internamente
      street,
      number,
      zipcode,
      city,
      state,
      complement,
      neighborhood,
      latitude: body.latitude,
      longitude: body.longitude,
    })

    if (result.isLeft()) {
      const error = result.value
      throw new BadRequestException(error.message)
    }

    return { message: 'Endereço criado com sucesso' }
  }
}
