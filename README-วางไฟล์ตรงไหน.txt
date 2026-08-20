PHASE 3E — LIVE SHEET TAB DROPDOWN

วางทับใน GitHub:
- /admin/admin.js
- /admin/admin.css

ไม่ต้องแก้ Code.gs
ไม่ต้อง Deploy Apps Script ใหม่

สิ่งที่แก้:
1. ตอน "เพิ่มหมวดใหม่" ซ่อน Google Sheet Tab
   เพราะระบบสร้าง Tab ให้อัตโนมัติอยู่แล้ว
2. ตอน "แก้ไขหมวดเดิม" ระบบจะดึงรายชื่อ Tab ล่าสุดจาก Google Sheet ทุกครั้งที่เปิดฟอร์ม
3. ถ้ามี Tab เพิ่มใหม่ จะเห็นใน Dropdown ทันที
4. Dropdown นี้ใช้สำหรับสลับ/เปลี่ยน Mapping ของหมวดเดิมเท่านั้น
