LEEPLUS Speed Fix Restart 01 — Retail

ฐานงาน:
- price_sheet.js ตัว Retail หลัง Rollback ที่พี่ส่งมารอบล่าสุด
- ใช้ Speed Fix data-loading path ที่เราเคยทดสอบผ่านที่ประมาณ 2–3 วินาที

แก้เฉพาะความเร็ว:
1. Meta cache 5 นาที + background refresh
2. Categories cache 5 นาที และโหลดครั้งเดียวใช้ร่วมกัน
3. GViz cache 5 นาที + background refresh
4. แชร์ in-flight request ไม่ยิง request เดิมซ้ำ
5. เริ่มโหลด GViz พร้อมกับ Meta/Categories เพื่อลดเวลารอแบบต่อคิว
6. ตัด Date.now()/no-store ออกจาก request ข้อมูลหลัก

ไม่แตะ:
- UI
- Search
- ราคา
- Compatibility
- Visual Catalog
- Auto Badge
- Contact / Promotion Popup
- Analytics

ขั้นตอน:
1. แทน price_sheet.js ฝั่ง Retail
2. Commit / Push
3. เปิดหมวดราคา Retail และจับเวลา
4. ถ้าผ่าน ค่อยทำ Dealer ต่อ
