import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export async function handleUpload(file: any, folder?: string) {
  const res = await cloudinary.uploader.upload(file, {
    resource_type: 'auto',
    upload_preset: 'safe_load',
    folder: folder ?? 'tokens'
  });
  return res;
}
export async function handleDelete(image: any) {
  const res = await cloudinary.uploader.destroy(image);
  return res;
}
