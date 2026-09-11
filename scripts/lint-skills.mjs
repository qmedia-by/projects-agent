#!/usr/bin/env node
// Структурная проверка скиллов в .agents/skills: frontmatter, имя каталога, язык и
// длина description, метаданные Codex, таблица скиллов в AGENTS.md, ссылки на
// references в обе стороны и длина самого AGENTS.md.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const skillsRoot = path.join(root, ".agents", "skills");
const agents = fs.readFileSync(path.join(root, "AGENTS.md"), "utf8");
const problems = [];

// AGENTS.md читается в начале каждого чата, в том числе самого короткого.
const AGENTS_MAX_LINES = 100;

const skills = fs
  .readdirSync(skillsRoot, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();

if (skills.length === 0) {
  console.error("В .agents/skills нет ни одного скилла");
  process.exit(1);
}

for (const skill of skills) {
  const skillDir = path.join(skillsRoot, skill);
  const skillFile = path.join(skillDir, "SKILL.md");

  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(skill)) {
    problems.push(`${skill}: имя каталога — только строчная латиница, цифры и дефисы`);
  }
  if (!fs.existsSync(skillFile)) {
    problems.push(`${skill}: нет SKILL.md`);
    continue;
  }

  const source = fs.readFileSync(skillFile, "utf8");
  const frontmatter = source.match(/^---\n([\s\S]*?)\n---\n/);
  if (!frontmatter) {
    problems.push(`${skill}/SKILL.md: нет frontmatter`);
    continue;
  }

  const name = frontmatter[1].match(/^name:\s*(.+)$/m)?.[1]?.trim();
  const description = frontmatter[1]
    .match(/^description:\s*(.+)$/m)?.[1]
    ?.trim()
    .replace(/^["']|["']$/g, "");

  if (name !== skill) {
    problems.push(`${skill}/SKILL.md: name «${name ?? "—"}» не совпадает с именем каталога`);
  }

  if (!description) {
    problems.push(`${skill}/SKILL.md: пустой description — Codex не выберет скилл`);
  } else {
    // По description Модель решает, загружать ли скилл, и формулирует его Менеджер.
    if (!/[а-яё]/i.test(description)) {
      problems.push(`${skill}/SKILL.md: description должен быть на русском`);
    }
    if (description.length > 500) {
      problems.push(`${skill}/SKILL.md: description длиннее 500 символов`);
    }
  }

  if (!fs.existsSync(path.join(skillDir, "agents", "openai.yaml"))) {
    problems.push(`${skill}: нет agents/openai.yaml — в Codex скилл останется без названия`);
  }

  // Скилл, которого нет в таблице AGENTS.md, агент находит только по description.
  if (!agents.includes(`\`${skill}\``)) {
    problems.push(`${skill}: не упомянут в AGENTS.md`);
  }

  const body = source.slice(frontmatter[0].length);
  for (const match of body.matchAll(/`(references\/[\w./-]+\.md)`/g)) {
    if (!fs.existsSync(path.join(skillDir, match[1]))) {
      problems.push(`${skill}/SKILL.md: ссылка на несуществующий ${match[1]}`);
    }
  }
  const referencesDir = path.join(skillDir, "references");
  if (fs.existsSync(referencesDir)) {
    for (const file of fs.readdirSync(referencesDir)) {
      if (!body.includes(`references/${file}`)) {
        problems.push(`${skill}: references/${file} не упомянут в SKILL.md и не будет прочитан`);
      }
    }
  }
}

// Обратная сторона: скилл в таблице AGENTS.md, которого нет в каталоге.
for (const match of agents.matchAll(/^\| `([a-z0-9-]+)` \|/gm)) {
  if (!skills.includes(match[1])) {
    problems.push(`AGENTS.md: скилл ${match[1]} указан в таблице, но его нет в .agents/skills`);
  }
}

const agentsLines = agents.trimEnd().split("\n").length;
if (agentsLines > AGENTS_MAX_LINES) {
  problems.push(`AGENTS.md: ${agentsLines} строк при потолке ${AGENTS_MAX_LINES} — он читается в каждом чате`);
}

if (problems.length > 0) {
  console.error("Скиллы не проходят проверку:\n");
  for (const problem of problems) console.error(`  - ${problem}`);
  process.exit(1);
}
console.log(`Скиллы в порядке: ${skills.length}`);
