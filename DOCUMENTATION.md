# Portfolio Template — Documentation Index

เอกสารใน repository นี้ใช้ทำความเข้าใจโครงสร้างระบบ และใช้สั่ง AI/Codex ให้แก้เว็บโดยไม่ทำให้ฟังก์ชันเดิมเสียหาย

## เริ่มอ่านจากไฟล์ใด

| เป้าหมาย | เวอร์ชันอ่านง่าย | Source แบบข้อความ |
|---|---|---|
| เข้าใจว่าเว็บนี้ประกอบด้วยอะไรและทำงานอย่างไร | [`docs/PORTFOLIO_SYSTEM_FRAMEWORK_TH.html`](docs/PORTFOLIO_SYSTEM_FRAMEWORK_TH.html) | [`docs/PORTFOLIO_SYSTEM_FRAMEWORK_TH.md`](docs/PORTFOLIO_SYSTEM_FRAMEWORK_TH.md) |
| เรียน Prompt Framework และนำไปสั่ง AI/Codex | [`docs/PROMPT_PLAYBOOK_TH.html`](docs/PROMPT_PLAYBOOK_TH.html) | [`docs/PROMPT_PLAYBOOK_TH.md`](docs/PROMPT_PLAYBOOK_TH.md) |

แนะนำให้ผู้ใช้ทั่วไปเปิดไฟล์ `.html` เพราะมีแผนผัง การ์ดเปรียบเทียบ ตัวอย่างก่อน–หลัง และปุ่มคัดลอก Prompt ส่วน `.md` เก็บไว้เป็น source ที่อ่าน diff และแก้ไขผ่าน GitHub ได้ง่าย

> คู่มือผู้ใช้งาน คู่มือสาธิต และ checklist สำหรับแจก ไม่เก็บไว้ใน repository หลัก ให้จัดทำเป็นไฟล์แจกแยกจาก source code

## การรวมเอกสารเดิม

HTML ทั้งสองไฟล์ปรับปรุงจากเอกสารเดิมที่เคยอยู่ในโครงสร้าง `AI-Portfolio-Toolkit/` และรวมสาระจาก:

- คู่มือสอน Prompt Framework
- `framework.txt`
- `prompt PAR.txt`
- Framework และ Prompt Playbook ที่ปรับตาม architecture ปัจจุบัน

เนื้อหาซ้ำถูกยุบรวม และตัวอย่างที่ล้าสมัยถูกปรับให้ตรงกับระบบปัจจุบัน เช่น Mobile ใช้ responsive Coverflow แทน horizontal image rail

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
