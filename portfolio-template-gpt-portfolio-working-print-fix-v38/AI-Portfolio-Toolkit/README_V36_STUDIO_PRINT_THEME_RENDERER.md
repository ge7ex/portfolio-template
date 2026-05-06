# V36 Studio Print Theme Renderer Fix

แก้ปัญหา Print จาก PDF Layout Studio แล้วออกเป็น whiteboard/grid แทนธีมจริง

## สิ่งที่แก้

1. Studio ยังใช้ whiteboard/grid สำหรับแก้ตำแหน่งได้ตามเดิม
2. ตอนกด Print PDF จะใช้ print renderer แบบมีธีม ไม่พิมพ์ guide/grid ของ Studio
3. สีธีม, accent, gradient, card style, font color ถูกคืนกลับใน print mode
4. ค่าที่ปรับใน Studio ยังถูกใช้ต่อ ได้แก่ x/y, width/height, crop/resize, object-position, rotate, layer และ hide/show
5. รูปยัง preload ก่อน print และรองรับ crop/resize ด้วย object-fit + object-position

## ไฟล์หลักที่แก้

- js/components/PrintDesigner.js

## หมายเหตุ

หากใช้ browser print preview ให้เปิด Background graphics ด้วย เพื่อให้ gradient/theme แสดงใน PDF ครบถ้วน
