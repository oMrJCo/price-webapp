PHASE 5A — FRONTEND UI REFRESH

วางทับ GitHub:
- /index.html
- /app.js

ไม่แตะ Backoffice / Code.gs / Google Sheet / price_sheet.js

สิ่งที่แก้:
- Hero Desktop ใช้ 16:5 จริง ตรงกับ Artwork 1600 × 500 px
- Mobile ใช้ 16:7 เพื่อให้ดูง่าย แต่ยังไม่บิดภาพ
- object-fit: cover และไม่ยืดภาพ
- ถ้า Banner ไม่ใส่หัวข้อ/ข้อความรอง จะไม่เอาข้อความ default ไปทับ artwork
- ปรับ arrow/dot ของ Slider ให้เล็กและไม่กินพื้นที่สื่อ
- Header และปุ่มราคาตัวแทนดูสะอาดขึ้น
- Category cards จัด spacing/เงา/ขนาดใหม่
- Mobile แสดงหมวด 2 คอลัมน์ ลดความยาวหน้า

ขนาดสื่อที่ยึด:
- Hero: 1600 × 500 px (16:5)
- Safe area: ประมาณ 1400 × 420 px
