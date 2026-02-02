# LEEPLUS Price WebApp — Project Context

ไฟล์นี้ใช้สำหรับ “ล็อกบริบทโปรเจกต์”
เพื่อให้เริ่มแชท / ส่งต่องาน / กลับมาทำต่อ
โดยไม่ต้องอธิบายใหม่ทุกครั้ง

---

## ภาพรวมโปรเจกต์
- ชื่อโปรเจกต์: **LEEPLUS Price WebApp**
- ลักษณะ: เว็บแสดงราคาสินค้า
- Frontend: HTML / CSS / Vanilla JS
- Hosting: GitHub Pages
- ฐานข้อมูล: **Google Sheet (Public, CSV)**

---

## โครงสร้างข้อมูล (Google Sheet)
- 1 หมวดสินค้า = 1 Sheet Tab
- ใช้ Sheet เดียว แต่หลายแท็บ

### Column ที่ใช้ (ชื่อ exact)
- `brand`
- `model`
- `price`
- `image_url`
- `updated`

> หมายเหตุ:
> - `image_url` ต้องเป็นลิงก์รูปที่เปิดตรงได้ (เช่น GitHub Pages)
> - ไม่ใช้รูปที่ฝังใน cell / IMAGE() / Google Drive

---

## หน้าแสดงราคา
ไฟล์หลัก:
- `price_sheet.html`
- `price_sheet.js`

สถานะ: **FINAL / Stable**

---

## ฟีเจอร์ที่ทำแล้ว (สำคัญ)
- แสดงข้อมูลจาก Google Sheet แบบ real-time
- Tab ยี่ห้อสินค้า + Tab **All**
- โหมด All:
  - จัดกลุ่มตาม `brand`
  - มีหัวกลุ่มแบบ pill (Brand Header)
  - ลำดับรายการ = ตามแถวใน Google Sheet (ไม่ sort)
- Search:
  - ค้นหาข้ามยี่ห้อได้
  - ไม่ต้องเลือกยี่ห้อก่อน
  - รองรับคำค้นยืดหยุ่น:
    - `iphone15`
    - `iphone 15`
    - `15 pro`
    - `pro max`
    - `ip15` (alias → iphone)
- Popup รูปสินค้าเมื่อคลิก thumbnail
- แก้ bug แล้ว:
  - เปลี่ยนแท็บกดครั้งเดียวติด
  - ไม่ต้องกดซ้ำ / ไม่ต้องกลับ All ก่อน

---

## UX / กติกาการพัฒนา (สำคัญมาก)
- ทุกครั้งที่แก้โค้ด:
  - **ขอ code ทั้งไฟล์**
  - ไม่รับ patch ทีละจุด
  - ไม่ให้ไปหาที่วางเอง
- เป้าหมาย UX:
  - ใช้งานง่าย
  - คิดแบบผู้ใช้หน้าร้าน
  - ดูเป็นเว็บจริง ไม่ใช่งานทดลอง

---

## แนวคิดต่อยอด (ยังไม่ทำ)
- Sticky brand header เวลา scroll
- Export / เปิด PDF แยกตามยี่ห้อ
- Cache / Offline-friendly
- Admin workflow เพิ่มเติม

---

## วิธีใช้ไฟล์นี้
เมื่อเริ่มแชทใหม่ ให้แปะไฟล์นี้หรือบอกว่า:

> “อ้างอิง PROJECT_CONTEXT.md ใน repo”

เพื่อให้เข้าใจโปรเจกต์ตรงกันทันที
