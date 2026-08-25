CHANGE 02 — STEP 7 SMART COMPATIBILITY UI

วางทับ:
- /price_sheet.js
- /dealer/price_sheet.js

เปลี่ยนเฉพาะหมวด categoryType=COMPATIBILITY:
- 1 code = 1 กลุ่ม
- ภายในเป็นตาราง Brand | Models
- ไม่แตกแต่ละ Brand เป็น Card
- ถ้ามี image_url ของรหัส แสดงรูปในหัวกลุ่ม
- รูปเสียซ่อนอัตโนมัติ
- Search:
  * ค้น LP16 = แสดงทั้ง LP16
  * ค้น Y27 = แสดง LP16 เฉพาะ Brand/row ที่มี Y27
  * ค้น Xiaomi = แสดงทุก code ที่มี Xiaomi เฉพาะแถว Xiaomi
  * ค้นชื่อรุ่นได้จากข้อความ models
- หมวด PRICE เดิมไม่แตะ
