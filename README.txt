LEEPLUS Global Search 01.1 — UI Highlight

แก้เฉพาะ app.js ฝั่งหน้า Home
- Search เด่นขึ้นด้วยกรอบ/พื้นเหลืองทองแบบบาง ๆ ตาม CI เหลือง-ดำ
- Focus glow ชัดขึ้น แต่ไม่ทำช่องเหลืองทั้งก้อน
- ไอคอน Search เป็นสีเหลือง
- ปุ่มล้างคำค้นเหลือ × ตัวเดียว โดยซ่อน native search cancel ของ browser
- ไม่แก้ Global Search API / Engine
- ไม่แก้ Store Access / Login
- ไม่แก้ Search ในหน้าหมวด

ติดตั้ง:
1) นำ app.js ไปทับ Production app.js
2) Commit/Deploy
3) Hard Refresh หน้า Home
