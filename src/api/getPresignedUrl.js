import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
  region: process.env.REACT_APP_AWS_REGION,
  credentials: {
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
  },
});

// 🔹 Function to extract the S3 Key (file path) from a full URL
const extractS3Key = (url) => {
  try {
    const urlObj = new URL(url);
    return urlObj.pathname.substring(1); // Remove leading "/"
  } catch (error) {
    console.error("Invalid URL:", url);
    return null;
  }
};

export const getPresignedUrl = async (fileUrl) => {
  try {
    const filePath = extractS3Key(fileUrl);
    if (!filePath) {
      console.error("Invalid file path for presigned URL:", fileUrl);
      return null;
    }

    const command = new GetObjectCommand({
      Bucket: process.env.REACT_APP_AWS_BUCKET_NAME,
      Key: filePath,
    });

    const presignedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 3600,
    });

    return presignedUrl;
  } catch (error) {
    console.error("Error generating pre-signed URL:", error);
    return null;
  }
};
