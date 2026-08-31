LEEPLUS Compatibility — GViz Headers=1 ROOT FIX

ต้นเหตุ:
Google GViz เดาจำนวน Header เองเมื่อไม่ได้ระบุ headers
ทำให้บาง Sheet เช่น MATTE / PRIVACY ถูกกินข้อมูลต้น Sheet ไปหลายแถว
จึงเห็น MATTE เริ่ม MATT39, PRIVACY เริ่ม PR24 ทั้งที่ข้อมูลมีอยู่ก่อนหน้า

แก้:
- บังคับ GViz ด้วย headers=1
- Google Sheet แถวที่ 1 เป็น Header เท่านั้น
- ข้อมูลตั้งแต่แถว 2 ต้องถูกอ่านทั้งหมด
- เก็บ Header Row Hotfix เดิมไว้
- เก็บ Multi-Parenthesis Tag Fix เดิมไว้
- ไม่แตะ Search / Highlight / Grouping / PRICE mode

วางทับ GitHub:
- /price_sheet.js
- /dealer/price_sheet.js

จากนั้น:
1. รอ GitHub Pages อัปเดต
2. Ctrl+F5
3. ตรวจ MATTE ต้องเริ่มจาก Code ต้น Sheet
4. ตรวจ PRIVACY ต้องเริ่มจาก Code ต้น Sheet
5. ตรวจ HD ต้องยังเริ่ม LP01 ปกติ
