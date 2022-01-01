import * as helmet from 'helmet';

import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { PLogger } from './common/PLogger';

async function bootstrap() {
  const start = Date.now();
  const logger = new PLogger('BOOTSTRAP');
  const app = await NestFactory.create(AppModule, {
    logger,
  });
  const port = process.env.PORT || 3000;
  app.use(helmet());
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  await app.listen(port);
  logger.debug(`Started core systems in ${Date.now() - start}ms`);
  logger.debug(`Server running at: http://localhost:${port}`);
}
bootstrap();
