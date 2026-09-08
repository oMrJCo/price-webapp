LEEPLUS Home Speed Fix 02 - Cache First

เปลี่ยนเฉพาะ app.js
- Home ใช้ last-known-good Meta/Categories จาก localStorage ทันทีถ้ามี
- Meta/Categories Apps Script refresh ทำ background ไม่บล็อกการ render
- เอา Date.now() cache-busting และ cache:no-store ออกจาก Meta/Categories
- First true visit ที่ยังไม่มี cache จะเรียก API ปัจจุบันตามเดิม
- ไม่ใช้ legacy categories.json
- ไม่แตะ Contact / Promotion Popup / Store Access / Dealer / Analytics / Backend

ติดตั้ง: แทน app.js เดิม แล้ว commit/deploy
ทดสอบ: Ctrl+F5 รอบแรกเพื่อโหลดข้อมูลล่าสุด จากนั้น reload รอบ 2-3 เพื่อดูเวลาจริง
