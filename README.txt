LEEPLUS PRICE WEB — SPEED FIX 02 (RETAIL)
Baseline: v1.2.3 + Speed Fix 01

เปลี่ยนเฉพาะความเร็ว
- เริ่ม GViz พร้อมกับ meta/categories ทันที ไม่รอกันเป็นทอด
- GViz cache 5 นาที
- meta cache 5 นาที
- ถ้ามี cache ใช้ข้อมูลเดิมทันที แล้ว refresh เบื้องหลัง
- request เดียวกันในรอบเดียวใช้ promise ร่วมกัน ไม่ยิงซ้ำ

ไม่ได้แตะ
- UI
- Search
- ราคา / logic ราคา
- Compatibility
- Visual Catalog
- Dealer

วิธีใช้
1) แทนที่ไฟล์ price_sheet.js ฝั่ง Retail ด้วยไฟล์ในชุดนี้
2) Commit
3) ทดสอบเวลาเข้าหมวดครั้งแรก
4) ออกจากหมวดแล้วกลับเข้าหมวดเดิมอีกครั้งภายใน 5 นาที เพื่อดูผล cache
