LEEPLUS Store Access 03 — Frontend Popup

ไฟล์ที่ใช้:
- index.html
- store_access.js

รอบนี้เพิ่มเฉพาะ Store Access UI/Flow:
1. ปุ่ม "สิทธิ์ดูราคา" บนหน้า Retail
2. Popup 2 โหมด
   - มีสิทธิ์แล้ว: กรอกเบอร์ 10 หลัก
   - ลงทะเบียนร้านค้า
3. ช่องเบอร์รับเฉพาะตัวเลข และจำกัด 10 หลัก
4. สมัคร -> storeRegister
5. Login -> storeLogin
6. จำอุปกรณ์ด้วย token ใน localStorage
7. เปิดเว็บครั้งต่อไป -> storeValidateToken
8. Approved แสดงชื่อร้านบนปุ่ม
9. มีคำสั่ง "ลืมสิทธิ์ในอุปกรณ์นี้"

สำคัญ:
- Phase 03 ยังไม่ล็อกราคา
- Dealer Code เดิมยังทำงานเหมือนเดิม
- ไม่แก้ app.js / Contact / Promotion Popup / Analytics / Speed Fix
- หลังเทส Flow ครบแล้ว Phase ถัดไปจึงทำ Price Gate จริง

ไฟล์ index.html ใช้ฐาน Retail index(6).html ที่มี Dealer Access เดิม
