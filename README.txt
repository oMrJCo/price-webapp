LEEPLUS PRICE WEB — SPEED FIX DEALER 02
Baseline: Dealer current

แก้จริงรอบนี้
- เพิ่ม cache 5 นาทีสำหรับ meta / categories / GViz
- ตัด Date.now() + cache:no-store ออกจาก request หลัก
- categories โหลดครั้งเดียว ใช้ร่วมกับ category + Dealer PDF
- meta + categories โหลดพร้อมกัน
- เริ่ม GViz ตั้งแต่ต้นหน้า ไม่รอ meta/categories
- request เดียวกันใช้ in-flight promise ร่วมกัน
- มี cache แล้วแสดงของเดิมทันที และ refresh เบื้องหลัง

คงของเดิม
- dealer_price มาก่อน และ fallback ไป price
- Dealer PDF: dealer_pdf_url / dealer_pdf / dealerPdf
- UI / Search / Compatibility / Visual Catalog ไม่เปลี่ยน

วิธีใช้
1) เอา price_sheet.js ไปแทน dealer/price_sheet.js
2) ใน GitHub Desktop ต้องเห็น diff จริง ไม่ควรขึ้น No content changes found
3) Commit
4) ทดสอบเวลาเข้าหมวดครั้งแรก และกลับเข้าหมวดเดิมภายใน 5 นาที
