# Maintenance และ Release Checklist

ใช้เอกสารนี้ก่อน merge, deploy, print หรือสาธิต เพื่อป้องกัน regression ในระบบ Portfolio/Resume

## 1. ก่อนเริ่มแก้

- [ ] ยืนยัน repository และ branch
- [ ] อ่าน `DOCUMENTATION.md`
- [ ] ระบุ source of truth ที่ใช้งานจริง
- [ ] ตรวจว่ามีสำเนาใน `public/` และ `dist/` หรือไม่
- [ ] ตรวจ `scripts/prepare-vercel.cjs`
- [ ] สร้าง backup branch
- [ ] ระบุ acceptance criteria ที่ตรวจได้
- [ ] จำกัด scope ไม่ให้กระทบ feature อื่น

## 2. Code Safety

- [ ] ไม่มี secret, token หรือข้อมูลจริงใน commit
- [ ] ไม่มี syntax error ที่เห็นได้
- [ ] ไม่มีไฟล์ orphan ที่ไม่ได้ถูกโหลด
- [ ] ไม่มี engine ซ้ำที่ควบคุม interaction เดียวกัน
- [ ] ไม่เปลี่ยน storage key โดยไม่มี migration
- [ ] ไม่เพิ่ม dependency โดยไม่ได้อนุมัติ
- [ ] ไม่เพิ่ม README แยกตามเวอร์ชัน
- [ ] เปลี่ยน cache version เมื่อ asset เดิมถูก cache

## 3. Portfolio Desktop

แนะนำ viewport: `1920×1080`, zoom 100%

- [ ] Hero แสดงครบ
- [ ] TH/EN ทำงาน
- [ ] Theme และ Dark/Light ทำงาน
- [ ] Skills/Contact อ่านง่าย
- [ ] Experience card ไม่ล้น
- [ ] 1 รูปไม่ sticky
- [ ] 2 รูปทำ Coverflow ครบ
- [ ] 3 รูปทำ Coverflow ครบ
- [ ] 4–6 รูปไม่เกิด blank rail
- [ ] รูป portrait/landscape/mixed ไม่ถูก crop ผิด
- [ ] รูปสุดท้ายมี hold แล้ว section ปิด
- [ ] ไม่มี trailing blank space ยาว

## 4. Portfolio Mobile

ทดสอบอย่างน้อย viewport ใกล้เคียง `360×800` และ `390×844`

- [ ] Menu อยู่กลางหรืออยู่ในตำแหน่งที่แตะง่าย
- [ ] Touch target ไม่เล็กเกินไป
- [ ] Safe area ไม่ทับ browser/status area
- [ ] ไม่มี horizontal page overflow
- [ ] Coverflow responsive
- [ ] Open–Move–Hold–Close ทำงาน
- [ ] ไม่มี image rail เดิมโผล่กลับมา
- [ ] การ์ดถัดไปขึ้นต่อโดยไม่มี blank rail
- [ ] การหมุนจอไม่ทำให้ตำแหน่งพัง

## 5. Resume

- [ ] A4 preview ไม่ถูกตัด
- [ ] Sidebar และ main column อยู่ถูกตำแหน่ง
- [ ] Theme accent ตรงกับ Portfolio
- [ ] Section heading และ underline ตรง theme
- [ ] Timeline line/dot ตรง theme
- [ ] Skill chips และ Edit controls ไม่ค้างสีจาก theme อื่น
- [ ] Dark/Light ไม่ทำให้ข้อความอ่านยาก
- [ ] Mobile preview inspect ได้

## 6. Print/PDF

- [ ] Nav ถูกซ่อน
- [ ] Edit/modal/theme panel ถูกซ่อน
- [ ] Cursor grid ถูกซ่อน
- [ ] Scrollytelling ถูก flatten
- [ ] รูปแสดงครบแม้หน้าจออยู่ใน collapsed state
- [ ] ไม่มีข้อความถูกตัด
- [ ] ไม่มี blank page ที่ไม่จำเป็น
- [ ] Background graphics มีคำแนะนำชัดเจน
- [ ] Portfolio PDF ผ่าน
- [ ] Resume PDF ผ่าน

## 7. Export

- [ ] WEB export ซ่อน editor controls
- [ ] ข้อมูล TH/EN ถูกชุด
- [ ] Link ไม่เสีย
- [ ] รูปไม่หาย
- [ ] PPTX/Canva prompt ระบุข้อจำกัด หากยังไม่ได้ทดสอบครบ
- [ ] ไม่ claim DOCX พร้อม หาก UI ยังซ่อนหรือ feature ยังไม่เสถียร

## 8. Build และ Deploy

- [ ] `vercel.json` ยังชี้ output ถูก
- [ ] `prepare-vercel.cjs` รันได้
- [ ] Asset ใหม่มีใน `dist`
- [ ] HTML โหลด CSS/JS ใหม่จริง
- [ ] Deployment status สำเร็จ
- [ ] Production URL โหลดได้
- [ ] Hard refresh แล้วเห็นเวอร์ชันใหม่
- [ ] ตรวจ DevTools Network ว่าไม่มี 404
- [ ] ตรวจ Console ว่าไม่มี error สำคัญ

## 9. เอกสารและ Handoff

- [ ] อัปเดต `DOCUMENTATION.md` หากเพิ่มคู่มือใหม่
- [ ] อัปเดต framework หาก architecture เปลี่ยน
- [ ] อัปเดต Prompt Playbook หากมี workflow ใหม่
- [ ] ระบุ backup branch
- [ ] ระบุ commit ล่าสุด
- [ ] แยกสิ่งที่ตรวจแล้วกับสิ่งที่ยังไม่ได้ตรวจ
- [ ] ไม่ใช้คำว่าเสร็จสมบูรณ์ หากยังไม่ได้ตรวจ production

## 10. Final Report Template

```text
Changed:
- ...

Root cause:
- ...

Backup:
- ...

Preserved:
- ...

Verified:
- source
- local/build
- deployment
- production

Not yet verified:
- ...

Risk:
- ...
```
