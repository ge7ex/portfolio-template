# V2 TypeScript Clean Rebuild Upload Instructions

Branch:

```text
v2/typescript-clean-rebuild
```

Recommended approach: keep V2 in this same repository as a branch first, not a new repository yet.

## Why branch first

- Keeps the original portfolio history and V2 work in one place.
- Easier to compare old implementation vs V2.
- Easier to open a draft PR and let Codex polish only the V2 folder.
- Safer while the V2 design and export behavior are still being validated.
- Avoids splitting issues, docs, Vercel setup, and future decisions across two repositories too early.

## When to create a new repo later

Create a new repository only after V2 becomes the actual production direction and the old version is no longer needed for comparison.

A new repo is better later if:

- V2 becomes a standalone product.
- The old portfolio toolkit should be archived.
- Deployment should be separate from the old project.
- The V2 package has its own issues, docs, releases, and roadmap.

## Upload the generated ZIP contents

The ZIP generated from ChatGPT is:

```text
portfolio-template-v2-ts.zip
```

Extract it locally, then push it to this branch.

## Commands

From your local machine:

```bash
git clone https://github.com/ge7ex/portfolio-template.git
cd portfolio-template
git fetch origin
git switch v2/typescript-clean-rebuild
```

Extract `portfolio-template-v2-ts.zip` into the repository root so the folder appears as:

```text
portfolio-template-v2-ts/
├── index.html
├── package.json
├── tsconfig.json
├── src/
├── styles/
└── docs/
```

Then commit and push:

```bash
git add portfolio-template-v2-ts
git commit -m "feat: add TypeScript clean rebuild v2"
git push origin v2/typescript-clean-rebuild
```

## Verify locally

```bash
cd portfolio-template-v2-ts
npm install
npm run typecheck
npm run dev
```

Open:

```text
http://localhost:5173
```

## Suggested Codex polish prompt

```text
Use the v2/typescript-clean-rebuild branch.
Work only inside portfolio-template-v2-ts.
Polish the hero, skills, contact, and portfolio project sections so the UI feels crafted, restrained, premium, and not AI-generated.
Preserve TypeScript types, PortfolioState schema, import/export JSON, print behavior, and cursor interaction budget.
Do not migrate to React/Next. Do not add new dependencies unless necessary.
Report changed files, preserved behavior, risks, and manual checks still needed.
```
