PHASE 5B.2 — CONTACT + LOGO FIX

GitHub วางทับ:
- /index.html
- /app.js
- /dealer/home.html
- /dealer/app.js

Google Apps Script:
- ใช้ Code.gs ใน ZIP แทน Code.gs ปัจจุบัน
- Save
- Deploy > Manage deployments > Edit > New version > Deploy

แก้:
1) เบอร์โทรเก็บเป็น Text เพื่อรักษาเลข 0 นำหน้า
   หลัง Deploy ให้กลับ Backoffice > ตั้งค่าเว็บไซต์ > ใส่เบอร์โทรใหม่อีกครั้ง > บันทึก
2) Logo LEEPLUS ถ้ารูปเสีย จะไม่โชว์ broken image/alt text และใช้ fallback "LP"
3) Contact Bar จัดใหม่ให้สวยขึ้นทั้ง Desktop/Mobile

ไม่แตะ Dealer login / category toggle
