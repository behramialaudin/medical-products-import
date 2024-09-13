import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Manufacturer, ManufacturerDocument } from './manufacturer.schema';

@Injectable()
export class ManufacturerService {
  constructor(
    @InjectModel(Manufacturer.name)
    private manufacturerModel: Model<ManufacturerDocument>,
  ) {}

  async upsertManufacturer(manufacturerData: any): Promise<string> {
    const manufacturer = await this.manufacturerModel
      .findOneAndUpdate(
        { manufacturerId: manufacturerData.manufacturerId },
        {
          ...manufacturerData,
          name: manufacturerData.name || 'Unknown Manufacturer',
          contactInfo: manufacturerData.contactInfo || '',
        },
        { upsert: true, new: true },
      )
      .exec();
    return manufacturer.docId;
  }

  async getManufacturerByDocId(
    docId: string,
  ): Promise<ManufacturerDocument | null> {
    return this.manufacturerModel.findOne({ docId }).exec();
  }

  async deleteManufacturer(manufacturerId: string): Promise<void> {
    await this.manufacturerModel.deleteOne({ manufacturerId }).exec();
  }
}
