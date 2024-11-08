import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { hash } from 'bcryptjs'
import { DeliveryManFactory } from 'test/factories/make-delivery-man-factory'
import { JwtService } from '@nestjs/jwt'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

describe('Delete Delivery Man E2E', () => {
  let app: INestApplication
  let deliveryManFactory: DeliveryManFactory
  let jwtService: JwtService
  let prisma: PrismaService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [DeliveryManFactory, PrismaService],
    }).compile()

    app = moduleRef.createNestApplication()
    deliveryManFactory = moduleRef.get(DeliveryManFactory)
    jwtService = moduleRef.get(JwtService)
    prisma = moduleRef.get(PrismaService)

    await app.init()
  })

  test.only('[DELETE] /delivery-man', async () => {
    const plainPassword = '123456'
    const deliveryMan = await deliveryManFactory.makePrismaDeliveryMan({
      password: await hash(plainPassword, 8),
    })

    let deliveryManOnDatabase = await prisma.deliveryMan.findUnique({
      where: {
        id: deliveryMan.id.toString(),
      },
    })

    expect(deliveryManOnDatabase).toBeTruthy()

    const accessToken = jwtService.sign({ sub: deliveryMan.id.toString() })

    await request(app.getHttpServer())
      .delete('/delivery-man')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        password: plainPassword,
      })

    deliveryManOnDatabase = await prisma.deliveryMan.findUnique({
      where: {
        id: deliveryMan.id.toString(),
      },
    })

    expect(deliveryManOnDatabase).toBeNull()
  })
})
