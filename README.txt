CHANGE 02 — STEP 5 Compatibility Frontend

วางทับ:
- /price_sheet.js
- /dealer/price_sheet.js

ผล:
- categoryType=COMPATIBILITY จะอ่าน type|code|brand|models|image_url|updated
- จัดกลุ่มตาม code
- แสดง brand + models
- Search ค้น type/code/brand/models ได้
- ซ่อน Brand filter ของระบบราคาในหมวด Compatibility
- หมวด PRICE เดิมไม่เปลี่ยน
- Retail/Dealer Compatibility แสดงข้อมูลรุ่นเหมือนกัน (ไม่มีราคา)

ยังไม่ใช่ Final UI; รอบนี้ทดสอบ data/render/search ก่อน
