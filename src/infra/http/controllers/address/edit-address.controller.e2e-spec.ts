import { INestApplication } from '@nestjs/common'
import request from 'supertest'
import { Test } from '@nestjs/testing'
import { AppModule } from '../../../app.module'
import { DatabaseModule } from '../../../database/database.module'
import { JwtService } from '@nestjs/jwt'
import { RecipientFactory } from 'test/factories/make-recipient-factory'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { AddressFactory } from 'test/factories/make-address-factory'
import { hash } from 'bcryptjs'

describe('Edit Address Controller (E2E)', () => {
  let app: INestApplication
  let recipientFactory: RecipientFactory
  let prisma: PrismaService
  let jwtService: JwtService
  let addressFactory: AddressFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [RecipientFactory, AddressFactory, PrismaService],
    }).compile()

    app = moduleRef.createNestApplication()
    recipientFactory = moduleRef.get(RecipientFactory)
    jwtService = moduleRef.get(JwtService)
    addressFactory = moduleRef.get(AddressFactory)

    prisma = moduleRef.get(PrismaService)

    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  test('[PUT] /address/:id - edit address', async () => {
    const plainPassword = '123456'
    const recipient = await recipientFactory.makePrismaRecipient({
      password: await hash(plainPassword, 8),
    })

    const accessToken = jwtService.sign({ sub: recipient.id.toString() })

    const address = await addressFactory.makePrismaAddress({
      recipientId: recipient.id,
    })

    let addressOnDatabase = await prisma.address.findUnique({
      where: {
        id: address.id.toString(),
      },
    })

    if (!addressOnDatabase) {
      throw new Error('Address not found')
    }

    expect(addressOnDatabase.id).toEqual(address.id.toString())

    await request(app.getHttpServer())
      .put(`/address/${address.id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        street: '123 Example Street',
        number: '456',
        zipcode: '12345-678',
        city: 'Example City',
        state: 'EX',
        complement: 'Apt 789',
        neighborhood: 'Example Neighborhood',
        latitude: -23.55052,
        longitude: -46.633308,
      })

    addressOnDatabase = await prisma.address.findUnique({
      where: {
        id: address.id.toString(),
        zipcode: '12345-678',
      },
    })

    if (!addressOnDatabase) {
      throw new Error('Address not found')
    }

    expect(addressOnDatabase).toBeTruthy()
    expect(addressOnDatabase?.zipcode).toEqual('12345-678')
  })
})
