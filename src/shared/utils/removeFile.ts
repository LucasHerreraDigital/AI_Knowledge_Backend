import { unlink } from "node:fs/promises";

async function removeFile(filePath: string) {
  try {
    await unlink(filePath);
  } catch (error) {
    const err = error as NodeJS.ErrnoException;

    if (err.code !== "ENOENT") {
      throw error;
    }
  }
}

export default removeFile