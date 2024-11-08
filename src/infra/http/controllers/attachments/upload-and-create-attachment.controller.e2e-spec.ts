import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { DeliveryManFactory } from 'test/factories/make-delivery-man-factory'
// import { PrismaService } from '@/infra/database/prisma/prisma.service'
// caso nao tivesse factory, seria dessa forma

describe('Upload Attachment (E2E)', () => {
  let app: INestApplication
  // let prisma: PrismaService eslint-disable-line
  let deliveryManFactory: DeliveryManFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [DeliveryManFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    // prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)

    deliveryManFactory = moduleRef.get(DeliveryManFactory)

    await app.init()
  })
  test('[POST] /attachments', async () => {
    const user = await deliveryManFactory.makePrismaDeliveryMan()

    const accessToken = jwt.sign({ sub: user.id.toString() })

    const response = await request(app.getHttpServer())
      .post(`/attachments`)
      .set('Authorization', `Bearer ${accessToken}`)
      .attach('file', './test/e2e/my-img-test.jpg')

    expect(response.status).toBe(201)
    expect(response.body).toEqual({
      attachmentId: expect.any(String),
    })
  })
})
