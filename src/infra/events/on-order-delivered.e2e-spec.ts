import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { RecipientFactory } from 'test/factories/make-recipient-factory'
import { JwtService } from '@nestjs/jwt'
import { CreateOrderUseCase } from '@/domain/delivery/application/use-cases/create-order'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { AddressFactory } from 'test/factories/make-address-factory'
import { OrderFactory } from 'test/factories/make-order-factory'
import { DeliveryManFactory } from 'test/factories/make-delivery-man-factory'
import { DomainEvents } from '@/core/events/domain-events'
import { waitFor } from 'test/utils/wait-for'
import { AttachmentFactory } from 'test/factories/make-attachment-factory'

describe('On Order Delivered (E2E)', () => {
  let app: INestApplication

  let recipientFactory: RecipientFactory
  let addressFactory: AddressFactory
  let orderFactory: OrderFactory
  let deliveryManFactory: DeliveryManFactory
  let attachmentFactory: AttachmentFactory

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
        AttachmentFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()

    recipientFactory = moduleRef.get(RecipientFactory)
    addressFactory = moduleRef.get(AddressFactory)
    orderFactory = moduleRef.get(OrderFactory)
    deliveryManFactory = moduleRef.get(DeliveryManFactory)
    attachmentFactory = moduleRef.get(AttachmentFactory)

    jwtService = moduleRef.get(JwtService)
    prisma = moduleRef.get(PrismaService)

    DomainEvents.shouldRun = true

    await app.init()
  })

  it('should be send notification when order is delivered', async () => {
    const recipient = await recipientFactory.makePrismaRecipient()
    const address = await addressFactory.makePrismaAddress({
      recipientId: recipient.id,
    })
    const deliveryMan = await deliveryManFactory.makePrismaDeliveryMan({})
    const attachment = await attachmentFactory.makePrismaAttachment()
    const accessToken = jwtService.sign({ sub: deliveryMan.id.toString() })

    const order = await orderFactory.makeOrder({
      addressId: address.id,
      deliveryManId: deliveryMan.id,
      recipientId: recipient.id,
      status: 'inTransit',
    })

    await request(app.getHttpServer())
      .put(`/orders/${order.id.toString()}/delivered`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        attachmentsIds: [attachment.id.toString()],
      })

    await waitFor(async () => {
      const notificationOnDatabase = await prisma.notification.findFirst({
        where: {
          recipientId: recipient.id.toString(),
        },
      })

      expect(notificationOnDatabase).toBeTruthy()
      expect(notificationOnDatabase).not.toBeNull()
    })
  })
})
