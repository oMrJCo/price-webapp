CHANGE 04 — BACKOFFICE SMART UI + LIVE DASHBOARD

สำคัญ:
ชุดนี้ merge Dynamic Contact Manager + Category Type/Compatibility กลับไว้ครบแล้ว

Google Apps Script:
- Code.gs
- Deploy New version

GitHub:
- /app.js
- /dealer/app.js
- /admin/admin.js

สิ่งที่เปลี่ยน:
1. Live Dashboard
- หมวดเปิดใช้งาน / ทั้งหมด
- จำนวนรายการรวมจากทุก Sheet
- NEW / Auto Tag
- จุดที่ต้องตรวจสอบ
- Category Status: จำนวนรายการ, รูป, PDF, Dealer PDF, updated
- System Health
- Quick Actions
- Refresh อ่านข้อมูลสด

2. Backoffice UI Refresh
- panel/card/spacing ใหม่
- Settings หน้าเดียวอ่านง่ายขึ้น
- Contact Manager compact
- Sticky Save bar
- Responsive notebook/tablet

3. Contact Frontend
- Desktop อยู่แถวเดียว ย่ออัตโนมัติตามจำนวน
- Mobile 2 columns
- ไม่มี Icon = ไม่แสดงวง icon เปล่า
- Retail / Dealer ใช้ข้อมูลเดียวกัน

4. Preserved
- Category Type: PRICE / COMPATIBILITY
- Auto-create Sheet ตาม Category Type
- Dealer / PDF / Upload / Media / Category logic เดิม
