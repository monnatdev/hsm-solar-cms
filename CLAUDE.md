# HSM Solar — CMS (Payload CMS)

## Business Context

CMS นี้ใช้จัดการ content สำหรับเว็บไซต์ HSM Energy (https://www.hsmenergyth.com)
บริษัทรับติดตั้งโซลาร์เซลล์ กลุ่มเป้าหมายหลักคือเจ้าของบ้านที่ต้องการติดตั้ง 5–10 kWp

## Tech Stack

| Layer | Technology |
|---|---|
| CMS | Payload CMS 3.82.1 |
| Framework | Next.js 16 + React 19 |
| Language | TypeScript |
| Database | MongoDB (via mongooseAdapter) |
| Media Storage | Cloudflare R2 (S3-compatible) |
| Image Processing | Sharp |
| Rich Text | Lexical Editor |
| Deployment | Railway |
| Package Manager | pnpm |

## Project Structure

```
src/
├── app/                    # Next.js app (Payload Admin UI)
├── collections/
│   ├── Posts.ts            # บทความ — fields, hooks, access
│   ├── Media.ts            # รูปภาพ — upload ไปยัง Cloudflare R2
│   └── Users.ts            # Admin users
├── payload.config.ts       # Config หลัก — DB, storage, CORS, collections
└── payload-types.ts        # Auto-generated types (ห้ามแก้ด้วยมือ)
```

## Collections

### Posts
fields สำคัญ:
- `title` — ชื่อบทความ (required)
- `slug` — URL path ภาษาอังกฤษ (auto-generate จาก title)
- `excerpt` — บทสรุปย่อ ≤160 chars (ใช้เป็น meta description)
- `category` — ข่าวสาร / เทคโนโลยี / ประหยัดพลังงาน / กรณีศึกษา / คู่มือ / โปรโมชัน
- `image` — รูปปก (upload ไปยัง Media collection)
- `imageAlt` — alt text สำหรับ SEO + accessibility
- `featured` — บทความแนะนำ (ควรมีแค่ 1 บทความ)
- `order` — ลำดับการแสดงผล (ตัวเลขน้อยแสดงก่อน)
- `content` — Lexical rich text (heading, bold, italic, list, link, รูปภาพ)
- `meta` — SEO override (title, description, ogImage)

hooks: `afterChange` และ `afterDelete` trigger revalidate ที่ frontend อัตโนมัติ

### Media
- Upload ไปยัง Cloudflare R2 โดยอัตโนมัติ
- Sharp ใช้ resize/optimize รูปก่อน upload
- Blog cover image spec: **1200 x 630px** (ratio 16:9)

## Environment Variables

```
DATABASE_URL=               # MongoDB connection string
PAYLOAD_SECRET=             # Secret key สำหรับ Payload
PAYLOAD_PUBLIC_SERVER_URL=  # URL ของ CMS เช่น https://cms.railway.app
FRONTEND_URL=               # URL ของ website เช่น https://www.hsmenergyth.com
REVALIDATE_SECRET=          # Secret สำหรับ trigger ISR revalidation

# Cloudflare R2 (S3-compatible)
S3_BUCKET=
S3_ACCESS_KEY=
S3_SECRET_KEY=
S3_REGION=auto
S3_ENDPOINT=                # https://<account-id>.r2.cloudflarestorage.com
```

## Coding Conventions

- TypeScript strict — ห้าม `any`
- ห้ามแก้ `payload-types.ts` ด้วยมือ — รัน `pnpm generate:types` เมื่อแก้ collections
- Collection fields เพิ่มได้ ลบต้องระวัง — ข้อมูลใน MongoDB อาจหาย
- ใช้ `pnpm` เท่านั้น ห้ามใช้ npm หรือ yarn

## Development Commands

```bash
pnpm dev          # Start dev server (port 3001)
pnpm build        # Build production
pnpm generate:types   # Re-generate payload-types.ts หลังแก้ collections
pnpm test:int     # Integration tests (Vitest)
pnpm test:e2e     # E2E tests (Playwright)
```

---

## Agent Roles

### 🔍 Code Reviewer
ตรวจก่อน commit ทุกครั้ง:
- Collection fields มี `label` และ `admin.description` ครบไหม?
- hooks ที่ trigger external request มี error handling ไหม?
- ไม่มี `any` หรือ hardcode secrets ใน code
- หลังแก้ collections รัน `pnpm generate:types` แล้วไหม?

### 🔒 Security Auditor
- Access control: `read: () => true` เหมาะสมกับ collection ไหม?
- Media upload: validate file type และ size ไหม?
- CORS และ CSRF config ถูก domain ไหม?
- Admin route ถูก protect ไหม?

### 🎨 QA Agent
- Field labels เป็นภาษาไทยชัดเจนไหม?
- admin.description อธิบาย field ให้ editor เข้าใจง่ายไหม?
- slug auto-generate ทำงานถูกต้องไหม?

### 🧪 Tester Agent
- Integration (Vitest): test collection hooks, slug generation
- E2E (Playwright): login, create post, upload media, publish
- ตรวจสอบว่า revalidate trigger ถูก call หลัง afterChange

### ✍️ Content Writer
เมื่อต้องการเพิ่มบทความใหม่ ต้องเตรียม:
1. title (ภาษาไทย)
2. slug (ภาษาอังกฤษ a-z, 0-9, -)
3. excerpt (≤160 ตัวอักษร)
4. category
5. รูปปก 1200x630px จาก Graphic Designer
6. imageAlt (มี keyword SEO)
7. content (Lexical rich text)
8. meta.title และ meta.description (ถ้า override จาก excerpt)

### 🖼️ Graphic Designer Agent (Ideogram)
Blog cover image spec สำหรับ upload เข้า Media:
- **ขนาด: 1200 x 630px** (ratio 16:9)
- เนื้อหาสำคัญอยู่ตรงกลาง (ขอบถูก crop เมื่อแสดงในการ์ด 360x192px)
- Style: clean, minimal — เข้ากับ theme สีเขียว (#496455)
- Tool: https://ideogram.ai

### 🗂️ Secretary Agent
- "เพิ่มบทความ" → Content Writer + SEO Specialist + Graphic Designer → upload ผ่าน CMS
- สรุปผลงานลง Notion ทุกครั้งหลังทำงานเสร็จ
