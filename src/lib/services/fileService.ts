import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export class FileService {
  private uploadDir: string;

  constructor() {
    // Create uploads directory in the project root
    this.uploadDir = path.join(process.cwd(), "uploads");
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async saveFile(file: {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    size: number;
    destination: string;
    filename: string;
    path: string;
    buffer: Buffer;
    stream: any;
  }): Promise<string> {
    // Create year/month based directory structure
    const date = new Date();
    const yearDir = date.getFullYear().toString();
    const monthDir = (date.getMonth() + 1).toString().padStart(2, "0");
    const uploadPath = path.join(this.uploadDir, yearDir, monthDir);

    // Create directories if they don't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    // Generate unique filename
    const fileExtension = path.extname(file.originalname);
    const fileName = `${uuidv4()}${fileExtension}`;
    const filePath = path.join(uploadPath, fileName);

    // Save file
    await fs.promises.writeFile(filePath, file.buffer);

    // Return relative path from uploads directory
    return path.join("uploads", yearDir, monthDir, fileName);
  }

  async getFile(filePath: string): Promise<Buffer> {
    const fullPath = path.join(process.cwd(), filePath);
    return fs.promises.readFile(fullPath);
  }

  async deleteFile(filePath: string): Promise<void> {
    const fullPath = path.join(process.cwd(), filePath);
    if (fs.existsSync(fullPath)) {
      await fs.promises.unlink(fullPath);
    }
  }

  getFilePath(filePath: string): string {
    return path.join(process.cwd(), filePath);
  }
}
