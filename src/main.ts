import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { setupSwagger } from './swagger';

async function bootstrap() {
  const PORT = process.env.PORT || 5000;
  const app = await NestFactory.create(AppModule);

  setupSwagger(app);

  app.use(cookieParser());

  await app.listen(PORT, () => console.log(`Server started on port = ${PORT}`));
}

bootstrap();
