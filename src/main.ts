import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import bodyParser, * as bodyOarser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use('webhook/stripe', bodyParser.raw({ type: 'application/json' }));

  await app.listen(3010);
}
bootstrap();
