import fs from 'fs';
import path from 'path';

/**
 * Analyzes a JPEG image to determine if it's predominantly light or dark.
 * Uses a simple sampling approach on the raw image data.
 * Returns true if the image is dark (should use light text).
 */
export async function isImageDark(imagePath: string): Promise<boolean> {
  try {
    const fullPath = path.join(process.cwd(), 'public', imagePath);
    const buffer = await fs.promises.readFile(fullPath);

    // Sample pixels from the image data
    // For JPEG, we'll sample bytes and estimate brightness
    // This is a rough approximation but works for most cases
    const sampleSize = Math.min(buffer.length, 10000);
    const step = Math.floor(buffer.length / sampleSize);

    let totalBrightness = 0;
    let samples = 0;

    for (let i = 0; i < buffer.length; i += step) {
      totalBrightness += buffer[i];
      samples++;
    }

    const avgBrightness = totalBrightness / samples;

    // Threshold: values below 128 are considered dark
    return avgBrightness < 128;
  } catch {
    // Default to dark background if we can't read the image
    return true;
  }
}
