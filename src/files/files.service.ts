import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as uuid from 'uuid';
import * as resizeImg from 'resize-img';

@Injectable()
export class FilesService {
  public async deleteFile(name: string) {
    const filePath = path.resolve(__dirname, '..', 'static');
    fs.unlink(path.join(filePath, name), (err) => {
      if (err) {
        throw new HttpException(
          'File delete error occurred',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    });
  }
  public async createFile(
    file: any,
    width: number,
    height: number,
  ): Promise<string> {
    try {
      const fileName = uuid.v4() + '.png';
      const filePath = path.resolve(__dirname, '..', 'static');
      if (!fs.existsSync(filePath)) {
        fs.mkdirSync(filePath, { recursive: true });
      }
      const resizedImage: Buffer = await resizeImg(file.buffer, {
        width: width,
        height: height,
      });
      await fs.writeFileSync(path.join(filePath, fileName), resizedImage);
      return fileName;
    } catch (e) {
      throw new HttpException(
        'File write error occurred',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
