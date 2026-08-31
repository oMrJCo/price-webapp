LEEPLUS v1.2.3 — Mobile Model List Fullwidth Fix

แก้ปัญหา HD / MATTE / PRIVACY / Visual Catalog บนมือถือ
ที่ Card ถูกบีบเหลือประมาณ 42% และข้อความแตกทีละตัว

สาเหตุ:
Mobile CSS เดิมมี tbody tr td:last-child { max-width:42% }
แต่ Compatibility / Visual Catalog มี td เดียว จึงถูกบีบ

วางทับ GitHub:
- /price_sheet.js
- /dealer/price_sheet.js

ไม่ต้อง Deploy Code.gs
หลังวางให้ปิด Safari tab เดิม เปิดใหม่ แล้วทดสอบอีกครั้ง
