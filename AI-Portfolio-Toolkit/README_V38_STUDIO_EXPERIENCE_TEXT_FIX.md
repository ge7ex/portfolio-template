# V38 Studio Experience Text Visibility Fix

แก้ปัญหา PDF Layout Studio ตอน Print ที่ข้อมูลใน Experience/Project ถูกตัดหรือเหมือนหายไปบริเวณคำอธิบาย/รายละเอียดงาน

## สิ่งที่ปรับ

- เพิ่ม fallback ให้ Studio อ่านข้อมูลโปรเจกต์จากทั้งชุด key แบบ localized และ key กลาง เช่น `title`, `company`, `desc`, `highlights`
- เพิ่มข้อมูลช่วงเวลา/วันที่ของ Experience ใน Studio print card
- ปรับความสูงกล่องข้อความโปรเจกต์อัตโนมัติจากเนื้อหาจริง เพื่อไม่ให้ description และ bullet ถูก crop
- ก่อน Print จะตรวจ text box ที่สั้นเกิน และขยายให้พอดีกับ `scrollHeight`
- ถ้ากล่อง project สูงขึ้น จะเลื่อนรูปของ project เดียวกันลงอัตโนมัติ เพื่อไม่ให้ทับข้อความ
- ยังคง crop/resize/image-fit และตำแหน่งที่จัดใน Studio ไว้

## ไฟล์ที่แก้

- `js/components/PrintDesigner.js`

## วิธีทดสอบ

1. เปิด `index.html`
2. เข้า PDF Layout Studio
3. ดูส่วน `ประสบการณ์และผลงาน`
4. กด Print PDF
5. ตรวจว่า description และ bullet ใต้หัวข้อโปรเจกต์ไม่ถูกตัด ไม่หาย และรูปยังแสดงครบ
