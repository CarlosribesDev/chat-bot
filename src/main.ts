import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';


async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(), { logger: ['error', 'warn', 'log', 'debug', 'verbose'] },
  );
  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}
bootstrap();