CHANGE 02 — STEP 1
1) GitHub: วางทับ /admin/admin.js
2) Apps Script: วาง Code.gs ทั้งไฟล์ แล้ว Deploy เวอร์ชันใหม่
3) Backoffice > เพิ่มหมวดสินค้า จะมี 'รูปแบบรายการ'
   - รายการราคา = PRICE
   - รายการรุ่น / Compatibility = COMPATIBILITY
4) หมวดเดิมถูกอ่านเป็น PRICE หากไม่มี categoryType
5) หมวดใหม่ Compatibility จะสร้างหัว Sheet:
   type | code | brand | models | image_url | updated
รอบนี้ยังไม่แก้ Frontend render ของ Compatibility
