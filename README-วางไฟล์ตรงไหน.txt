PHASE 4C — PICKER + PDF FRONTEND

GitHub วางทับ 4 ไฟล์:
- /admin/admin.js
- /admin/admin.css
- /price_sheet.js
- /dealer/price_sheet.js

ไม่ต้องแก้ Code.gs
ไม่ต้อง Deploy Apps Script ใหม่

สิ่งที่เพิ่ม:
1. หน้าแก้ไขหมวด
- รูปหมวด: มี "เลือกจากคลัง" + "อัปโหลดรูป"
- PDF: มี "เลือกจากคลัง" + "อัปโหลด PDF"
- เลือกไฟล์จากคลังแล้ว URL + Preview ถูกใส่ในฟอร์มอัตโนมัติ
- กดบันทึกหมวดตามปกติ

2. หน้าใบราคา
- แก้ให้ระบบอ่าน pdf_url ที่ Backoffice บันทึกอยู่
- ถ้าหมวดมี PDF ปุ่ม "เปิด PDF" ที่มีอยู่เดิมจะแสดงอัตโนมัติ
- แก้ทั้งหน้าปกติและ /dealer/

ไม่แตะ:
- Login
- Google Sheet Mapping logic
- ระบบราคา
- Code.gs
