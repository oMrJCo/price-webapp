PHASE 4A.2 — GALLERY + SHEET SYNC FIX

วางทับใน GitHub:
- /admin/admin.js
- /admin/admin.css

ไม่ต้องแก้ Code.gs
ไม่ต้อง Deploy Apps Script ใหม่

แก้ 2 จุด:
1) Media Gallery
- กรอบรูปทุกใบล็อกที่ 220px
- รูปแนวตั้ง/แนวนอน/สี่เหลี่ยมอยู่ในกรอบเท่ากัน
- ใช้ contain ไม่ตัดรูป
- การ์ดและปุ่มเรียงแนวเดียวกัน

2) Google Sheet
- Mapping ใช้ข้อมูล categories จาก Google Sheet จริง ไม่ใช่ categories.json เก่า
- ปุ่ม "รีเฟรชจาก Google Sheet" โหลดทั้งรายชื่อ Tabs และ categories ใหม่พร้อมกัน
- หมวดที่ผูกแล้วจะขึ้น "เชื่อมแล้ว" ถูกต้องทันที
