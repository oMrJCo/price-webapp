PHASE 7B — NEW CATEGORY IMAGE FIX

วางทับ GitHub แค่:
- /price_sheet.js
- /dealer/price_sheet.js

ไม่ต้องแก้ Code.gs
ไม่ต้อง Deploy Apps Script
ไม่แตะ UI / ราคา / PDF / Backoffice

สาเหตุ:
- หน้าใบราคาเดิมหารูปหมวดจาก meta.category หรือ legacy __CATEGORY_IMAGE__
- หมวดที่สร้างใหม่เก็บรูปไว้ใน categories.image จึงไม่มีรูปในหน้า Price Sheet

แก้:
- Retail + Dealer อ่าน categories API
- จับหมวดด้วย sheetTab
- ใช้ categories.image เป็นแหล่งรูปหลัก
- ถ้าไม่มี จึง fallback ไป meta / legacy เดิม
