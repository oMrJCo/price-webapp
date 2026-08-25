CHANGE 03 — DYNAMIC CONTACT MANAGER

ไฟล์ GitHub:
- /app.js
- /dealer/app.js
- /admin/admin.js

Google Apps Script:
- Code.gs

Backoffice ใหม่:
- เพิ่ม/ลบช่องทางติดต่อ
- ชื่อช่องทาง
- ข้อความรอง
- Action: URL / โทรศัพท์
- URL หรือเบอร์โทร
- อัปโหลด Icon เอง
- เลือก Accent Color
- เปิด/ปิด
- แสดง Contact Card
- แสดง Bottom CTA
- ลำดับ

การทำงาน:
- ค่า LINE/Facebook/Phone เดิมถูกใช้เป็น fallback อัตโนมัติ ถ้ายังไม่มี contacts JSON
- เมื่อบันทึก Contact Manager ครั้งแรก ระบบใช้ contacts JSON เป็นหลัก
- Retail และ Dealer ใช้ Contact Manager ชุดเดียวกัน
- Bottom CTA เลือกจากรายการที่ติ๊ก "แสดงแถบด้านล่าง"
- แนะนำเลือก Bottom CTA เพียง 1 รายการ (ระบบใช้รายการแรกตามลำดับ)
