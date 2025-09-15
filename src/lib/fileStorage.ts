import { storageService } from "@/services/storage.service";

// Defines the options for the publishFile function for type safety.
export interface PublishFileOptions {
  file: File;
  directory: string;
  name: string; // The desired file name without extension
}

/**
 * Uploads a file to a public storage directory and returns its accessible URL.
 * @param {PublishFileOptions} options - The file and its destination details.
 * @returns {Promise<string>} The public URL of the uploaded file.
 */
export async function publishFile(options: PublishFileOptions): Promise<string> {
  const { file, directory, name } = options;

  const extension = file.name.split('.').pop()?.toLowerCase();
  if (!extension) {
    throw new Error("File extension could not be determined.");
  }

  const fileName = `${name}.${extension}`;
  const filePath = `${directory}/${fileName}`;

  // Ensure the destination directory exists.
  const directoryExists = await storageService.directoryExists(directory);
  if (!directoryExists) {
    await storageService.createDirectory(directory);
  }
  
  const fileBuffer = await file.arrayBuffer();

  await storageService.write(filePath, Buffer.from(fileBuffer), {
    contentType: file.type
  });

  return storageService.publicUrl(filePath);
}

/**
 * Deletes a file from the storage provider.
 * @param filePath - The full path to the file (e.g., 'user-avatars/123/profile.png').
 */
export async function deleteFile(filePath: string): Promise<void> {
  const fileExists = await storageService.fileExists(filePath);
  if (fileExists) {
    await storageService.deleteFile(filePath);
  }
}