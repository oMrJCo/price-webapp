PHASE 5B.4 — ADMIN CORE FIX

วางทับ GitHub แค่:
- /admin/admin.js

ไม่ต้องแก้ Code.gs
ไม่ต้อง Deploy Apps Script
ไม่ต้องแตะ Frontend / Dealer

แก้:
1) PDF Library
- คืน pdfFiles / pdfState / loadPdfLibrary() ที่หลุดหายตอนรวมไฟล์
- เมนู PDF ต้องโหลดรายการและอัปโหลดได้อีกครั้ง

2) Google Sheet
- แก้ s.unlinked -> s.unmapped
- เมนู Google Sheet ต้องเปิดได้และแสดงสถานะ Tabs ได้อีกครั้ง

3) Website Logo spec
- แนะนำ 320 × 120 px
- หรือ 512 × 192 px สำหรับความคมชัด
- เหมาะกับ Header มากกว่า 400 × 160 px
