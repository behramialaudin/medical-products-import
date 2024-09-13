import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { nanoid } from 'nanoid';

export type ProductDocument = Product & Document;

@Schema()
export class Product {
  @Prop({ required: true, unique: true })
  productId: string;

  @Prop({ default: () => nanoid() })
  docId: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop()
  category: string;

  @Prop({ type: String, ref: 'Vendor' })
  vendorId: string;

  @Prop({ type: String, ref: 'Manufacturer' })
  manufacturerId: string;

  @Prop({ type: [{ type: Object }] })
  variants: Array<{
    itemId: string;
    description: string;
    packaging: string;
  }>;

  @Prop({ type: [{ type: Object }] })
  options: Array<{
    id: string;
    name: string;
    value: string;
  }>;

  @Prop()
  imageUrl: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

ProductSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});
