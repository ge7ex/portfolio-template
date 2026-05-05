# AI Portfolio Pro V30 — Easy Project Edit

## สิ่งที่แก้เพิ่ม
- เพิ่ม Project Manager ใน Quick Edit ของ Experience / Projects
- เพิ่ม/ลบรูปโปรเจกต์ได้จาก Quick Edit โดยตรง
- เพิ่มปุ่ม “แก้ข้อมูล / รูปภาพ” บนการ์ดโปรเจกต์ในหน้า Portfolio
- ปุ่มแก้โปรเจกต์จะเปิดแท็บ Experience พร้อมโหลดข้อมูลโปรเจกต์นั้นทันที
- เพิ่มข้อความช่วยเหลือในช่อง Project Images ให้ผู้ใช้รู้ว่าต้องกด Save & Close
- ปรับ Preview list ของ Experience ให้เห็นจำนวนรูป และมีปุ่ม “แก้/รูป” ชัดเจนกว่าเดิม
- เพิ่มการ validate ไฟล์รูปภาพและบีบอัดรูปก่อนเก็บ เพื่อลดปัญหา localStorage เต็ม
- คง pagination/print rule จาก V29 ไว้เหมือนเดิม

## วิธีใช้งาน
1. เปิด `index.html`
2. กดปุ่ม Edit หรือกดปุ่ม Quick Edit ตรง Section Experience
3. ใน Project Manager สามารถกด:
   - “แก้ข้อมูล/รูป” เพื่อเปิดฟอร์มเต็ม
   - “เพิ่มรูป” เพื่อเพิ่มรูปทันที
   - ปุ่ม x บนรูปย่อเพื่อลบรูป
4. เมื่อแก้ข้อมูลในฟอร์มเต็ม ให้กด `Save & Close`
5. Export/PDF ใช้ปุ่มเดิมได้ตามปกติ
