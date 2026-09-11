LEEPLUS Pretty URL 01
=======================

เป้าหมาย
- เปลี่ยน URL หน้าราคาจาก:
  /price_sheet.html?tab=Lens%20Camera%20Film%20Model%20List
  เป็น:
  /price/lens-camera-film

ไฟล์ที่ต้องวางที่ ROOT ของ GitHub Pages
1) price_sheet.js  -> ทับไฟล์เดิม
2) 404.html        -> เพิ่มไฟล์ใหม่ (ถ้ามี 404.html เดิม ให้สำรองไว้ก่อน)

วิธีทำงาน
- ลิงก์เก่า ?tab=... ยังใช้ได้เหมือนเดิม
- เมื่อหน้าโหลดสำเร็จ URL จะเปลี่ยนเป็น /price/<ชื่อหมวด> อัตโนมัติ
- ถ้าเปิด/รีเฟรช Pretty URL โดยตรง GitHub Pages จะเข้า 404.html
  แล้วส่งกลับ price_sheet.html?slug=... อัตโนมัติ
- ระบบ resolve slug กลับเป็น sheetTab จริงจาก Categories API
- ไม่ต้องเปลี่ยนชื่อ Sheet
- ไม่แตะ Backoffice / Store Access / Telegram / SMS / Dealer

Override ที่ใส่ไว้:
Lens Camera Film Model List -> lens-camera-film

ทดสอบ:
https://jackleeplus.com/price_sheet.html?tab=Lens%20Camera%20Film%20Model%20List
หลังโหลด URL ควรกลายเป็น:
https://jackleeplus.com/price/lens-camera-film

จากนั้น Refresh ที่ URL สวยอีก 1 ครั้ง ต้องเปิดหน้าเดิมได้
