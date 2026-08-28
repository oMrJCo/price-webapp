LEEPLUS FINAL CLEANUP — REMOVE LEGACY PRICE VIEWER

1) วางทับ GitHub:
- /app.js
- /dealer/app.js

2) รอ GitHub Pages อัปเดต แล้ว Ctrl+F5

3) ทดสอบ Retail + Dealer เปิดหมวดสินค้า 1-2 หมวด

4) ถ้าปกติ ลบได้:
- /price.html
- /price.js

ผล:
- ถอด dependency ของ Legacy Price Viewer แล้ว
- หมวดที่ใช้ sheetTab ยังเปิด price_sheet.html เหมือนเดิม
- fallback หมวดเก่าที่มี PDF แต่ไม่มี Sheet จะเปิด PDF โดยตรง
- ไม่แตะ price_sheet.html / price_sheet.js
