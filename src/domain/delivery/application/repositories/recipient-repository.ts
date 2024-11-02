import { Recipient } from "../../enterprise/entities/recipient";

export abstract class RecipientRepository {
  abstract create(recipient: Recipient): Promise<void>
  abstract update(recipient: Recipient): Promise<void>
  abstract delete(recipient: Recipient): Promise<void>
  abstract findById(id: string): Promise<Recipient | null>
  abstract findByCpf(cpf: string): Promise<Recipient | null>
  abstract findByEmail(email: string): Promise<Recipient | null>
}