
import { loadImage, removeBackground } from '@huggingface/transformers';

export const processLogo = async (file: Blob): Promise<Blob> => {
  try {
    // Load the image
    const img = await loadImage(file);
    
    // Remove background
    const cleanedLogo = await removeBackground(img);
    
    // Create canvas for cropping and resizing
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) throw new Error('Could not get canvas context');
    
    // Create an image element from the cleaned logo blob
    const cleanedImg = await loadImage(cleanedLogo);
    
    // Determine crop dimensions
    const aspectRatio = cleanedImg.width / cleanedImg.height;
    const targetSize = 500; // Larger size for clarity
    
    // Set canvas size
    canvas.width = targetSize;
    canvas.height = targetSize;
    
    // Calculate source crop dimensions
    let sourceWidth, sourceHeight, sourceX, sourceY;
    if (aspectRatio > 1) {
      // Wide image
      sourceHeight = cleanedImg.height;
      sourceWidth = sourceHeight * aspectRatio;
      sourceX = (cleanedImg.width - sourceWidth) / 2;
      sourceY = 0;
    } else {
      // Tall image
      sourceWidth = cleanedImg.width;
      sourceHeight = sourceWidth / aspectRatio;
      sourceX = 0;
      sourceY = (cleanedImg.height - sourceHeight) / 2;
    }
    
    // Clear and draw cropped, resized image
    ctx.clearRect(0, 0, targetSize, targetSize);
    ctx.drawImage(
      cleanedImg, 
      sourceX, sourceY, sourceWidth, sourceHeight, 
      0, 0, targetSize, targetSize
    );
    
    // Convert to blob
    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to create blob'));
          }
        },
        'image/png',
        1.0
      );
    });
  } catch (error) {
    console.error('Logo processing error:', error);
    throw error;
  }
};
