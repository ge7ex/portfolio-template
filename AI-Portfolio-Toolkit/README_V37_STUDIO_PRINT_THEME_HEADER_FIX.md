# V37 Studio Print Theme/Header Fix

## แก้ไขหลัก

1. **แก้ Print จาก Studio แล้วธีมหายบางส่วน**
   - แก้กฎ `pd-grid-on` ตอนพิมพ์ที่เคยล้าง `background-image` จนทำให้พื้นหลังธีมกลายเป็นขาว
   - Studio Print จะคืนค่า `theme background`, `accent`, `section line`, และ `content frame` ตามธีมที่เลือกไว้
   - เพิ่ม fallback theme vars สำหรับ `health` และ `esports`

2. **แก้ข้อมูลหัวข้อบางส่วนหาย**
   - เพิ่มหัวข้อ `ประสบการณ์และผลงาน / Experience & Projects` ใน Studio Print layout
   - เพิ่มการดึงข้อมูล section เสริมจาก DOM กรณีข้อมูลมาจากหน้าที่ render แล้ว ไม่ใช่จากฟอร์มอย่างเดียว

3. **ยังคง layout ที่แก้ใน Studio**
   - ค่า drag / resize / rotate / crop / fit ของรูป ยังใช้จาก Print Layout Studio เหมือนเดิม
   - ยังใช้ profile key เดิมของ V36 เพื่อไม่ทับหรือล้าง layout ที่เคยจัดไว้ก่อนหน้า

## หมายเหตุทดสอบ

- ตอนกด Print จาก Studio ให้เปิด `Background graphics`
- ถ้าเคยเปิดไฟล์เก่าค้างไว้ ให้กด reload ก่อนทดสอบ
- หาก browser cache หนักมาก ให้ปิดแท็บแล้วเปิด `index.html` ใหม่
