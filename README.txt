LEEPLUS Analytics 06 - Geo Client

ไฟล์ที่แก้: analytics.js

สิ่งที่เพิ่ม
- ดึง Geo-IP จาก ipwho.is เฉพาะ region/province
- ไม่บันทึกและไม่ส่ง IP ไปยัง Apps Script
- Cache จังหวัดใน localStorage 7 วันต่อ browser/visitor
- หาก Geo provider ล่ม จะ cache failure 6 ชม. เพื่อลดการยิงซ้ำ
- timeout 2.5 วินาที และไม่บล็อกการแสดงหน้าเว็บ
- payload Analytics เพิ่ม field: province
- Analytics เดิม / visitorId / sessionId / Retail / Dealer / click / engagement ยังอยู่ครบ

วิธีใช้
1) แตก ZIP
2) เอา analytics.js ไปทับไฟล์เดิมที่ root ของเว็บ
3) Deploy/Push
4) เปิดเว็บด้วย browser/profile ใหม่ หรือเคลียร์ localStorage key lp_analytics_geo_v1 เพื่อทดสอบ Geo ใหม่

หมายเหตุ
- ขั้นนี้ backend Code.js ยังไม่บันทึก province จนกว่าจะทำไฟล์ถัดไป
- ไม่แตะ app.js, price_sheet.js, Contact, Popup หรือ Speed Fix
