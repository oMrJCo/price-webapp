LEEPLUS Store Access 03.1 — Phone Leading Zero Fix

แก้เฉพาะ Frontend:
- เบอร์โทรใช้ text + inputmode=numeric เพื่อเก็บเลข 0 ด้านหน้าแน่นอน
- บังคับรับเฉพาะตัวเลขและไม่เกิน 10 หลัก
- normalize เป็น string ก่อนส่ง API
- LINE / Facebook / ช่องทางติดต่อ ระบุชัดว่าไม่บังคับ
- ไม่แตะ Dealer / Contact / Promotion / Analytics / Speed Fix

หมายเหตุสำคัญ:
ถ้า Backoffice ยังแสดง 839900171 แทน 0839900171 หลังใช้ไฟล์นี้
แปลว่า Google Sheet/Apps Script ฝั่ง Stores กำลังแปลง phone เป็น Number
ต้องแก้ Backend ให้บันทึก phone เป็นข้อความ (string) ด้วย
