import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { KnexModule } from 'nest-knexjs';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import config from './config/config';
import knexConfig from '../knexfile';

@Module({
  imports: [
    KnexModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async () => ({
        config: knexConfig[process.env.NODE_ENV],
      }),
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `${process.cwd()}/src/config/env/${
        process.env.NODE_ENV
      }.env`,
      load: [config],
    }),
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
