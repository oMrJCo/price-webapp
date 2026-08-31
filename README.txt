LEEPLUS v1.2 — VISUAL_CATALOG

เพิ่ม Category Type ตัวที่ 3 โดยไม่เปลี่ยน PRICE / COMPATIBILITY เดิม

VISUAL_CATALOG Sheet schema:
group | code | model | variant | color | image_url | updated

ตัวอย่าง:
ALUMINUM | i17 | i17 | Full Cover Aluminum | ดำ (Black) | <URL รูป> |
ALUMINUM | i17 | i17 | Full Cover Aluminum | ม่วงลาเวนเดอร์ (Lavender) | [ว่าง] |
ALUMINUM | i17 Air | i17 Air | Full Cover Aluminum | ดำ (Black) | <URL รูปใหม่> |
GLASS | i17 pro | i17 Pro | Full Glass Cover | ดำ (Black) | <URL รูป> |

กฎรูป:
- ใส่ image_url ที่แถวแรกของชุด group+code+model+variant
- แถวถัดไปของชุดเดียวกันปล่อยว่างได้ ระบบสืบทอดรูป
- เมื่อเปลี่ยน group/code/model/variant ระบบหยุดสืบทอด
- ถ้าใส่ URL ใหม่ในแถวใด ใช้รูปใหม่นั้น

หน้าเว็บ:
- แยก Card ตาม group
- รูปสินค้าอยู่ด้านซ้าย
- รุ่น / variant / สี อยู่ด้านขวา
- Search ค้น group/code/model/variant/color
- Retail + Dealer รองรับ
- GViz headers=1 ROOT FIX ยังอยู่
- Multi-parenthesis / Compatibility เดิมไม่ถูกแก้

ติดตั้ง:
1) Code.gs วางทับ > Save > Deploy > Manage deployments > Edit > New version > Deploy
2) GitHub วางทับ:
   /admin/admin.js
   /admin/admin.css
   /price_sheet.js
   /dealer/price_sheet.js
3) Ctrl+F5
4) Backoffice > เพิ่มหมวด > เลือก Visual Catalog / รูป + รุ่น + สี
5) ระบบจะสร้าง Sheet headers ให้อัตโนมัติ
