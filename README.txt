CHANGE 01 — PRODUCT IMAGE PER ROW

วางทับ GitHub:
- /price_sheet.js
- /dealer/price_sheet.js

โครง Sheet เดิมรองรับ image_url รายสินค้าอยู่แล้ว:
brand | model | price | dealer_price | image_url

พฤติกรรม:
- image_url มีค่าและโหลดได้ = แสดงรูปสินค้าหน้ารายการ
- image_url ว่าง = ไม่สร้างกรอบรูป
- image_url เสีย/โหลดไม่ได้ = ลบกรอบรูปอัตโนมัติ เหลือข้อความสินค้า
- Retail / Dealer ใช้รูปเดียวกัน
- ไม่แตะราคา, PDF, Brand, Category Image หรือ Backoffice

รอบนี้ยังไม่ทำ Compatibility (Change 02)
