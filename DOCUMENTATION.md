# Portfolio Template — Documentation Index

เอกสารใน repository นี้เป็นคู่มือภายในสำหรับทำความเข้าใจโครงสร้างระบบ และใช้สั่ง AI/Codex ให้แก้เว็บโดยไม่ทำให้ฟังก์ชันเดิมเสียหาย

## เริ่มอ่านจากไฟล์ใด

| เป้าหมาย | เอกสาร |
|---|---|
| เข้าใจว่าเว็บนี้ประกอบด้วยอะไรและทำงานอย่างไร | [`docs/PORTFOLIO_SYSTEM_FRAMEWORK_TH.md`](docs/PORTFOLIO_SYSTEM_FRAMEWORK_TH.md) |
| เขียน Prompt ให้ AI/Codex สร้างหรือแก้เว็บอย่างเป็นระบบ | [`docs/PROMPT_PLAYBOOK_TH.md`](docs/PROMPT_PLAYBOOK_TH.md) |

> คู่มือผู้ใช้งาน คู่มือสาธิต และ checklist สำหรับแจก ไม่เก็บไว้ใน repository หลัก ให้จัดทำเป็นไฟล์แจกแยกจาก source code

## สถานะเอกสารเดิม

เอกสาร framework และ prompt เคยอยู่ในโครงสร้างเก่า `AI-Portfolio-Toolkit/` และปรากฏในประวัติ Pull Request แต่โครงสร้างเว็บปัจจุบันย้าย source ที่ใช้งานจริงมาอยู่ระดับ root เช่น `public/`, `dist/` และ `scripts/` จึงทำให้ผู้ใช้หาเอกสารเดิมในหน้า `main` ไม่พบ

ชุดเอกสารนี้เขียนใหม่ให้ตรงกับระบบปัจจุบัน โดยรวมสาระจาก framework เดิม, PAR prompt เดิม และข้อกำหนดที่ยืนยันระหว่างพัฒนา

## Source of truth ปัจจุบัน

- Runtime หลัก: `public/legacy/v49-app.js`
- Prebuilt runtime สำหรับ deploy: `dist/legacy/v49-app.js`
- Styles หลัก: `public/css/style.css` และ `dist/css/style.css`
- Coverflow/scrollytelling: `public/js/coverflow-scrollytelling.js` และ `public/css/coverflow-scrollytelling.css`
- Resume theme sync: `public/css/resume-theme-sync.css`
- Mobile navigation: `public/css/mobile-nav.css` และ `public/js/mobile-nav-center.js`
- Vercel preparation: `scripts/prepare-vercel.cjs`
- Production: `https://portfolio-template-digitalday.vercel.app/`

## กฎสำคัญของโปรเจกต์

1. สำรอง branch ก่อนการแก้ครั้งใหญ่
2. แก้ทั้ง `public/` และ `dist/` เมื่อระบบใช้ committed prebuilt output
3. ห้ามเพิ่มไฟล์ README แยกตามเวอร์ชัน
4. ห้ามทำให้ Print/PDF/WEB export เสียเพราะการแก้ UI
5. ห้ามเปลี่ยน storage schema โดยไม่มี migration
6. ห้าม claim ว่า production ผ่านแล้ว หากยังไม่ได้ตรวจ deployment จริง
7. Mobile และ Desktop ต้องทดสอบแยกกัน
8. เอฟเฟกต์ต้องลดลงหรือปิดใน print และ reduced-motion contexts

## Backup ก่อนเพิ่มเอกสารชุดนี้

```text
backup/main-before-docs-refresh-20260714
```
