PHASE 3D — AUTO CREATE CATEGORY TAB

GitHub:
วางทับ
- /admin/admin.js
- /admin/admin.css

Google Apps Script:
- ใช้ Code.gs ใน ZIP แทน Code.gs ปัจจุบัน
- Save
- Deploy > Manage deployments > Edit > New version > Deploy

สิ่งที่เปลี่ยน:
1. เพิ่มหมวดใหม่แล้วไม่เลือก Google Sheet Tab
   -> ระบบสร้าง Tab ให้อัตโนมัติจากชื่ออังกฤษ (ถ้าไม่มีใช้ชื่อไทย)
2. Tab ใหม่มี Header อัตโนมัติ:
   brand | model | price | dealer_price | image_url | updated
3. ระบบผูก sheetTab กลับเข้า categories ให้อัตโนมัติ
4. ระบบสร้าง price_url อัตโนมัติจาก sheetTab
5. ซ่อนช่อง Price URL จาก Backoffice ไม่ต้องกรอกเอง
6. หากเลือก Tab ที่มีอยู่แล้ว จะผูกกับ Tab เดิม ไม่สร้างซ้ำ

หมายเหตุ:
แถว metadata เก่าพวก __META__, __CATEGORY_IMAGE__, __BRAND_IMAGE__
ยังไม่ลบใน Phase นี้เพื่อรักษาความเข้ากันได้กับหน้าเว็บเดิม
