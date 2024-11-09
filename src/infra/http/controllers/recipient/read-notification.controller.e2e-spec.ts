import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { NotificationFactory } from 'test/factories/make-notification-factory'
import { RecipientFactory } from 'test/factories/make-recipient-factory'

describe('Read Notification (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let recipientFactory: RecipientFactory
  let notificationFactory: NotificationFactory

  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [NotificationFactory, RecipientFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    // prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)

    recipientFactory = moduleRef.get(RecipientFactory)
    notificationFactory = moduleRef.get(NotificationFactory)
    prisma = moduleRef.get(PrismaService)

    await app.init()
  })
  test('[PATCH] /notifications/:notificationId/read', async () => {
    const user = await recipientFactory.makePrismaRecipient()
    const accessToken = jwt.sign({ sub: user.id.toString() })

    const notification = await notificationFactory.makePrismaNotification({
      recipientId: user.id,
    })

    let onNotificationDatabase = await prisma.notification.findFirst({
      where: { recipientId: user.id.toString() },
    })
    console.log(onNotificationDatabase)

    const response = await request(app.getHttpServer())
      .patch(`/notifications/${notification.id.toString()}/read`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    console.log(response.body)

    expect(response.status).toBe(204)

    onNotificationDatabase = await prisma.notification.findFirst({
      where: { recipientId: user.id.toString() },
    })

    console.log(onNotificationDatabase)

    expect(onNotificationDatabase?.readAt).not.toBeNull()
  })
})
