import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as csv from 'csv-parser';

@Injectable()
export class FileService {
  async readProductsCSV(): Promise<any[]> {
    const filePath = path.join(__dirname, '..', '..', 'images40.xlsx');
    const products: any[] = [];

    return new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (row) => products.push(row))
        .on('end', () => resolve(products))
        .on('error', (error) => reject(error));
    });
  }
}
