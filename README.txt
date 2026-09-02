LEEPLUS PRICE WEB — SPEED FIX 01 (RETAIL)
Baseline: v1.2.3
File replaced: price_sheet.js

แก้เฉพาะความเร็ว 4 จุด
1) ตัด Date.now() + cache:no-store ออกจาก meta / categories / GViz
2) categories โหลดครั้งเดียว แล้วใช้ร่วมกันทั้งหา category + PDF
3) meta + categories โหลดพร้อมกันด้วย Promise.all
4) categories cache 5 นาที (memory + localStorage)

ไม่ได้แตะ
- UI
- Search
- ราคา
- Compatibility logic
- Visual Catalog logic

วิธีใช้
แทนที่ไฟล์ price_sheet.js ฝั่ง Retail ด้วยไฟล์นี้ แล้วทดสอบหน้า Retail ก่อน
ยังไม่ต้องแตะ dealer/price_sheet.js ในรอบนี้
