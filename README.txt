LEEPLUS — MULTI PARENTHESIS TAG FIX

วางทับ GitHub 2 ไฟล์:
1. /price_sheet.js
2. /dealer/price_sheet.js

แก้ Logic:
- เดิมอ่าน Auto Tag เฉพาะวงเล็บชุดสุดท้าย
- ใหม่อ่านวงเล็บได้ทุกตำแหน่งในชื่อรุ่น
- (NEW) = Badge NEW เหมือนเดิม
- วงเล็บข้อมูลความจุแบบตัวเลข เช่น (3,349 mAh up to 3,640 mAh) = ข้อความปกติ
- วงเล็บ Tag เช่น (เพิ่มความจุ 3,630 mAh), (ปรับราคาลง), (สินค้ามาใหม่) = Badge สีเหลือง
- ข้อความนอกวงเล็บ เช่น ชิ้นส่วนแท้ = แสดงเป็นข้อความปกติ
- แก้ทั้ง Retail และ Dealer

ตัวอย่าง:
iPhone 15 : (3,349 mAh up to 3,640 mAh) (NEW)
=> iPhone 15 : (3,349 mAh up to 3,640 mAh) + NEW badge

iPhone 13 (เพิ่มความจุ 3,630 mAh) ชิ้นส่วนแท้
=> iPhone 13 + [เพิ่มความจุ 3,630 mAh] badge + ชิ้นส่วนแท้
