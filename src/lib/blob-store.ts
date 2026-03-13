import { S3Client, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';

const BLOB_PREFIX = 'stmosc-data/';

function hasR2Config(): boolean {
  return !!(process.env.R2_ACCOUNT_ID && process.env.R2_ACCESS_KEY_ID &&
            process.env.R2_SECRET_ACCESS_KEY && process.env.R2_BUCKET_NAME);
}

function getR2Client() {
  return new S3Client({
    region: 'auto',
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID!,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    },
  });
}

export async function readBlob<T>(name: string, defaultData: T): Promise<T> {
  if (!hasR2Config()) {
    console.warn(`[blob-store] R2 not configured — returning default for "${name}"`);
    return defaultData;
  }
  try {
    const r2 = getR2Client();
    const result = await r2.send(new GetObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME!,
      Key: `${BLOB_PREFIX}${name}.json`,
    }));
    const body = await result.Body?.transformToString();
    if (!body) return defaultData;
    return JSON.parse(body) as T;
  } catch (err: any) {
    if (err?.name === 'NoSuchKey') return defaultData;
    console.error(`[blob-store] readBlob "${name}" failed:`, err);
    return defaultData;
  }
}

export async function writeBlob<T>(name: string, data: T): Promise<void> {
  if (!hasR2Config()) {
    console.warn(`[blob-store] R2 not configured — cannot write "${name}"`);
    return;
  }
  try {
    const r2 = getR2Client();
    await r2.send(new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME!,
      Key: `${BLOB_PREFIX}${name}.json`,
      Body: JSON.stringify(data),
      ContentType: 'application/json',
    }));
  } catch (err) {
    console.error(`[blob-store] writeBlob "${name}" failed:`, err);
    throw err;
  }
}
