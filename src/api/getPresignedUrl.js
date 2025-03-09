import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
  region: process.env.REACT_APP_AWS_REGION,
  credentials: {
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
  },
});

export const getPresignedUrl = async (filePath) => {
  try {
    const command = new GetObjectCommand({
      Bucket: process.env.REACT_APP_AWS_BUCKET_NAME,
      Key: filePath,
    });

    // ✅ Use getSignedUrl from @aws-sdk/s3-request-presigner
    const presignedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 3600,
    });

    return presignedUrl;
  } catch (error) {
    console.error("Error generating pre-signed URL:", error);
    return null;
  }
};
