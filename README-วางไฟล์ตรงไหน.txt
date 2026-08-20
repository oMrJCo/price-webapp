PHASE 4D — HERO BANNER + BRAND LOGO MANAGER

GitHub วางทับ:
- /admin/admin.js
- /admin/admin.css
- /app.js

Google Apps Script:
- ใช้ Code.gs ใน ZIP แทน Code.gs ปัจจุบัน
- Save
- Deploy > Manage deployments > Edit > New version > Deploy

เมนู รูปและสื่อ จะเพิ่ม:

1) สื่อหน้าแรก / Hero Banner
- ขนาดแนะนำ 1600 × 500 px (16:5)
- Safe Area แนะนำ 1400 × 420 px
- เลือกจาก Media Library ได้
- เพิ่มหลาย Banner ได้ (สูงสุด API รองรับ 10)
- หัวข้อ / ข้อความรอง / Link เป็น optional
- ตั้งเวลาเปลี่ยน Slide 2–10 วินาที
- Frontend อ่านค่าจาก meta.sheet แล้วแสดง Slider เดิม

2) โลโก้แบรนด์
- เลือก Sheet Tab/หมวด
- ระบบอ่าน Unique brand จากคอลัมน์ brand ของสินค้าจริง
- ตัด __META__ / __BRAND_IMAGE__ / __CATEGORY_IMAGE__ ออกจากรายการ
- ขนาดแนะนำ 256 × 256 px (1:1), PNG/WebP พื้นหลังโปร่งใส
- เลือกจากคลังหรืออัปโหลดใหม่ได้
- โลโก้ถูกเก็บใน meta sheet: type=brand, key=ชื่อแบรนด์, value=URL
- หน้า price_sheet เดิมรองรับ meta.brand อยู่แล้ว จึงไม่ต้องแก้ price_sheet.js รอบนี้

หมายเหตุ:
- รอบนี้ยังไม่ลบแถว __BRAND_IMAGE__ เก่าในสินค้า เพราะ Frontend ยังมี fallback อยู่
- เมื่อระบบใหม่ผ่าน ค่อย Cleanup ของเก่า
