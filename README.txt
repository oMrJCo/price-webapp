PHASE 5B.1 — SETTINGS MENU FIX

วางทับ GitHub แค่:
- /admin/admin.js

ไม่ต้องแก้ admin/index.html
ไม่ต้องแก้ CSS
ไม่ต้องแก้ Code.gs
ไม่ต้อง Deploy Apps Script ใหม่

แก้:
- เมนู "ตั้งค่าเว็บไซต์" เชื่อมกับ renderSettingsView จริง
- กดแล้วต้องเปิดหน้าตั้งค่า LINE / Facebook / เบอร์โทร / รหัสตัวแทน
- เพิ่ม defensive routing ป้องกันเมนูที่ไม่มี view ทำให้หน้านิ่ง
