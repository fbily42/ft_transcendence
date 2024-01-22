import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
	whitelist: true,
  	}),
  );
  app.enableCors({
    credentials: true,
    origin: process.env.FRONTEND_URL,
  });
  app.use(cookieParser());
  await app.listen(3000);
}
bootstrap();
