PHASE 7A — PRICE SECTION HEADING + DEALER PDF

GitHub วางทับ:
- /index.html
- /dealer/home.html
- /admin/admin.js
- /dealer/price_sheet.js

หมายเหตุ:
- /app.js, /dealer/app.js, /price_sheet.html, /dealer/price_sheet.html ถูกแนบไว้เป็นฐานเดียวกัน แต่ถ้าไม่ได้แก้ใน GitHub รอบล่าสุด ไม่จำเป็นต้องวางทับใหม่

Google Apps Script:
- ใช้ Code.gs ใน ZIP แทนตัวปัจจุบัน
- Save > Deploy > Manage deployments > Edit > New version > Deploy

เพิ่ม:
1) หัวข้อ "รายการราคาสินค้า" ระหว่าง Banner กับ Card
   - ข้อความรอง: เลือกหมวดสินค้าเพื่อดูรายการราคาและดาวน์โหลดใบราคา
   - Desktop มีเส้น/ไอคอน, Mobile compact

2) Dealer PDF แยกจาก Retail PDF
   - Backoffice > หมวดสินค้า เพิ่ม "PDF ราคาตัวแทนจำหน่าย"
   - เลือกจากคลัง/อัปโหลดได้
   - บันทึกลง dealer_pdf_url
   - Dealer page ใช้เฉพาะ dealer_pdf_url
   - ถ้ายังไม่มี Dealer PDF = ไม่แสดงปุ่ม PDF
   - Retail page ยังใช้ pdf_url เดิม
