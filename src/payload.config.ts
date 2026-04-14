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
    s3Storage({
      collections: {
        media: {
          prefix: 'media',
        },
      },
      bucket: process.env.S3_BUCKET || '',
      config: {
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY || '',
          secretAccessKey: process.env.S3_SECRET_KEY || '',
        },
        region: process.env.S3_REGION || 'auto',
        endpoint: process.env.S3_ENDPOINT || '',
        // Required for Cloudflare R2
        forcePathStyle: true,
      },
    }),
  ],
})
