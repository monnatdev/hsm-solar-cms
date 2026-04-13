import type { CollectionConfig } from 'payload'

export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'featured', 'publishedAt', 'order'],
    description: 'บทความและข่าวสาร HSM Solar',
  },
  access: {
    read: () => true,
  },
  fields: [
    // ── Core ──────────────────────────────────────────────────
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'ชื่อบทความ',
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: 'Slug (URL)',
      admin: {
        description: 'URL path เช่น solar-cell-guide — auto-generate จาก title (ภาษาอังกฤษเท่านั้น)',
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (value) return value
            if (!data?.title) return value
            const generated = (data.title as string)
              .toLowerCase()
              .replace(/\s+/g, '-')
              .replace(/[^a-z0-9-]/g, '')
              .replace(/-+/g, '-')
              .replace(/^-|-$/g, '')
            return generated || `post-${Date.now()}`
          },
        ],
      },
    },
    {
      name: 'excerpt',
      type: 'textarea',
      label: 'บทสรุปย่อ',
      admin: {
        description: 'แสดงในการ์ดบทความและ SEO meta description (ไม่เกิน 160 ตัวอักษร)',
      },
    },
    {
      name: 'category',
      type: 'select',
      label: 'หมวดหมู่',
      options: [
        { label: 'ข่าวสาร', value: 'ข่าวสาร' },
        { label: 'เทคโนโลยี', value: 'เทคโนโลยี' },
        { label: 'ประหยัดพลังงาน', value: 'ประหยัดพลังงาน' },
        { label: 'กรณีศึกษา', value: 'กรณีศึกษา' },
        { label: 'คู่มือ', value: 'คู่มือ' },
        { label: 'โปรโมชัน', value: 'โปรโมชัน' },
      ],
    },

    // ── Featured image ────────────────────────────────────────
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'รูปปก',
    },
    {
      name: 'imageAlt',
      type: 'text',
      label: 'Alt text รูปปก',
      admin: {
        description: 'ข้อความอธิบายรูปสำหรับ accessibility และ SEO',
      },
    },

    // ── Post meta ─────────────────────────────────────────────
    {
      name: 'author',
      type: 'text',
      label: 'ผู้เขียน',
      defaultValue: 'HSM Solar',
    },
    {
      name: 'readTime',
      type: 'text',
      label: 'เวลาอ่าน',
      defaultValue: '5 นาที',
      admin: {
        description: 'เช่น "5 นาที" หรือ "10 min read"',
      },
    },
    {
      name: 'publishedAt',
      type: 'date',
      label: 'วันที่เผยแพร่',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },

    // ── Ordering & featuring ──────────────────────────────────
    {
      name: 'featured',
      type: 'checkbox',
      label: 'บทความแนะนำ (Featured)',
      defaultValue: false,
      admin: {
        description: 'แสดงใน Featured section หน้า Blog — ควรเลือกเพียง 1 บทความ',
      },
    },
    {
      name: 'order',
      type: 'number',
      label: 'ลำดับการแสดงผล',
      defaultValue: 99,
      admin: {
        description: 'ตัวเลขน้อยแสดงก่อน',
      },
    },

    // ── Content (Lexical rich text) ──────────────────────────
    {
      name: 'content',
      type: 'richText',
      label: 'เนื้อหาบทความ',
      admin: {
        description: 'รองรับ heading, bold, italic, list, link, blockquote, code, รูปภาพ inline',
      },
    },

    // ── SEO ───────────────────────────────────────────────────
    {
      name: 'meta',
      type: 'group',
      label: 'SEO',
      admin: {
        description: 'ปล่อยว่างเพื่อใช้ชื่อบทความและ excerpt อัตโนมัติ',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Meta Title',
          admin: {
            description: 'Override title สำหรับ Google (ปล่อยว่างเพื่อใช้ชื่อบทความ)',
          },
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Meta Description',
          admin: {
            description: 'Override description สำหรับ Google (ปล่อยว่างเพื่อใช้ excerpt)',
          },
        },
        {
          name: 'ogImage',
          type: 'upload',
          relationTo: 'media',
          label: 'Social Share Image',
          admin: {
            description: 'Override รูปสำหรับ Facebook/LINE share (ปล่อยว่างเพื่อใช้รูปปก)',
          },
        },
      ],
    },
  ],
}
