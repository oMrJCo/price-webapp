PHASE 5B — DEALER & CONTACT CONTROL

GitHub วางทับ:
- /admin/index.html
- /admin/admin.js
- /admin/admin.css
- /index.html
- /app.js
- /dealer/home.html
- /dealer/app.js
- /dealer/price_sheet.html
- /dealer/price_sheet.js

Google Apps Script:
- ใช้ Code.gs ใน ZIP แทน Code.gs ปัจจุบัน
- Save
- Deploy > Manage deployments > Edit > New version > Deploy

Backoffice:
- เมนูใหม่ "ตั้งค่าเว็บไซต์"
- LINE / Facebook / เบอร์โทร + เปิด/ปิด
- ตั้ง/เปลี่ยนรหัสตัวแทน
- หมวดสินค้าเพิ่ม "หน้าตัวแทนจำหน่าย" เปิด/ปิดได้

Frontend:
- แสดงช่องทางติดต่อจาก Backoffice
- กด "ราคาตัวแทนจำหน่าย" แล้วกรอกรหัสใน Popup
- รหัสตรวจจาก Apps Script
- Dealer Home ใช้ UI / Hero / Contact / Cards แบบเดียวกับหน้าปกติ
- หมวดที่ปิด Dealer จะไม่แสดง Card ใน Dealer Home
- Dealer price sheet ใช้ dealer_price เป็นหลัก
- หน้า Dealer price ใช้ HTML ชุดเดียวกับหน้าปกติ

หมายเหตุ:
- หมวดเก่าที่ dealerEnabled ว่าง = เปิด Dealer เพื่อไม่ให้ข้อมูลหาย
- รหัส fallback เดิม LEEPLUS2026 จนกว่าจะตั้งรหัสใหม่
