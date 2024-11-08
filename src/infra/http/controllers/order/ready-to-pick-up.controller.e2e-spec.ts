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

describe('ReadyToPickUpController (E2E)', () => {
  let app: INestApplication

  let recipientFactory: RecipientFactory
  let addressFactory: AddressFactory
  let orderFactory: OrderFactory

  let prisma: PrismaService
  let jwtService: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        RecipientFactory,
        AddressFactory,
        CreateOrderUseCase,
        PrismaService,
        OrderFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()

    recipientFactory = moduleRef.get(RecipientFactory)
    addressFactory = moduleRef.get(AddressFactory)
    orderFactory = moduleRef.get(OrderFactory)

    jwtService = moduleRef.get(JwtService)
    prisma = moduleRef.get(PrismaService)

    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  test('[PATCH] /orders/:id/ready-to-pick-up', async () => {
    const recipient = await recipientFactory.makePrismaRecipient({
      password: await hash('123456', 8),
    })

    const accessToken = jwtService.sign({ sub: recipient.id.toString() })

    const address = await addressFactory.makePrismaAddress({
      recipientId: recipient.id,
    })

    const order = await orderFactory.makeOrder({
      recipientId: recipient.id,
      addressId: address.id,
      status: 'pending',
      isRemovable: false,
    })

    const response = await request(app.getHttpServer())
      .patch(`/orders/${order.id.toString()}/ready-to-pick-up`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    // Verificar se a resposta tem o status e estrutura corretos
    expect(response.status).toBe(204)

    // Verificar se o pedido foi salvo no banco de dados
    const onOrderDatabase = await prisma.order.findFirst({
      where: {
        id: order.id.toString(),
      },
    })
    expect(onOrderDatabase).toBeTruthy()
    expect(onOrderDatabase?.isRemovable).toBe(true)
  })

  test('[POST] /orders - unauthorized access', async () => {
    // Enviar uma requisição sem o cabeçalho de autorização
    const response = await request(app.getHttpServer()).post('/orders').send({
      deliveryManId: null,
      addressId: 'some-address-id', // Substitua por um ID válido de endereço
      title: 'Order Title',
      content: 'Order Content',
      status: 'pending',
      isRemovable: true,
      paymentMethod: 'credit_card',
      expectedDeliveryDate: new Date(),
      deliveryLatitude: -23.55052,
      deliveryLongitude: -46.633308,
      shipping: 15.0,
    })

    // Verificar se a resposta é não autorizada
    expect(response.status).toBe(401)
    expect(response.body).toHaveProperty('message')
    expect(response.body.message).toBe('Unauthorized')
  })
})
