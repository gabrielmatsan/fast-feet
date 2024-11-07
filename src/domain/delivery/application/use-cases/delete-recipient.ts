import { Either, left, right } from '@/core/either'
import { RecipientRepository } from '../repositories/recipient-repository'
import { WrongCredentialsError } from './error/wrong-credentials-error'
import { HashCompare } from '../../criptography/hash-compare'
import { Injectable } from '@nestjs/common'

export interface DeleteRecipientRequest {
  recipientId: string
  password: string
}

type DeleteRecipientResponse = Either<WrongCredentialsError, null>

@Injectable()
export class DeleteRecipientUseCase {
  constructor(
    private recipientRepository: RecipientRepository,
    private hashComparer: HashCompare,
  ) {}

  async execute({
    recipientId,
    password,
  }: DeleteRecipientRequest): Promise<DeleteRecipientResponse> {
    const recipient = await this.recipientRepository.findById(recipientId)

    if (!recipient) {
      return left(new WrongCredentialsError())
    }

    const isPasswordValid = await this.hashComparer.compare(
      password,
      recipient.password,
    )

    if (!isPasswordValid) {
      return left(new WrongCredentialsError())
    }

    await this.recipientRepository.delete(recipient)

    return right(null)
  }
}
