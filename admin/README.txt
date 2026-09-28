LEEPLUS Billing v1.7 Search/Dropdown Fix

ทับเฉพาะ:
- /admin/admin.js
- /admin/admin.css

ห้ามทับ index.html
ไม่แก้ Code.gs / Apps Script / SQL

แก้:
- port matching behavior จาก Frontend production: compact substring + token matching
- ค้น Brand + Model + Category ทุก PRICE category
- preload ALL stock statuses แต่ไม่แสดง HIDDEN
- OUT_OF_STOCK ยังเห็นพร้อมสถานะ
- dropdown ผูกกับแถวสินค้า, จำกัดความกว้าง/ความสูง, scroll
- dropdown ปิดหลังเลือก / click outside / Esc และเปิดทีละอัน
