PHASE 3C — UPLOAD MANAGER

GitHub
วางทับ:
- /admin/admin.js
- /admin/admin.css

Google Apps Script
- ใช้ Code.gs ใน ZIP แทน Code.gs ปัจจุบัน
- Save
- Deploy > Manage deployments > Edit > New version > Deploy
- ครั้งแรก Google อาจขออนุญาตเข้าถึง Google Drive ให้กดยอมรับ

การทำงาน
- ใน เพิ่ม/แก้ไขหมวด มีปุ่ม “อัปโหลดรูป” และ “อัปโหลด PDF”
- เลือกไฟล์จากเครื่องได้โดยตรง
- ระบบสร้างชื่อไฟล์ใหม่อัตโนมัติ
- สร้างโฟลเดอร์ My Drive: LEEPLUS Price Web Uploads/images และ /pdfs
- อัปโหลดแล้ว URL จะเติมเข้าฟอร์มอัตโนมัติ
- กดบันทึกหมวดเพื่อบันทึก URL ลง Sheet categories

ข้อจำกัดที่ตั้งไว้:
- รูปสูงสุด 8 MB
- PDF สูงสุด 20 MB

หมายเหตุ:
รอบนี้เลือก Google Drive เป็นที่เก็บไฟล์เพื่อไม่ต้องฝัง GitHub token ในหน้าเว็บ และไม่ต้องมี server เพิ่ม
