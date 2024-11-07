import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'

describe('Creatte Recipient E2E', () => {
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

  test('[POST] /recipients', async () => {
    const response = await request(app.getHttpServer())
      .post('/recipients')
      .send({
        name: 'John Doe',
        email: 'johndoe@ex.com',
        phone: '123456789',
        cpf: '12345678901',
        password: '123456',
      })

    expect(response.status).toBe(201)

    const recipientOnDatabase = await prisma.recipient.findUnique({
      where: {
        cpf: '12345678901',
      },
    })

    expect(recipientOnDatabase).toBeTruthy()
  })
})
