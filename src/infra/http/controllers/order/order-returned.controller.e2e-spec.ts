import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { RecipientFactory } from 'test/factories/make-recipient-factory'
import { JwtService } from '@nestjs/jwt'
import { CreateOrderUseCase } from '@/domain/delivery/application/use-cases/create-order'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { hash } from 'bcryptjs'
import { AddressFactory } from 'test/factories/make-address-factory'
import { OrderFactory } from 'test/factories/make-order-factory'
import { DeliveryManFactory } from 'test/factories/make-delivery-man-factory'

describe('OrderReturnedController (E2E)', () => {
  let app: INestApplication

  let recipientFactory: RecipientFactory
  let addressFactory: AddressFactory
  let orderFactory: OrderFactory
  let deliveryManFactory: DeliveryManFactory

  let jwtService: JwtService
  let prisma: PrismaService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        RecipientFactory,
        AddressFactory,
        CreateOrderUseCase,
        PrismaService,
        OrderFactory,
        DeliveryManFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()

    recipientFactory = moduleRef.get(RecipientFactory)
    addressFactory = moduleRef.get(AddressFactory)
    orderFactory = moduleRef.get(OrderFactory)
    deliveryManFactory = moduleRef.get(DeliveryManFactory)

    jwtService = moduleRef.get(JwtService)
    prisma = moduleRef.get(PrismaService)

    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  test('[PATCH] /orders/:id/returned', async () => {
    const recipient = await recipientFactory.makePrismaRecipient({
      password: await hash('123456', 8),
    })

    const address = await addressFactory.makePrismaAddress({
      recipientId: recipient.id,
    })

    const deliveryMan = await deliveryManFactory.makePrismaDeliveryMan({
      deliveryManLatitude: 90,
      deliveryManLongitude: 90,
    })
    const accessToken = jwtService.sign({ sub: deliveryMan.id.toString() })

    const order = await orderFactory.makeOrder({
      recipientId: recipient.id,
      addressId: address.id,
      status: 'pending',
      isRemovable: true,
      deliveryManId: deliveryMan.id,
    })

    const response = await request(app.getHttpServer())
      .patch(`/orders/${order.id.toString()}/returned`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    const orderOnDatabase = await prisma.order.findUnique({
      where: {
        id: order.id.toString(),
      },
    })
    expect(response.status).toBe(204)
    expect(orderOnDatabase?.status).toBe('returned')
  })
})
