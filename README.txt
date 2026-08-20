LOGIN RECOVERY

วางทับใน GitHub:
- /admin/admin.js

ไม่ต้องแก้ CSS
ไม่ต้องแก้ Code.gs
ไม่ต้อง Deploy Apps Script

แก้เฉพาะระบบ Login:
- ตัด crypto.subtle ออก
- ตรวจรหัสแบบง่ายตามความต้องการเดิม
- จำ session สูงสุด 12 ชั่วโมง
- ปุ่มออกจากระบบยังทำงานเหมือนเดิม

หลังอัปโหลด ให้รีเฟรชหน้า /admin/ แบบ Hard Refresh (Ctrl+F5) 1 ครั้ง
