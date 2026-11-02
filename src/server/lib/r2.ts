import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  CreateMultipartUploadCommand,
  UploadPartCommand,
  CompleteMultipartUploadCommand,
  AbortMultipartUploadCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const accountId = process.env.R2_ACCOUNT_ID || "";
const accessKeyId = process.env.R2_ACCESS_KEY_ID || "";
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY || "";
const bucketName = process.env.R2_BUCKET || "applaunch-apks";
const publicUrl = process.env.R2_PUBLIC_URL || "https://storage.applaunch.dev";

const isConfigured = Boolean(
  accountId &&
    accessKeyId &&
    secretAccessKey &&
    !accessKeyId.includes("your_")
);

export const s3Client = isConfigured
  ? new S3Client({
      region: "auto",
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    })
  : null;

/**
 * Get presigned URL for direct client upload
 */
export async function getPresignedUploadUrl(
  key: string,
  contentType = "application/vnd.android.package-archive",
  expiresIn = 3600
): Promise<{ uploadUrl: string; key: string }> {
  if (!s3Client) {
    // Graceful fallback for local development / testing without active R2 credentials
    return {
      uploadUrl: `/api/v1/uploads/mock-presigned?key=${encodeURIComponent(key)}`,
      key,
    };
  }

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    ContentType: contentType,
  });

  const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn });
  return { uploadUrl, key };
}

/**
 * Get presigned URL for secure download with Content-Disposition
 */
export async function getPresignedDownloadUrl(
  key: string,
  filename = "app-release.apk",
  expiresIn = 300 // 5 minutes
): Promise<string> {
  if (!s3Client) {
    return `${publicUrl}/${key}?filename=${encodeURIComponent(filename)}&sig=mock_token_300s`;
  }

  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: key,
    ResponseContentDisposition: `attachment; filename="${filename}"`,
    ResponseContentType: "application/vnd.android.package-archive",
  });

  return getSignedUrl(s3Client, command, { expiresIn });
}

/**
 * Initiate multipart upload
 */
export async function initMultipartUpload(key: string, contentType = "application/vnd.android.package-archive") {
  if (!s3Client) {
    return { uploadId: `mock_upload_${Date.now()}`, key };
  }

  const command = new CreateMultipartUploadCommand({
    Bucket: bucketName,
    Key: key,
    ContentType: contentType,
  });

  const response = await s3Client.send(command);
  return { uploadId: response.UploadId || `upload_${Date.now()}`, key };
}

/**
 * Presign part upload URL
 */
export async function getPresignedPartUrl(
  key: string,
  uploadId: string,
  partNumber: number,
  expiresIn = 3600
) {
  if (!s3Client) {
    return `/api/v1/uploads/mock-part?uploadId=${uploadId}&partNumber=${partNumber}`;
  }

  const command = new UploadPartCommand({
    Bucket: bucketName,
    Key: key,
    UploadId: uploadId,
    PartNumber: partNumber,
  });

  return getSignedUrl(s3Client, command, { expiresIn });
}

/**
 * Complete multipart upload
 */
export async function completeMultipartUpload(
  key: string,
  uploadId: string,
  parts: { PartNumber: number; ETag: string }[]
) {
  if (!s3Client) {
    return { success: true, key };
  }

  const command = new CompleteMultipartUploadCommand({
    Bucket: bucketName,
    Key: key,
    UploadId: uploadId,
    MultipartUpload: { Parts: parts },
  });

  return s3Client.send(command);
}

/**
 * Abort multipart upload
 */
export async function abortMultipartUpload(key: string, uploadId: string) {
  if (!s3Client) return;

  const command = new AbortMultipartUploadCommand({
    Bucket: bucketName,
    Key: key,
    UploadId: uploadId,
  });

  return s3Client.send(command);
}

/**
 * Delete file from R2
 */
export async function deleteFileFromR2(key: string): Promise<boolean> {
  if (!s3Client) return true;

  try {
    const command = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: key,
    });
    await s3Client.send(command);
    return true;
  } catch {
    return false;
  }
}
