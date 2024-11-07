import { Either, left, right } from '@/core/either'
import { DeliveryMan } from '../../enterprise/entities/delivery-man'
import { DeliveryManRepository } from '../repositories/delivery-man-repository'
import { DeliveryManAlreadyExistsError } from './error/delivery-man-already-exists-error'
import { Injectable } from '@nestjs/common'

export interface CreateDeliveryManRequest {
  cpf: string
  name: string
  password: string
  phone: string
  deliveryManLatitude: number
  deliveryManLongitude: number
}

type CreateDeliveryManResponse = Either<
  DeliveryManAlreadyExistsError,
  {
    deliveryMan: DeliveryMan
  }
>

@Injectable()
export class CreateDeliveryManUseCase {
  constructor(private deliveryManRepository: DeliveryManRepository) {}

  async execute({
    cpf,
    name,
    password,
    phone,
    deliveryManLatitude,
    deliveryManLongitude,
  }: CreateDeliveryManRequest): Promise<CreateDeliveryManResponse> {
    // verifica se o destinatario ja existe
    const isDeliveryManAlreadyExists =
      await this.deliveryManRepository.findByCpf(cpf)

    // se existe retorna erro
    if (isDeliveryManAlreadyExists) {
      return left(new DeliveryManAlreadyExistsError())
    }

    // cria o destinatario
    const deliveryMan = DeliveryMan.create({
      name,
      cpf,
      password,
      phone,
      deliveryManLatitude,
      deliveryManLongitude,
    })

    // salva o destinatario
    await this.deliveryManRepository.create(deliveryMan)

    // retorna o destinatario criado
    return right({ deliveryMan })
  }
}
