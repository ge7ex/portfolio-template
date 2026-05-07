# V35 Studio Theme + Image Fit Fix

ปรับปรุง PDF Layout Studio เพิ่มเติมจาก V34

## แก้ไข

1. **รูปใน Studio ปรับ Crop/Resize ได้**
   - เลือกรูปใน Studio แล้วใช้ panel `Image Crop / Resize`
   - Fit Mode: Crop เต็มกรอบ / Resize เห็นทั้งรูป / ยืดเต็มกรอบ
   - ปรับตำแหน่งภาพแนวนอนและแนวตั้งด้วย slider
   - มีปุ่ม Fit Landscape และ Fit Portrait สำหรับรูปแนวนอน/แนวตั้ง

2. **Studio ใช้ธีมจาก Print Template เดิม**
   - หน้า Studio ไม่เป็น whiteboard เปล่าอีกต่อไป
   - ดึงสี theme/accent จาก body ปัจจุบันมาใช้กับพื้นหลังและเส้น accent
   - เวลา Print จาก Studio ธีมเดียวกันจะติดไปด้วย

3. **ยังคงไม่แก้ข้อมูลต้นฉบับ**
   - การขยับ/resize/crop/ซ่อน เก็บเฉพาะใน print profile
   - ไม่แก้ข้อมูล portfolio/resume หลัก และไม่แก้ไฟล์รูปต้นฉบับ
