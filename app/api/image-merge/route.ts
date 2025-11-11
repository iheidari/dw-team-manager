import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";

interface CropOptions {
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
}

async function applyCrop(buffer: Buffer, crop: CropOptions): Promise<Buffer> {
  const image = sharp(buffer);
  const metadata = await image.metadata();
  const width = metadata.width || 0;
  const height = metadata.height || 0;

  const left = crop.left || 0;
  const top = crop.top || 0;
  const right = crop.right || 0;
  const bottom = crop.bottom || 0;

  // Calculate crop dimensions
  const cropLeft = left;
  const cropTop = top;
  const cropWidth = width - left - right;
  const cropHeight = height - top - bottom;

  // Validate crop dimensions
  if (cropWidth <= 0 || cropHeight <= 0) {
    throw new Error(
      `Invalid crop dimensions: resulting image would have width ${cropWidth} and height ${cropHeight}`
    );
  }

  if (
    cropLeft < 0 ||
    cropTop < 0 ||
    cropLeft + cropWidth > width ||
    cropTop + cropHeight > height
  ) {
    throw new Error(
      `Crop area exceeds image dimensions: image is ${width}x${height}, crop area is ${cropLeft},${cropTop} ${cropWidth}x${cropHeight}`
    );
  }

  // Apply crop using extract
  return image
    .extract({
      left: cropLeft,
      top: cropTop,
      width: cropWidth,
      height: cropHeight,
    })
    .toBuffer();
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("files") as File[];
    const numberStr = formData.get("number") as string;
    const cropStr = formData.get("crop") as string | null;

    // Validate inputs
    if (!files || files.length === 0) {
      return NextResponse.json(
        { success: false, error: "No files provided" },
        { status: 400 }
      );
    }

    if (!numberStr) {
      return NextResponse.json(
        { success: false, error: "Number parameter is required" },
        { status: 400 }
      );
    }

    const number = parseInt(numberStr, 10);
    if (isNaN(number) || number <= 0) {
      return NextResponse.json(
        { success: false, error: "Number must be a positive integer" },
        { status: 400 }
      );
    }

    if (number > files.length) {
      return NextResponse.json(
        {
          success: false,
          error: "Number cannot be greater than the number of files",
        },
        { status: 400 }
      );
    }

    // Parse optional crop parameter
    let crop: CropOptions | null = null;
    if (cropStr) {
      try {
        crop = JSON.parse(cropStr) as CropOptions;
        // Validate crop values are non-negative numbers if provided
        if (
          (crop.top !== undefined && (isNaN(crop.top) || crop.top < 0)) ||
          (crop.bottom !== undefined &&
            (isNaN(crop.bottom) || crop.bottom < 0)) ||
          (crop.left !== undefined && (isNaN(crop.left) || crop.left < 0)) ||
          (crop.right !== undefined && (isNaN(crop.right) || crop.right < 0))
        ) {
          return NextResponse.json(
            {
              success: false,
              error: "Crop values must be non-negative numbers",
            },
            { status: 400 }
          );
        }
      } catch {
        return NextResponse.json(
          { success: false, error: "Invalid crop parameter format" },
          { status: 400 }
        );
      }
    }

    // Calculate how many images per batch
    const totalImages = files.length;
    const imagesPerBatch = Math.ceil(totalImages / number);

    // Process images into batches and merge each batch
    const mergedImages: Buffer[] = [];

    for (let i = 0; i < number; i++) {
      const startIdx = i * imagesPerBatch;
      const endIdx = Math.min(startIdx + imagesPerBatch, totalImages);

      if (startIdx >= totalImages) {
        break;
      }

      // Get images for this batch
      const batchFiles = files.slice(startIdx, endIdx);

      // Load all images in the batch and apply cropping if specified
      const imageBuffers = await Promise.all(
        batchFiles.map(async (file) => {
          const arrayBuffer = await file.arrayBuffer();
          let buffer: Buffer = Buffer.from(arrayBuffer);

          // Apply crop if provided
          if (crop) {
            buffer = await applyCrop(buffer, crop);
          }

          return buffer;
        })
      );

      // Get metadata for all images to calculate dimensions
      const imageMetadatas = await Promise.all(
        imageBuffers.map((buffer) => sharp(buffer).metadata())
      );

      // Calculate total height and max width for vertical merge
      const totalHeight = imageMetadatas.reduce(
        (sum, meta) => sum + (meta.height || 0),
        0
      );
      const maxWidth = Math.max(
        ...imageMetadatas.map((meta) => meta.width || 0)
      );

      // Create composite image
      const compositeImages = imageMetadatas.map((meta, idx) => {
        let yOffset = 0;
        for (let j = 0; j < idx; j++) {
          yOffset += imageMetadatas[j].height || 0;
        }
        return {
          input: imageBuffers[idx],
          top: yOffset,
          left: 0,
        };
      });

      // Merge images vertically
      const mergedImage = await sharp({
        create: {
          width: maxWidth,
          height: totalHeight,
          channels: 4,
          background: { r: 255, g: 255, b: 255, alpha: 1 },
        },
      })
        .composite(compositeImages)
        .png()
        .toBuffer();

      mergedImages.push(mergedImage);
    }

    // Convert merged images to base64 for response
    const base64Images = mergedImages.map((buffer) =>
      buffer.toString("base64")
    );

    return NextResponse.json({
      success: true,
      data: {
        images: base64Images,
        count: base64Images.length,
      },
    });
  } catch (error) {
    console.error("Error merging images:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to merge images",
      },
      { status: 500 }
    );
  }
}
