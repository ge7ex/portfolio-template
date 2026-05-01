# Portfolio content audit against common portfolio / CV templates

## Current components in this project
- Hero / profile header
- Bio / professional summary
- Skills
- Contact
- Experience / projects with scrollytelling image track
- Theme / language / layout switcher
- Export: Web, PPTX, DOCX, PDF print

## Content sections commonly found in modern portfolio templates but not yet modeled as editable components
- Education
- Certifications / licenses
- Awards / achievements
- Featured case studies with problem, role, process, result, metrics
- Services / what I can help with
- Testimonials / references
- Client or brand logos
- Tools / technology stack separated from soft skills
- CTA section: hire me, book a call, download resume
- Blog / articles / talks
- Social links beyond LinkedIn

## Recommended next content model
1. Keep `Experience` for timeline.
2. Add `Projects` as a separate case-study component.
3. Add `Education` and `Certifications` for resume completeness.
4. Add `Achievements` with measurable impact.
5. Add `CTA` for portfolio mode only.

## Resume readability fix in v4
The resume web UI is a white paper layout even when the site theme is dark. v4 forces resume-main text to neutral dark colors and keeps sidebar text white. This prevents pastel Tailwind classes from becoming unreadable on white backgrounds.
