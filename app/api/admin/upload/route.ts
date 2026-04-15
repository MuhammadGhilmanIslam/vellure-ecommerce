import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { writeFile, mkdir, unlink } from 'fs/promises';
import path from 'path';

function requireAdmin(session: any) {
  if (!session || !['ADMIN', 'SUPERADMIN'].includes(session.user?.role)) {
    return NextResponse.json(
      { success: false, error: { code: 'UNAUTHORIZED', message: 'Admin access required.' } },
      { status: 401 }
    );
  }
  return null;
}

// POST /api/admin/upload — upload image file
export async function POST(request: NextRequest) {
  const session = await auth();
  const authError = requireAdmin(session);
  if (authError) return authError;

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({
        success: false,
        error: { code: 'NO_FILE', message: 'No file provided.' },
      }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({
        success: false,
        error: { code: 'INVALID_TYPE', message: 'Only JPEG, PNG, WebP, and GIF are allowed.' },
      }, { status: 400 });
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({
        success: false,
        error: { code: 'FILE_TOO_LARGE', message: 'File must be smaller than 5MB.' },
      }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate unique filename
    const ext = file.name.split('.').pop() || 'png';
    const filename = `upload-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

    // Save to public/products/
    const uploadDir = path.join(process.cwd(), 'public', 'products');
    await mkdir(uploadDir, { recursive: true });
    const filePath = path.join(uploadDir, filename);
    await writeFile(filePath, buffer);

    const url = `/products/${filename}`;

    return NextResponse.json({
      success: true,
      data: { url, filename, publicId: filename },
    }, { status: 201 });
  } catch (error) {
    console.error('Upload failed:', error);
    return NextResponse.json(
      { success: false, error: { code: 'UPLOAD_ERROR', message: 'Failed to upload file.' } },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/upload — delete an uploaded file
export async function DELETE(request: NextRequest) {
  const session = await auth();
  const authError = requireAdmin(session);
  if (authError) return authError;

  try {
    const { filename } = await request.json();

    if (!filename) {
      return NextResponse.json({
        success: false,
        error: { code: 'NO_FILENAME', message: 'No filename provided.' },
      }, { status: 400 });
    }

    // Prevent path traversal
    const sanitized = path.basename(filename);
    const filePath = path.join(process.cwd(), 'public', 'products', sanitized);

    try {
      await unlink(filePath);
    } catch {
      // File may not exist, that's ok
    }

    return NextResponse.json({ success: true, message: 'File deleted.' });
  } catch (error) {
    console.error('Delete file failed:', error);
    return NextResponse.json(
      { success: false, error: { code: 'DELETE_ERROR', message: 'Failed to delete file.' } },
      { status: 500 }
    );
  }
}
