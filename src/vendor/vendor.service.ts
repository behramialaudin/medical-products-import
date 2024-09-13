import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Vendor, VendorDocument } from './vendor.schema';
import { ManufacturerService } from '../manufacturer/manufacturer.service';

@Injectable()
export class VendorService {
    constructor(
        @InjectModel(Vendor.name) private vendorModel: Model<VendorDocument>,
        private manufacturerService: ManufacturerService
    ) { }

    async upsertVendor(vendorData: any): Promise<string> {
        const vendor = await this.vendorModel.findOneAndUpdate(
            { vendorId: vendorData.vendorId },
            vendorData,
            { upsert: true, new: true }
        ).exec();
        return vendor.docId;
    }

    async upsertManufacturer(manufacturerData: any): Promise<string> {
        return this.manufacturerService.upsertManufacturer(manufacturerData);
    }

    async getVendorByDocId(docId: string): Promise<VendorDocument | null> {
        return this.vendorModel.findOne({ docId }).exec();
    }
}