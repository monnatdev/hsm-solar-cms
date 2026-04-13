import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Posts } from './collections/Posts'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000'
const SERVER_URL = process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3001'

// R2 is configured only when all required env vars are present.
// In local dev these vars are absent so Payload falls back to local disk storage.
const r2Enabled =
  !!process.env.S3_BUCKET &&
  !!process.env.S3_ACCESS_KEY &&
  !!process.env.S3_SECRET_KEY &&
  !!process.env.S3_ENDPOINT

export default buildConfig({
  serverURL: SERVER_URL,
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Posts],
  cors: [FRONTEND_URL],
  csrf: [FRONTEND_URL],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URL || '',
  }),
  sharp,
  plugins: [
    // Cloudflare R2 (S3-compatible) for media uploads.
    // Only active in production when env vars are set.
    ...(r2Enabled
      ? [
          s3Storage({
            collections: {
              media: {
                // ไฟล์ทั้งหมดจะอยู่ใน media/ folder ใน bucket
                prefix: 'media',
              },
            },
            bucket: process.env.S3_BUCKET as string,
            config: {
              credentials: {
                accessKeyId: process.env.S3_ACCESS_KEY as string,
                secretAccessKey: process.env.S3_SECRET_KEY as string,
              },
              region: process.env.S3_REGION || 'auto',
              endpoint: process.env.S3_ENDPOINT as string,
              // Required for Cloudflare R2
              forcePathStyle: true,
            },
          }),
        ]
      : []),
  ],
})
