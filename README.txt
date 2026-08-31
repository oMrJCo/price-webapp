LEEPLUS v1.1 — Promotion Popup + Drag Sort

งาน 1: Promotion Popup 1:1
- ตั้งค่าที่ Backoffice > ตั้งค่าเว็บไซต์ > Promotion Popup
- เปิด/ปิด
- Artwork 1:1 แนะนำ 1080x1080
- อัปโหลดใหม่ หรือเลือกจาก Media Library
- วันเริ่ม / วันสิ้นสุด
- Retail / Dealer / ทั้งคู่
- ทุกครั้ง / วันละครั้ง / ครั้งเดียว
- ไม่มี CTA
- X หรือคลิกพื้นที่ด้านนอกเพื่อปิด
- หมดวันสิ้นสุดแล้วหยุดแสดงอัตโนมัติ

งาน 2: Drag & Drop Category Sort
- หน้า Backoffice > หมวดสินค้า
- จับ ⠿ ด้านซ้ายแล้วลากขึ้น/ลง
- ปล่อยแล้วบันทึก sort 1,2,3... ลง Google Sheet อัตโนมัติ
- Retail / Dealer อ่าน sort ใหม่เหมือนเดิม
- ไม่ต้องกรอกเลข sort เอง

ไฟล์ GitHub วางทับ:
- /app.js
- /dealer/app.js
- /admin/admin.js
- /admin/admin.css

Apps Script:
- ใช้ Code.gs ใน ZIP วางทับทั้งไฟล์
- Save
- Deploy > Manage deployments > Edit > New version > Deploy

ลำดับติดตั้ง:
1. Deploy Code.gs ก่อน
2. วาง 4 ไฟล์ GitHub
3. Ctrl+F5
4. เทส Drag Sort
5. ตั้ง Promotion Popup และเทส Retail/Dealer

หมายเหตุ:
- ชุดนี้สร้างต่อจาก Production v1.0 + Final Cleanup + Multi Parenthesis Tag Fix
- ไม่คืน Legacy price.html / price.js
