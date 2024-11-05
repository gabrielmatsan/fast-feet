import { Either, left, right } from '@/core/either'
import { WrongCredentialsError } from './error/wrong-credentials-error'
import { ResourceNotFoundError } from './error/resource-not-found-error'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { DeliveryManRepository } from '../repositories/delivery-man-repository'
import { HashCompare } from '../../criptography/hash-compare'

export interface DeleteDeliveryManRequest {
  deliveryManId: string
  password: string
}

type DeleteDeliveryManResponse = Either<
  WrongCredentialsError | ResourceNotFoundError | NotAllowedError,
  null
>

export class DeleteDeliveryManUseCase {
  constructor(
    private deliveryManRepository: DeliveryManRepository,
    private hashComparer: HashCompare,
  ) {}

  async execute({
    deliveryManId,
    password,
  }: DeleteDeliveryManRequest): Promise<DeleteDeliveryManResponse> {
    const deliveryMan = await this.deliveryManRepository.findById(deliveryManId)

    if (!deliveryMan) {
      return left(new ResourceNotFoundError())
    }

    const isPasswordValid = await this.hashComparer.compare(
      password,
      deliveryMan.password,
    )

    if (!isPasswordValid) {
      return left(new WrongCredentialsError())
    }

    await this.deliveryManRepository.delete(deliveryMan)

    return right(null)
  }
}
