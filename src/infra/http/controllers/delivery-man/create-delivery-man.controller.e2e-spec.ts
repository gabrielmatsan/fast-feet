import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'

describe('Creatte Delivery Man E2E', () => {
  let app: INestApplication
  let prisma: PrismaService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)

    await app.init()
  })

  test('[POST] /delivery-man', async () => {
    const response = await request(app.getHttpServer())
      .post('/delivery-man')
      .send({
        cpf: '12345678901',
        name: 'John Doe',
        password: '123456',
        phone: '123456789',
        deliveryManLatitude: 0,
        deliveryManLongitude: 0,
      })

    expect(response.status).toBe(201)

    const deliveryManOnDatabase = await prisma.deliveryMan.findUnique({
      where: {
        cpf: '12345678901',
      },
    })

    expect(deliveryManOnDatabase).toBeTruthy()
  })
})
