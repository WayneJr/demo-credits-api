import { Logger, RequestMethod } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1', {
    exclude: [
      {
        path: '',
        method: RequestMethod.GET,
      },
    ],
  });
  const port = process.env.PORT || 3000;
  await app.listen(port);
  Logger.log(`Listening on port: ${port}`);
}
bootstrap();
