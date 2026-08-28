LEEPLUS CHANGE 04.1 — FINAL PERFORMANCE & POLISH

GitHub วางทับ:
- /admin/admin.js
- /app.js
- /dealer/app.js

Code.gs:
- แนบไว้เป็น backup
- ถ้า Change04 Deploy แล้ว ไม่ต้อง Deploy Apps Script ใหม่

สิ่งที่จบในรอบนี้:
- Backoffice ไม่สแกนทุก Sheet ตอนเปิด
- Dashboard ใช้ cache และคำนวณหนักเฉพาะตอนกด Refresh
- โหลด Sheet Tabs แบบ lazy
- เปลี่ยนเมนูระหว่าง Refresh แล้วไม่ repaint ทับหน้าอื่น
- วันที่ Dashboard อ่านง่าย
- Contact checkbox/label ไม่แตกบรรทัด
- Contact Desktop ย่ออัตโนมัติแถวเดียว / Mobile 2 columns
- ไม่มี Icon ไม่สร้างวงกลมเปล่า

หลังลง:
1. Ctrl+F5
2. สลับเมนู 5-6 ครั้ง ต้องเปิดเร็วขึ้น
3. กลับ Dashboard จะขึ้น cache/ข้อมูลพื้นฐานทันที
4. กด Refresh Dashboard 1 ครั้งเมื่อต้องการตัวเลขล่าสุด
