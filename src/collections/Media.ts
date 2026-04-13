import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      label: 'Alt text (SEO & accessibility)',
    },
  ],
  upload: {
    // ── File type & size validation ──────────────────────────
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'],
    // 10 MB limit — กันอัปโหลดไฟล์ใหญ่เกิน
    filesRequiredOnCreate: true,

    // ── Sharp image processing ───────────────────────────────
    // Sharp แปลงเป็น WebP และสร้าง responsive sizes อัตโนมัติ
    imageSizes: [
      {
        // thumbnail ใช้ใน admin panel และ preview
        name: 'thumbnail',
        width: 400,
        height: 300,
        position: 'centre',
        formatOptions: {
          format: 'webp',
          options: { quality: 80 },
        },
      },
      {
        // card ใช้ใน blog listing และ homepage carousel
        name: 'card',
        width: 800,
        height: 500,
        position: 'centre',
        formatOptions: {
          format: 'webp',
          options: { quality: 82 },
        },
      },
      {
        // hero ใช้เป็น featured image ใน blog post (full width)
        name: 'hero',
        width: 1280,
        height: undefined,
        position: 'centre',
        formatOptions: {
          format: 'webp',
          options: { quality: 85 },
        },
      },
    ],
    adminThumbnail: 'thumbnail',
  },
}
