import { Module } from '@nestjs/common'
import { BcryptHasher } from './bcrypt-hasher'
import { HashCompare } from '@/domain/delivery/criptography/hash-compare'
import { HashGenerator } from '@/domain/delivery/criptography/hash-generator'
import { Encrypter } from '@/domain/delivery/criptography/encrypter'
import { JwtEncripter } from './jwt-encripter'

@Module({
  providers: [
    {
      provide: HashGenerator,
      useClass: BcryptHasher,
    },
    {
      provide: HashCompare,
      useClass: BcryptHasher,
    },
    {
      provide: Encrypter,
      useClass: JwtEncripter,
    },
  ],
  exports: [HashCompare, HashGenerator, Encrypter],
})
export class CryptographyModule {}
