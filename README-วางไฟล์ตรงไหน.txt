PHASE 2.2 — ADMIN ACCESS GATE

นำไฟล์ในโฟลเดอร์ admin ไปวางทับไฟล์เดิมใน /admin/ บน GitHub:
- admin/index.html
- admin/admin.css
- admin/admin.js

ไม่ต้องแก้ไฟล์อื่น

หลังอัปโหลด เปิด /admin/ จะเจอหน้ากรอกรหัสก่อนเข้าหลังบ้าน
การเข้าสู่ระบบจำเฉพาะ session ของ browser สูงสุด 12 ชั่วโมง และมีปุ่มออกจากระบบ

หมายเหตุ: เป็น access gate แบบเบาสำหรับกันการเข้าถึงทั่วไป รหัสจริงไม่ได้เก็บเป็น plain text แต่ยังเป็นระบบ client-side จึงไม่ใช่ security boundary สำหรับข้อมูลสำคัญ
