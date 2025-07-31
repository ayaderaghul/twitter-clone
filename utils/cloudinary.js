const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

if (!process.env.CLOUDINARY_CLOUD_NAME) throw new Error('Missing Cloudinary cloud name');
if (!process.env.CLOUDINARY_API_KEY) throw new Error('Missing Cloudinary API key');
if (!process.env.CLOUDINARY_API_SECRET) throw new Error('Missing Cloudinary API secret');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

module.exports.uploadToCloudinary = async (filePath) => {
  const normalizedPath = filePath.replace(/\\/g, '/'); // Windows-safe path
  try {
    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath);
      console.log(`📤 Starting upload: ${filePath}`, {
        size: stats.size,
        modified: stats.mtime
      });
    } else {
      console.error('❌ File does not exist at path:', filePath);
      throw new Error('File not found before upload');
    }

    const result = await cloudinary.uploader.upload(normalizedPath, {
      folder: 'twitter-clone',
      resource_type: 'auto',
      chunk_size: 6_000_000,
      timeout: 30_000
    });

    console.log('✅ Upload successful:', {
      url: result.secure_url,
      bytes: result.bytes,
      format: result.format
    });

    // Cleanup temp file
    fs.unlinkSync(filePath);

    return result;
  } catch (error) {
    console.error('❌ Cloudinary upload failed:', {
      message: error.message,
      http_code: error.http_code,
      name: error.name
    });

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    throw new Error(`File upload failed: ${error.message}`);
  }
};
