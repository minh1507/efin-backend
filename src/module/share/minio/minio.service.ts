import { Inject, Injectable } from '@nestjs/common';
import * as Minio from 'minio';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidV4 } from 'uuid';
import { Readable as ReadableStream } from 'node:stream';
import { Readable } from 'stream';
import { ConfigService } from '../config/config.service';
import IGlobal from 'src/master/global/global.interface';

@Injectable()
export class MinioService {

  private bucket!: string; // Use definite assignment assertion

  constructor(
    @Inject('MINIO_CONNECTION') private readonly minioClient: Minio.Client,
    private readonly configService: ConfigService,
  ) {
    this.initialize();
  }

  private async initialize() {
    const config = (await this.configService.getConfig()) as IGlobal;
    this.bucket = config['MINIO.BUCKET'];
  }

  /**
   * Convert name non-utf-8 | buffer to utf-8.
   * @param {string} name Original name.
   * @returns {string} Name in utf-8.
   */
  originalName = (name: string): string => {
    return Buffer.from(name, 'latin1').toString('utf8').trim();
  };

  /**
   * Create new bucket.
   * @param {string} bucket Name of the bucket.
   * @returns {Promise<void>} Bucket is created.
   */
  async createBucket(bucket: string): Promise<void> {
    await this.minioClient.makeBucket(bucket);
  }

  /**
   * Create new file.
   * @param {Express.Multer.File} file metadata.
   * @param {boolean} uuid Push file with origin name or uuid.
   * @param {string} path Path in bucket, not required.
   * @returns {Promise<string>} file name.
   */
  async createFile(
    file: Express.Multer.File,
    uuid: boolean = false,
    path?: string,
  ): Promise<string> {
    const fileName: string = uuid
      ? // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        `${uuidV4()}.${file.originalname.split('.')[1]}`
      : Buffer.from(file.originalname, 'latin1').toString('utf8');
    await this.minioClient.putObject(
      this.bucket,
      this.keyAny(fileName, path),
      file.buffer,
      file.size,
    );
    return fileName;
  }

  async uploadStream(
    objectName: string,
    stream: Readable,
    size: number,
    path: string,
  ): Promise<void> {
    await this.minioClient.putObject(
      this.bucket,
      path + '/' + objectName,
      stream,
      size,
    );
  }

  async createFileWithBuffer(buffer: Buffer, path?: string): Promise<string> {
    const fileName: string = `${uuidV4()}.xlsx`;
    await this.minioClient.putObject(
      this.bucket,
      this.keyAny(fileName, path),
      buffer,
    );
    return fileName;
  }

  /**
   * Create many new file.
   * @param {Express.Multer.File} file metadata array.
   * @param {boolean} uuid Push file with origin name or uuid.
   * @param {string} path Path in bucket, not required.
   * @returns {Promise<string[]>} file name array.
   */
  async createManyFile(
    file: Express.Multer.File[],
    uuid: boolean = false,
    path?: string,
  ): Promise<string[]> {
    const fileName: string[] = [];
    for (let i = 0; i < file.length; i++) {
      fileName.push(await this.createFile(file[i], uuid, path));
    }
    return fileName;
  }

  /**
   * @typedef {Object} Buffer
   * @property {Uint8Array} data The buffer data.
   * @property {number} length The length of the buffer.
   */
  /**
   * Get all file in buffer or bucket item.
   * @param {string} path path in bucket, not required.
   * @param {boolean} buffer is buffer or bucket.
   * @returns {Promise<Buffer[] | BucketItem[]>} buffer or bucket item.
   */
  // async findAllFile(
  //   buffer: boolean,
  //   path?: string,
  // ): Promise<Buffer[] | BucketItem[]> {
  //   const list: BucketItem[] = [];
  //   await new Promise((resolve, reject) => {
  //     this.minioClient
  //       .listObjectsV2(this.bucket, path, true)
  //       .on('data', (data: BucketItem) => {
  //         list.push(data);
  //       })
  //       .on('error', reject)
  //       .on('end', resolve);
  //   });
  //   if (buffer) {
  //     return await this.findAllFileInBuffer(list, path);
  //   }
  //   return list;
  // }

  /**
   * Get file install by url.
   * @param {string} fileName path in bucket.
   * @param {string} path path in bucket, not required.
   * @returns {Promise<string>} string.
   */
  async findUrlFile(fileName: string, path?: string): Promise<string> {
    return await this.minioClient.presignedUrl(
      'GET',
      this.bucket,
      this.key(fileName, path),
      36000,
    );
  }

  /**
   * Update file.
   * @param {string} fileName file name.
   * @param {Express.Multer.File} file metadata.
   * @param {string} path path in bucket, not required.
   * @param {boolean} uuid Push file with origin name or uuid.
   * @returns {Promise<string>} string.
   */
  async updateFile(
    fileName: string,
    file: Express.Multer.File,
    uuid: boolean = false,
    path?: string,
  ): Promise<string> {
    await this.removeFile(fileName, path);
    return await this.createFile(file, uuid, path);
  }

  /**
   * Delete file.
   * @param {string} fileName file name.
   * @param {string} path path in bucket, not required.
   * @returns {Promise<void>} string.
   */
  async removeFile(fileName: string, path?: string): Promise<void> {
    await this.minioClient.removeObject(
      this.bucket,
      this.keyAny(fileName, path),
    );
  }

  /**
   * Check file exist.
   * @param {string} fileName file name.
   * @param {string} path path in bucket, not required.
   * @returns {Promise<boolean>} string.
   */
  async existFile(fileName: string, path?: string): Promise<boolean> {
    try {
      await this.minioClient.statObject(this.bucket, this.key(fileName, path));
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Check bucket exist.
   * @param {string} bucket bucket name.
   * @returns {Promise<boolean>} boolean.
   */
  async existBucket(bucket: string): Promise<boolean> {
    return await this.minioClient.bucketExists(bucket);
  }

  /**
   * Get 1 file in buffer.
   * @param {string} fileName file name.
   * @param {string} path path in bucket, not required.
   * @returns {Promise<Buffer>} string.
   */
  async findOneFile(fileName: string, path?: string): Promise<ReadableStream> {
    return this.minioClient.getObject(this.bucket, this.key(fileName, path));
  }

  // Get file xlsx
  async findOneXlsx(fileName: string): Promise<ReadableStream> {
    return this.minioClient.getObject(this.bucket, `${fileName}.xlsx`);
  }

  // Get file docx
  async findOneDocx(fileName: string): Promise<ReadableStream> {
    return this.minioClient.getObject(this.bucket, `${fileName}.docx`);
  }

  async findOneFileAny(
    fileName: string,
    path?: string,
  ): Promise<ReadableStream> {
    return this.minioClient.getObject(this.bucket, this.keyAny(fileName, path));
  }

  /**
   * Update file.
   * @param {string} folderPath Folder path.
   * @returns {Promise<void>} string.
   */
  async syncFile(folderPath: string): Promise<void> {
    // Clear the destination folder first
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    } else {
      fs.rmSync(folderPath, { recursive: true, force: true });
    }

    // Sync files from MinIO to the destination folder
    const objectsStream = this.minioClient.listObjectsV2(this.bucket, '', true);
    for await (const obj of objectsStream) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
      const objectName = obj.name;
      const destinationPath = path.join(folderPath, objectName);
      await this.minioClient.fGetObject(
        this.bucket,
        objectName,
        destinationPath,
      );
    }
  }

  private key = (name: string, path?: string): string => {
    return path ? `${path}/${name}` : name;
  };

  private keyAny = (name: string, path?: string): string => {
    return path ? `/${path}/${name}` : name;
  };

  // private async findAllFileInBuffer(
  //   arr: BucketItem[],
  //   path?: string,
  // ): Promise<Buffer[]> {
  //   const list: Buffer[] = [];
  //   for (let i = 0; i < arr.length; i++) {
  //     const nameArr: string[] = arr[i].name!.split('/');
  //     const name = nameArr[nameArr.length - 1].split('.')[0];

  //     list.push(await this.findOneFile(name, path));
  //   }
  //   return list;
  // }
}
