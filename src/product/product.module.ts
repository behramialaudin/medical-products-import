import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { Product, ProductSchema } from './product.schema';
import { VendorModule } from '../vendor/vendor.module';
import { ManufacturerModule } from '../manufacturer/manufacturer.module';
import { FileService } from '../services/file.service';
import { GPTService } from '../services/gpt.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    VendorModule,
    ManufacturerModule,
  ],
  controllers: [ProductController],
  providers: [ProductService, FileService, GPTService],
  exports: [ProductService],
})
export class ProductModule {}
