PHASE 5B.5 — LOGO DISPLAY FIX

วางทับ GitHub แค่:
- /admin/admin.js
- /app.js
- /dealer/app.js

ไม่ต้องแก้ Code.gs
ไม่ต้อง Deploy Apps Script ใหม่
ไม่แตะ PDF / Google Sheet / Dealer logic

แก้เฉพาะ:
1. Logo spec ใน Backoffice = 512 × 512 px (1:1)
2. Frontend bug: app.js และ dealer/app.js ลืม map siteMeta.logoUrl -> data.logoUrl
   ทำให้แม้ Backoffice บันทึก Logo สำเร็จ หน้าเว็บก็อ่านค่าเป็นว่าง
3. หลังวางไฟล์ กด Ctrl+F5
