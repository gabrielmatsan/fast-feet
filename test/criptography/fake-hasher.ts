import { HashCompare } from '@/domain/delivery/criptography/hash-compare'
import { HashGenerator } from '@/domain/delivery/criptography/hash-generator'

export class FakeHasher implements HashCompare, HashGenerator {
  async hash(plain: string): Promise<string> {
    return plain.concat('-hashed')
  }

  async compare(plain: string, hash: string): Promise<boolean> {
    return plain.concat('-hashed') === hash
  }
}
