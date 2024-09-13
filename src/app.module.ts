import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ProductModule } from './product/product.module';
import { VendorModule } from './vendor/vendor.module';
import { ManufacturerModule } from './manufacturer/manufacturer.module';
import { FileService } from './services/file.service';
import { GPTService } from './services/gpt.service';
import { TaskService } from './services/task.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    ScheduleModule.forRoot(),
    ProductModule,
    VendorModule,
    ManufacturerModule,
  ],
  providers: [FileService, GPTService, TaskService],
})
export class AppModule {}
