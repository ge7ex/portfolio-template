# Portfolio V5 Optional Sections

เพิ่ม component แบบ 1 หัวข้อ 1 ไฟล์ และรองรับ TH/EN:

- EducationComponent.js
- CertificationComponent.js
- AwardsComponent.js
- CaseStudyComponent.js
- ServicesComponent.js
- TestimonialsComponent.js
- ClientsComponent.js
- CTAComponent.js
- ArticlesComponent.js

เงื่อนไขสำคัญ:
- ถ้า field ว่าง จะไม่ render section นั้น
- Skills/Bio/Header ไม่ใส่ placeholder เมื่อ user ไม่กรอก
- ข้อมูลแยกภาษา `_th` และ `_en`
- ใช้รูปแบบกรอกด้วย `|` ต่อ 1 บรรทัด เพื่อให้แก้ผ่าน modal ได้ง่ายโดยไม่ทำระบบ dynamic form หนักเกินไป

ตัวอย่างรูปแบบกรอก:
- Education: Degree | School | Year | Detail
- Case Study: Project | Problem | Action | Result
- CTA: Headline | Description | Button | URL
