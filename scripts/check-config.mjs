#!/usr/bin/env node
// Конфиг Codex указывает на сервер проектов и не несёт ключей: статический заголовок
// перекрыл бы вход через Google, а репозиторий публичный. Заодно — что hooks.json не
// менялся: правка сбрасывает доверие к хуку, и автообновление молча выключается.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const problems = [];

const SERVER = "qmedia_projects";
const SERVER_URL = "https://projects-mcp.tech.qmedia.by/mcp";

const config = read(".codex/config.toml");
const lines = config.split("\n").filter((line) => !line.trimStart().startsWith("#"));

const servers = [...config.matchAll(/^\[mcp_servers\.([^\]]+)\]\s*$/gm)].map((match) => match[1]);
if (servers.length !== 1 || servers[0] !== SERVER) {
  problems.push(`.codex/config.toml: ожидается ровно один сервер ${SERVER}, найдено: ${servers.join(", ") || "ни одного"}`);
}

const url = config.match(/^url\s*=\s*"([^"]+)"/m)?.[1];
if (url !== SERVER_URL) {
  problems.push(`.codex/config.toml: url ${url ?? "не задан"} вместо ${SERVER_URL}`);
}

for (const key of ["http_headers", "env_http_headers", "http_headers_helper", "bearer_token", "Authorization"]) {
  if (lines.some((line) => line.includes(key))) {
    problems.push(`.codex/config.toml: ${key} — ключей в конфиге быть не должно, вход идёт через Google`);
  }
}

const host = new URL(SERVER_URL).host;
for (const file of ["README.md", ".agents/skills/connection-doctor/SKILL.md"]) {
  if (!read(file).includes(host)) {
    problems.push(`${file}: не называет ${host} — документация разошлась с конфигом`);
  }
}

// Строго то содержимое, которому Менеджеры уже доверяют. Меняется оно только вместе
// с этой константой и с пониманием, что каждому Менеджеру придётся доверять хуку заново.
const EXPECTED_HOOKS = {
  hooks: {
    SessionStart: [
      {
        hooks: [
          {
            type: "command",
            command: "bash .codex/update-check.sh",
            commandWindows: "powershell -NoProfile -ExecutionPolicy Bypass -File .codex\\update-check.ps1",
            timeout: 20,
            statusMessage: "Проверяю обновления инструмента",
          },
        ],
      },
    ],
  },
};
let hooks;
try {
  hooks = JSON.parse(read(".codex/hooks.json"));
} catch (error) {
  problems.push(`.codex/hooks.json: не разбирается как JSON — ${error.message}`);
}
if (hooks && JSON.stringify(hooks) !== JSON.stringify(EXPECTED_HOOKS)) {
  problems.push(".codex/hooks.json: содержимое изменилось — доверие к хуку сбросится у всех Менеджеров (docs/invariants.md)");
}

if (problems.length > 0) {
  console.error("Конфиг не проходит проверку:\n");
  for (const problem of problems) console.error(`  - ${problem}`);
  process.exit(1);
}
console.log("Конфиг в порядке");
