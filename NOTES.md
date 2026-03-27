# Project Notes — LINE Food Bot

## Live URLs
| | URL |
|---|---|
| **Service** | https://line-food-bot-112094662355.asia-southeast1.run.app |
| **Webhook** | https://line-food-bot-112094662355.asia-southeast1.run.app/webhook |
| **Health** | https://line-food-bot-112094662355.asia-southeast1.run.app/ |
| **GCP Project** | `my-line-bot-123456` |
| **Region** | `asia-southeast1` (Singapore) |

---

## วิธี Deploy (ที่ทำงานจริง)

```bash
# 1. Build image ไปที่ GCR (ไม่ใช่ Artifact Registry)
gcloud builds submit --tag gcr.io/my-line-bot-123456/line-food-bot .

# 2. Deploy พร้อม env vars (อ่านจาก .env ผ่าน python เพราะไฟล์มี BOM)
LINE_CHANNEL_SECRET=$(python3 -c "import re; content=open('.env','r',encoding='utf-8-sig').read(); print(re.search(r'LINE_CHANNEL_SECRET=(.+)', content).group(1).strip())") && \
LINE_CHANNEL_ACCESS_TOKEN=$(python3 -c "import re; content=open('.env','r',encoding='utf-8-sig').read(); print(re.search(r'LINE_CHANNEL_ACCESS_TOKEN=(.+)', content).group(1).strip())") && \
GEMINI_API_KEY=$(python3 -c "import re; content=open('.env','r',encoding='utf-8-sig').read(); print(re.search(r'GEMINI_API_KEY=(.+)', content).group(1).strip())") && \
gcloud run deploy line-food-bot \
  --image gcr.io/my-line-bot-123456/line-food-bot:latest \
  --region asia-southeast1 \
  --allow-unauthenticated \
  --port 3000 \
  --set-env-vars "LINE_CHANNEL_SECRET=${LINE_CHANNEL_SECRET},LINE_CHANNEL_ACCESS_TOKEN=${LINE_CHANNEL_ACCESS_TOKEN},GEMINI_API_KEY=${GEMINI_API_KEY},BASE_URL=https://line-food-bot-112094662355.asia-southeast1.run.app"
```

---

## ปัญหาที่เจอและวิธีแก้

### ❌ ContainerImageImportFailed
**อาการ:** `gcloud run deploy --source .` สำเร็จแต่ revision deploy ไม่ได้ ขึ้น `ContainerImageImportFailed`

**สาเหตุ:** `--source .` push image ไปที่ **Artifact Registry** (`asia-southeast1-docker.pkg.dev`) แต่ Cloud Run ใน project นี้ pull จากตรงนั้นไม่ได้ (permission หรือ format ไม่ compatible)

**วิธีแก้:** ใช้ `gcloud builds submit --tag gcr.io/...` แทน แล้ว deploy จาก **GCR** (`gcr.io`) ซึ่งทำงานได้ปกติ

> อย่าใช้ `gcloud run deploy --source .` ในโปรเจกต์นี้

---

### ❌ `source .env` ทำงานไม่ถูกต้อง
**อาการ:** `.env: line 1: ﻿LINE_CHANNEL_SECRET=...: command not found` มีตัวอักษรแปลกๆ นำหน้า

**สาเหตุ:** ไฟล์ `.env` ถูกบันทึกด้วย **BOM (Byte Order Mark)** ทำให้ `source .env` อ่าน character แรกผิด

**วิธีแก้:** อ่าน .env ผ่าน Python แทน
```bash
VALUE=$(python3 -c "import re; content=open('.env','r',encoding='utf-8-sig').read(); print(re.search(r'KEY=(.+)', content).group(1).strip())")
```

---

### ❌ AI ตอบเรื่องนอก scope (เกม, ทั่วไป)
**อาการ:** user พิมพ์ "เกม" แล้ว bot ตอบ "อยากเล่นเกมอะไร"

**สาเหตุ:** SYSTEM_PROMPT บอกให้ Gemini ตอบ general chat ได้

**วิธีแก้:** เปลี่ยน prompt ให้ตอบ `{"intent": "unknown"}` สำหรับทุกอย่างที่ไม่ใช่อาหาร และลบ `intent: "chat"` handler ออกจาก reply.js

---

### ❌ เสีย Gemini token ทุกข้อความ
**อาการ:** ข้อความนอก scope เช่น "สวัสดี", "เกม" ก็ยังเรียก Gemini API

**สาเหตุ:** logic เดิมเรียก Gemini ทุกครั้งที่ keyword matching จับไม่ได้

**วิธีแก้:** เพิ่ม `FOOD_KEYWORDS` regex gate — เรียก Gemini เฉพาะเมื่อข้อความมีคำเกี่ยวกับอาหาร

```js
const FOOD_KEYWORDS = /หิว|hungry|กิน|ทาน|อาหาร|เมนู|ข้าว|.../i;
if (!result && FOOD_KEYWORDS.test(trimmed)) { /* เรียก Gemini */ }
```

---

## Architecture ของ Bot

```
User พิมพ์
    │
    ▼
[Keyword matching] ──จับได้──► ตอบเลย (ไม่เสีย token)
    │
   ไม่ได้
    │
    ▼
[FOOD_KEYWORDS check] ──ไม่ผ่าน──► fallback + Quick Reply
    │
   ผ่าน
    │
    ▼
[Gemini API] ──► intent: food ──► Carousel 3 เมนู + Quick Reply
              └── intent: unknown ──► fallback + Quick Reply
```

---

## Changelog

---

### 28 มี.ค. 2568

**UX/UI Improvements**
- Quick Reply buttons — ทุก response มีปุ่ม 🔄แนะนำอีกครั้ง / 🍽กินอะไรดี / 😋หิวมาก
- Carousel 3 เมนู — จากเดิม 1 การ์ด เปลี่ยนเป็น swipe ได้ 3 เมนูสุ่ม
- Badge สี — แต่ละเมนูมี tag อัตโนมัติ (แคลอรีต่ำ 🟢 / โปรตีนสูง 🔵 / อิ่มนาน 🟠 / เมนูแนะนำ 🟣)
- Welcome message — พิมพ์ "สวัสดี/hello" ตอบพร้อมปุ่มเลย ไม่ตอบ fallback

**Bug Fixes**
- AI ตอบนอก scope เช่น "เกม" → เปลี่ยน Gemini system prompt ให้ return `intent: unknown` แทน general chat
- เสีย token ทุกข้อความ → เพิ่ม `FOOD_KEYWORDS` gate ก่อนเรียก Gemini

**Deploy**
- แก้ปัญหา `ContainerImageImportFailed` จาก Artifact Registry → เปลี่ยนมาใช้ GCR
- เพิ่ม `.dockerignore` กัน `node_modules` และ `.env` ขึ้น Cloud Build
