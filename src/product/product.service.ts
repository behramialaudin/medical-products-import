import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './product.schema';
import { VendorService } from '../vendor/vendor.service';
import { ManufacturerService } from '../manufacturer/manufacturer.service';
import { FileService } from '../services/file.service';
import { GPTService } from '../services/gpt.service';
import { nanoid } from 'nanoid';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    private vendorService: VendorService,
    private manufacturerService: ManufacturerService,
    private fileService: FileService,
    private gptService: GPTService,
  ) {}

  async upsertProduct(productData: any): Promise<Product> {
    const vendorId = await this.vendorService.upsertVendor(productData.vendor);
    const manufacturerId = await this.manufacturerService.upsertManufacturer(
      productData.manufacturer,
    );

    const { _id, ...updateData } = productData;
    if (!updateData.docId) {
      updateData.docId = nanoid();
    }

    return this.productModel
      .findOneAndUpdate(
        { productId: updateData.productId },
        { ...updateData, vendorId, manufacturerId },
        { upsert: true, new: true },
      )
      .exec();
  }

  async scheduledProductImport() {
    try {
      console.log('Starting scheduled product import process');
      const products = await this.fileService.readProductsCSV();

      for (const product of products) {
        const productData = {
          productId: product.ProductID,
          name: product.Name,
          description: product.Description,
          category: product.Category,
          vendor: { vendorId: product.VendorID },
          manufacturer: { manufacturerId: product.ManufacturerID },
          variants: [
            {
              itemId: product.ItemID,
              description: product.ItemDescription,
              packaging: product.Packaging,
            },
          ],
          options: this.parseOptions(product),
        };

        try {
          productData.description = await this.gptService.enhanceDescription(
            productData.name,
            productData.description,
            productData.category,
          );
        } catch (innerError) {
          console.log(
            `Error enhancing description for product ID ${productData.productId}:`,
            innerError,
          );
        }

        await this.upsertProduct(productData);
      }

      console.log('Completed scheduled product import');
    } catch (error) {
      console.error('Error in scheduledProductImport:', error);
    }
  }

  private parseOptions(
    product: any,
  ): Array<{ id: string; name: string; value: string }> {
    const options = [];
    for (let i = 1; product[`Option${i}`] !== undefined; i++) {
      options.push({
        id: nanoid(),
        name: `Option${i}`,
        value: product[`Option${i}`],
      });
    }
    return options;
  }

  async deleteProduct(productId: string): Promise<void> {
    await this.productModel.deleteOne({ productId }).exec();
  }

  async getProductById(productId: string): Promise<ProductDocument | null> {
    return this.productModel.findOne({ productId }).exec();
  }
}
