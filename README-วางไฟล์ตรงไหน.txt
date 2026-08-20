PHASE 3A — BACKOFFICE ↔ GOOGLE SHEET (ฝั่งเว็บ)

วางทับใน GitHub:
- /admin/admin.js
- /admin/admin.css

ไฟล์ /admin/index.html ในชุดนี้เหมือน Phase 2.2 หากพี่อัปไปด้วยก็ไม่เป็นไร

สิ่งที่เพิ่ม:
- หน้า Google Sheet เรียก API ด้วย action=tabs
- แสดง Tab ที่เชื่อมแล้ว
- แสดง Tab ที่ยังไม่มีหมวด
- แสดง Mapping ที่หา Tab จริงไม่เจอ
- ปุ่มรีเฟรช Google Sheet

ตอนนี้ Apps Script ตัวเดิมของเว็บยังต้องเพิ่ม action=tabs อีก 1 จุด
หากยังไม่ได้เพิ่ม หน้า Google Sheet จะแสดงข้อความว่า "รอเพิ่ม Tabs API ที่ Google Apps Script"

ขั้นถัดไป:
ส่ง Code.gs / โค้ด Apps Script ตัวปัจจุบันมาให้ยิ้ม แล้วจะเพิ่ม action=tabs โดยไม่รื้อ API เดิม
