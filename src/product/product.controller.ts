import { Controller, Post, Body, Get, Delete, Param } from '@nestjs/common';
import { ProductService } from './product.service';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('import')
  async importProduct(@Body() productData: any) {
    const product = await this.productService.upsertProduct(productData);
    return product;
  }

  @Delete(':id')
  async deleteProduct(@Param('id') id: string) {
    await this.productService.deleteProduct(id);
    return { message: 'Product deleted successfully.' };
  }

  @Get(':id')
  async getProduct(@Param('id') id: string) {
    const product = await this.productService.getProductById(id);
    if (!product) {
      return { message: 'Product not found.' };
    }
    return product;
  }
}
