LEEPLUS Backoffice Billing v1.7
================================

รอบนี้แก้เฉพาะ Frontend Backoffice 2 ไฟล์:
- admin.js
- admin.css

ห้ามทับ index.html
ไม่ต้องแก้ Apps Script / Code.gs
ไม่ต้องรัน SQL เพิ่ม

สิ่งที่แก้:
1) 1 แถว = 1 รายการ และค้นสินค้าในแถวนั้น
2) Search normalize เช่น iphone12 = iphone 12
3) พยายามโหลด Product DB ทุกหมวดในครั้งเดียว; fallback โหลดทุก category
4) dropdown ปิดหลังเลือก / click outside / Esc
5) สินค้านอกระบบใช้ในแถวเดิม
6) ประวัติบิลค้นหาเลขบิล/ชื่อ/เบอร์
7) ดูรายละเอียดบิล
8) พิมพ์ / บันทึก PDF (ผ่าน Print dialog)
9) ทำบิลใหม่จากบิลเก่า
10) ค้นลูกค้าเดิมจากประวัติบิล
