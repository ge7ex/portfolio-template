# คู่มือใช้งานและสาธิต Portfolio Template

เอกสารนี้ใช้สำหรับผู้ใช้งานทั่วไปและผู้สาธิตระบบ โดยเน้นลำดับที่เข้าใจง่ายและลดความเสี่ยงก่อนขึ้นแสดงจริง

## 1. เว็บไซต์

Production:

```text
https://portfolio-template-digitalday.vercel.app/
```

โหมดหลัก:

- `Portfolio` — แสดงโปรไฟล์และผลงานแบบ interactive
- `Resume` — แสดงข้อมูลในรูปแบบเอกสาร A4

## 2. เมนูด้านบน

- Language: สลับ TH/EN
- Portfolio/Resume: สลับ layout
- Appearance: เลือก theme และ Dark/Light
- Print/Export: เปิดเครื่องมือส่งออก
- Canva/Prompt: สร้างหรือคัดลอก design brief ตามฟังก์ชันที่มี
- Edit: เปิดหน้าต่างแก้ข้อมูล

บนมือถือ เมนูควรอยู่กึ่งกลางด้านบนและมีพื้นที่แตะเพียงพอ หากจอแคบมากสามารถเลื่อนแถบแนวนอนได้

## 3. วิธีใส่ข้อมูล

1. กด `Edit`
2. กรอกข้อมูลภาษาไทยและภาษาอังกฤษ
3. เพิ่มข้อมูลติดต่อและทักษะ
4. เพิ่ม Experience/Project
5. เพิ่มรูปผลงาน
6. บันทึก
7. สลับ TH/EN เพื่อตรวจว่าข้อมูลครบทั้งสองภาษา

ข้อควรระวัง:

- อย่าใส่รูปขนาดใหญ่มากหลายรูปพร้อมกัน
- อย่าปิด browser หรือ clear site data ก่อนสำรองข้อมูลสำคัญ
- ตรวจ email, phone และ link ก่อน export
- ข้อมูลตัวอย่างควรถูกแทนที่ก่อนสาธิตจริง

## 4. พฤติกรรมส่วนรูปผลงาน

### 1 รูป

แสดงเป็นภาพปกติ ไม่ sticky และไม่สร้าง Coverflow

### 2 รูปขึ้นไป

ใช้ responsive Coverflow:

- รูปกลางใหญ่ที่สุด
- รูปด้านข้างลดขนาดและ opacity
- Scroll แนวตั้งเพื่อเปลี่ยนรูป
- ไม่มีปุ่มลูกศร
- เปิดเมื่อเข้าสู่ section
- ค้างรูปสุดท้ายช่วงสั้น
- ยุบปิดก่อนเข้าสู่การ์ดถัดไป

Mobile และ Desktop ใช้แนวคิดเดียวกัน แต่ขนาดและระยะซ้อน responsive

## 5. วิธีเลือก Theme

1. เปิด Appearance
2. เลือก theme
3. เลือก Dark หรือ Light
4. ตรวจทั้ง Portfolio และ Resume

จุดที่ต้องดู:

- หัวข้อและ body text อ่านง่าย
- Resume sidebar ตรงกับ theme
- Timeline, dot, section line และ skill chips ใช้ accent เดียวกัน
- ปุ่ม Edit ไม่เป็นสีค้างจาก theme อื่น
- Print preview ยังอ่านได้

## 6. วิธี Export

### WEB

ใช้สำหรับดาวน์โหลดเว็บไซต์ที่แก้ข้อมูลแล้ว เครื่องมือแก้ไขควรถูกซ่อนในไฟล์ที่ส่งออก

### PDF

1. เลือก Portfolio หรือ Resume
2. เปิด Print/PDF
3. ตรวจ preview
4. เปิด `Background graphics` หากต้องการ gradient/theme
5. เลือก A4 และ scale ที่เหมาะสม
6. บันทึกเป็น PDF

ก่อนบันทึก ตรวจว่า:

- Nav/Edit ไม่ติดไป
- รูปแสดงครบ
- ไม่มีข้อความถูกตัด
- ไม่มี blank page จาก scrollytelling
- Resume ไม่ล้นขอบ A4

### PPTX/Canva Prompt

ใช้ตามปุ่มที่ระบบแสดง แต่ควรตรวจข้อความและรูปอีกครั้งหลัง export เพราะ layout ของ presentation และเว็บไม่เหมือนกันทั้งหมด

## 7. Script สำหรับสาธิต 5–7 นาที

### นาที 0–1: แนวคิด

> ระบบนี้เป็น Portfolio และ Resume Generator แบบเว็บ static ผู้ใช้แก้ข้อมูลเองได้ รองรับไทย/อังกฤษ หลายธีม และ export ได้โดยไม่ต้องมีฐานข้อมูล

### นาที 1–2: Edit และภาษา

- เปิด Edit
- ชี้ให้เห็นข้อมูล TH/EN
- เปลี่ยนข้อมูลตัวอย่างหนึ่งจุด
- สลับภาษา

### นาที 2–3: Theme และ Resume

- เปลี่ยน theme
- สลับ Dark/Light
- เปิด Resume
- ชี้ให้เห็นว่าสี Resume sync กับ theme

### นาที 3–4: Portfolio interaction

- กลับ Portfolio
- Scroll ไป Experience & Projects
- แสดง Coverflow
- อธิบายว่ารูป 1 รูปจะเป็น static ส่วนหลายรูปจะเป็น interactive

### นาที 4–5: Mobile responsive

- เปิดผ่านมือถือหรือ DevTools
- แสดงเมนูด้านบน
- Scroll Coverflow บน mobile
- อธิบายว่าไม่ใช้ horizontal blank rail แบบเดิม

### นาที 5–6: Export

- เปิด Print/Export
- แสดง PDF preview หรือ WEB export
- ย้ำว่า interactive controls ถูกซ่อนในเอกสาร

### นาที 6–7: สรุป

> จุดเด่นคือผู้ใช้เป็นเจ้าของข้อมูลและดีไซน์ สามารถแก้ใน browser เปลี่ยน theme แสดง Portfolio และสร้าง Resume จากชุดข้อมูลเดียวกัน

## 8. Demo fallback หาก Internet มีปัญหา

เตรียมสิ่งเหล่านี้:

- Screenshot หน้า Portfolio
- Screenshot Resume
- PDF ที่ export สำเร็จแล้ว
- QR code ของ production URL
- สำเนา repo หรือ ZIP ที่เปิด offline ได้ หาก dependencies ที่ใช้รองรับ
- วิดีโอสั้น 20–30 วินาทีของ Coverflow

อย่าพึ่งพา live deployment เพียงอย่างเดียวในการสาธิต

## 9. Checklist ก่อนขึ้นแสดง

- Production เปิดได้
- QR code ชี้ URL ถูก
- Demo data ไม่ใช่ข้อมูลลับ
- TH/EN สลับได้
- Portfolio/Resume สลับได้
- Theme ที่จะใช้ถูกตั้งไว้
- Mobile nav แตะได้
- Coverflow เปิด–เลื่อน–ปิด
- PDF ตัวอย่างเตรียมไว้
- ปิด notification ที่อาจรบกวน
- Browser zoom 100%
- เปิดแท็บสำรองไว้

## 10. ปัญหาที่พบบ่อย

### แก้แล้วแต่หน้าเว็บยังเหมือนเดิม

- รอ deployment
- ปิดแท็บแล้วเปิดใหม่
- Hard refresh
- ตรวจ cache version ของ CSS/JS

### สี Resume ไม่ตรง theme

ตรวจ `resume-theme-sync.css` และ theme variables ไม่ควร hard-code สีเฉพาะจุด

### Mobile menu ยังผิดตำแหน่ง

ตรวจทั้ง CSS และ `mobile-nav-center.js` รวมถึง stylesheet order และ inline style ที่ชนะ cascade

### รูปผลงานไม่ปิด

ตรวจ progress, `coverflow-open/closing/closed` state และ CSS ที่อาจบังคับ `max-height:none` บน mobile

### PDF รูปหาย

ตรวจ print rules ว่าบังคับ opacity/visibility/transform และ preload image ก่อน print แล้วหรือไม่
