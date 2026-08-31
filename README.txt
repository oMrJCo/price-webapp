LEEPLUS v1.2.2 — Visual Catalog Color + Model Polish

แก้ 2 จุด:
1) Color Swatch
- อ่านชื่อสีภาษาอังกฤษในวงเล็บเป็นหลัก
- ใช้ exact mapping ก่อน generic mapping
- แยกสีเฉพาะ เช่น:
  Black / Space Black / Graphite / Black Graphite / Midnight
  Silver / White / Starlight / White Silver
  Yellow / Gold / Light Gold / Rose Gold
  Red / Product Red / Coral / Cosmic Orange
  Green / Alpine Green / Sage
  Blue / Pacific Blue / Sierra Blue / Sky Blue / Mist Blue / Deep Blue
  Purple / Deep Purple / Lavender / Pink
- มี Thai fallback

2) Model Layout
- Desktop ขยายคอลัมน์ชื่อรุ่นเป็น 220px
- ชื่อรุ่นไม่ตัดขึ้นบรรทัดใหม่
- จัดชื่อรุ่นกึ่งกลางให้อ่านง่าย
- Mobile ใช้ 145px + ellipsis หากยาวเกินจริง

วางทับ GitHub:
- /price_sheet.js
- /dealer/price_sheet.js

ไม่ต้อง Deploy Code.gs
หลังวางทับให้ Ctrl+F5
