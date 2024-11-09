import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { envSchema } from './env/env'
import { DatabaseModule } from './database/database.module'
import { HttpModule } from './http/http.module'
import { EnvModule } from './env/env.module'
import { AuthModule } from './auth/auth.module'
import { EventsModule } from './events/events.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    DatabaseModule,
    HttpModule,
    EnvModule,
    AuthModule,
    EventsModule,
  ],
})
export class AppModule {}
