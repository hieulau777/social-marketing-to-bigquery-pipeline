import {Storage} from "@google-cloud/storage";
import {json2csvAsync} from "json-2-csv";

class Uploader {
  private bucketName: string;

  constructor(bucketName: string) {
    this.bucketName = bucketName;
  }

  private async uploadFile(fileName: string, data: any) {
    const storage = new Storage();
    const bucket = storage.bucket(this.bucketName);
    const file = bucket.file(fileName);
    try {
      await file.save(data);
      console.log(`Upload ${fileName} success`);
    } catch (error) {
      console.error(`Error uploading ${fileName}: ${error}`);
    }
  }

  async handleError(fileName: string) {
    const csvError = await json2csvAsync([{error: "API errors"}]);
    console.log("API error");
    await this.uploadFile(`${fileName}.csv`, csvError);
  }

  async uploadCSV(json: Array<any>, fileName: string) {
    if (json.length > 0) {
      const csv = await json2csvAsync(json);
      await this.uploadFile(`${fileName}.csv`, csv);
    } else {
      await this.handleError(fileName);
    }
  }
}

export class UploaderFacebook extends Uploader {
  constructor() {
    super("facebook-analytics");
  }
}

export class UploaderLinkedin extends Uploader {
  constructor() {
    super("linkedin-analytics");
  }
}

