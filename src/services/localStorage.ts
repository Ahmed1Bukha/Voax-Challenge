import * as fs from "fs";
import * as path from "path";
import { BlobModel } from "../models/blob";

export default class LocalStorage {
  constructor() {}

  async saveFileBlob(blob: BlobModel, chosenPath: string): Promise<void> {
    try {
      if (!fs.existsSync(chosenPath)) {
        fs.mkdirSync(chosenPath, { recursive: true });
      }
      const filePath = path.join(chosenPath, blob.id);

      // Check if file already exists
      if (fs.existsSync(filePath)) {
        throw new Error(
          `File with id '${blob.id}' already exists at path: ${filePath}`
        );
      }

      fs.writeFileSync(filePath, blob.data, "utf8");
    } catch (error) {
      console.error("Error saving file:", error);
      throw error;
    }
  }

  async getFileBlob(
    id: string,
    chosenPath: string
  ): Promise<BlobModel | undefined> {
    try {
      if (!fs.existsSync(chosenPath)) {
        fs.mkdirSync(chosenPath, { recursive: true });
      }
      const filePath = path.join(chosenPath, id);
      const data = fs.readFileSync(filePath, "utf8");
      const metadata = await this.getFileMetadata(filePath);
      const blob: BlobModel = {
        id: id,
        data: data,
        createdAt: metadata.created,
        size: metadata.size,
      };
      return blob;
    } catch (error) {
      throw error;
    }
  }

  async getFileMetadata(fullPath: string) {
    try {
      const stats = fs.statSync(fullPath);

      return {
        // File type checks
        isFile: stats.isFile(),
        isDirectory: stats.isDirectory(),
        isSymbolicLink: stats.isSymbolicLink(),

        // Size information
        size: stats.size, // in bytes
        sizeKB: Math.round(stats.size / 1024),
        sizeMB: Math.round(stats.size / (1024 * 1024)),

        // Timestamps
        created: stats.birthtime, // Creation time
        modified: stats.mtime, // Last modified time
        accessed: stats.atime, // Last access time
        changed: stats.ctime, // Last status change time

        // Permissions (Unix/Linux/Mac)
        mode: stats.mode,
        permissions: (stats.mode & parseInt("777", 8)).toString(8),

        // File system info
        dev: stats.dev, // Device ID
        ino: stats.ino, // Inode number
        nlink: stats.nlink, // Number of hard links
        uid: stats.uid, // User ID of owner
        gid: stats.gid, // Group ID of owner
      };
    } catch (error) {
      console.error("Error reading file metadata:", error);
      throw error;
    }
  }
}
