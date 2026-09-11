#!/usr/bin/env node
// Несущие правила: предложения, потеря которых ставит перед Менеджером ложный ответ.
// Добавлять сюда только такие — каждая лишняя проверка соблазняет ослабить регулярку
// вместо того, чтобы поправить текст. Причины — docs/invariants.md.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

const rules = [
  {
    file: "AGENTS.md",
    pattern: /\*\*данных нет\*\*, а не что работы не было/,
    why: "Пробел должен читаться как отсутствие данных, а не как ноль",
  },
  {
    file: "AGENTS.md",
    pattern: /Сервер ничего не пишет/,
    why: "агент не должен обещать изменений в Битриксе, таблице или чатах",
  },
  {
    file: "AGENTS.md",
    pattern: /Сделки CRM не подключены/,
    why: "без этого агент выводит сделки и оплаты из переписки",
  },
  {
    file: "AGENTS.md",
    pattern: /Разреза часов по сотрудникам нет/,
    why: "поимённые часы закрыты решением руководства",
  },
  {
    file: ".agents/skills/project-hours/SKILL.md",
    pattern: /No hours by person/,
    why: "скилл часов не должен восстанавливать разрез по людям",
  },
  {
    file: ".agents/skills/chat-search/SKILL.md",
    pattern: /Silence is not proof/,
    why: "«ничего не найдено» не означает, что клиент не писал",
  },
  {
    file: ".agents/skills/attention/SKILL.md",
    pattern: /You do not know who the Manager is/,
    why: "без этого агент угадывает, чьи проекты «мои»",
  },
  {
    file: ".agents/skills/connection-doctor/SKILL.md",
    pattern: /never ask the Manager to paste them/,
    why: "токены и заголовки авторизации не показываются и не запрашиваются",
  },
];

const broken = rules.filter((rule) => !rule.pattern.test(read(rule.file)));
if (broken.length > 0) {
  console.error("Несущие правила выпали из текста:\n");
  for (const rule of broken) console.error(`  - ${rule.file}: ${rule.why}`);
  process.exit(1);
}
console.log(`Несущие правила на месте: ${rules.length}`);
