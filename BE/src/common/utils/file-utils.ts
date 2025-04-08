import * as fs from 'fs';
import * as path from 'path';
import { BASE_PATH } from './path-utils';

export function deleteFile(filePath: string): void {
  console.log(`deleteFile called with filePath: ${filePath}`);

  if (!filePath) {
    console.error('No filePath provided to deleteFile');
    return;
  }

  const fullPath = path.join(BASE_PATH, filePath);
  console.log(`Resolved fullPath: ${fullPath}`);

  if (!fs.existsSync(fullPath)) {
    console.error(`File does not exist: ${fullPath}`);
    return;
  }

  fs.unlink(fullPath, (err) => {
    if (err) {
      console.error(`Failed to delete file: ${fullPath}`, err);
    } else {
      console.log(`File successfully deleted: ${fullPath}`);
    }
  });
}
