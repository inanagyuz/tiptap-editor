import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';

export async function POST(req: NextRequest) {
   try {
      const fileBuffer = await req.arrayBuffer();

      if (!fileBuffer || fileBuffer.byteLength === 0) {
         return NextResponse.json({ error: 'No file data received.' }, { status: 400 });
      }

      const fileType = await sharp(fileBuffer).metadata();
      if (!fileType.format || !['jpeg', 'png', 'webp', 'gif', 'tiff'].includes(fileType.format)) {
         return NextResponse.json({ error: 'Unsupported file type.' }, { status: 400 });
      }

      const maxFileSize = 5 * 1024 * 1024;
      if (fileBuffer.byteLength > maxFileSize) {
         return NextResponse.json({ error: 'File size exceeds 5MB.' }, { status: 400 });
      }

      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const fileName = `image-${timestamp}.webp`;

      const webpBuffer = await sharp(fileBuffer).webp({ quality: 80 }).toBuffer();

      const uploadsDir = join(process.cwd(), 'public', 'uploads');
      if (!existsSync(uploadsDir)) {
         mkdirSync(uploadsDir, { recursive: true });
      }

      const filePath = join(uploadsDir, fileName);

      await writeFile(filePath, webpBuffer);

      // URL oluştur
      const fileUrl = `/uploads/${fileName}`;

      return NextResponse.json({
         status: 200,
         url: fileUrl,
         filename: fileName,
         message: 'File uploaded successfully',
      });
   } catch (error) {
      console.error('Upload error:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      return NextResponse.json({ error: `Upload failed: ${errorMessage}` }, { status: 500 });
   }
}
