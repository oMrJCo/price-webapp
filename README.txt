CHANGE 02 — STEP 6 GViz FIX

สาเหตุ:
Google GViz บางกรณีส่ง cols.id เป็น A/B/C... และ label ของหัวตารางไม่ถูกส่งกลับตามที่ตัวอ่านเดิมคาดไว้
ทำให้ Compatibility หา index ของ type/code/brand/models ไม่เจอ และกรองออกหมด

แก้:
- อ่านทั้ง cols.label และ cols.id
- ถ้ายังหา header ไม่เจอ ใช้ schema ที่ระบบสร้างเองเป็น fallback:
  A=type, B=code, C=brand, D=models, E=image_url, F=updated
- ไม่แตะ renderer ของหมวด PRICE

วางทับ:
- /price_sheet.js
- /dealer/price_sheet.js
