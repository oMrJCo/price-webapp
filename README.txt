LEEPLUS PRICE WEB — ANALYTICS 03 / RETAIL WEB INCLUDE

สาเหตุที่ไม่มีข้อมูล
- หน้าเว็บยังไม่ได้ include analytics.js

ไฟล์ในชุดนี้
- index.html
- price_sheet.html
- analytics.js

สิ่งที่แก้
- หน้าแรกเพิ่ม <script src="/analytics.js" defer></script>
- หน้าราคาเพิ่ม <script src="/analytics.js" defer></script>
- ใช้ path /analytics.js เพื่อให้เรียกไฟล์จาก root ตรงกัน

วิธีลง
1) วาง index.html ที่ root
2) วาง price_sheet.html ที่ root
3) วาง analytics.js ที่ root
4) Commit / Push
5) รอ GitHub Pages deploy
6) เปิดหน้าแรก และเข้าหมวดราคา 1 หมวด
7) รอประมาณ 10-20 วินาที
8) ดู Google Sheet จะต้องมีแท็บ Analytics

รอบนี้เป็น Retail ก่อน เพื่อยืนยัน data pipeline ให้ผ่าน
