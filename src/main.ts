import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TaskService } from './services/task.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  const configService = app.get(ConfigService);
  const mongoUri = configService.get<string>('MONGODB_URI');

  if (!mongoUri) {
    logger.error('MONGODB_URI is not set in the environment variables');
    process.exit(1);
  }

  logger.log(`Connecting to MongoDB at: ${mongoUri}`);

  await app.listen(3000);
  logger.log(`Application is running on: ${await app.getUrl()}`);

  const taskService = app.get(TaskService);
  await taskService.handleCron();
}
bootstrap();
