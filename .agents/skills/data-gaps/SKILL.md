---
name: data-gaps
description: "Почему по проекту нет данных или они неполные: не привязан чат, таймшит или группа Битрикса, данные устарели, строки таймшита в карантине, названия не совпадают. Использовать, когда в ответе прочерки, «источник не привязан», устаревшие данные или цифры не сходятся."
---

# Data Gaps

Use when data is missing, stale or does not add up, and the Manager wants to know why or how to fix it.

## Two calls

- `project_get(project)` — the project card: PM, domain, which sources are linked, which timesheet names and chats belong to it, and sibling projects under the same domain.
- `projects_health()` — the company-wide picture: freshness of every source, duplicates in the «Проекты» sheet, chats and timesheet names that matched no project and **why**, active projects without a chat or a Bitrix group, and timesheet rows in quarantine.

For one project start with `project_get`; go to `projects_health` for the reason and for freshness.

## What each gap means and who fixes it

You fix none of these. Say what is wrong, and who can fix it.

| Gap | Cause | Fix |
|---|---|---|
| chat not linked | the chat's name after «qmedia.by +» differs from the project's name in the sheet, or the collecting bot is not in the client's chat | rename the chat to «qmedia.by + <name from the sheet>», or ask the administrator to add the bot |
| timesheet not linked | the project is written differently in the timesheet, or as a bare domain shared by several projects | write the project's full name from the «Проекты» sheet in the timesheet |
| no Bitrix group | the timesheet's tasks are spread across groups, several groups share the name, or the group is shared with another client | the reason is in `projects_health`; tell the administrator |
| «нет в листе «Проекты»» | the project has no row in the sheet | add the row to the «Проекты» sheet |
| a source is stale or failed | collection stopped | tell the administrator |
| rows in quarantine | a timesheet row has hours but no project, date or readable time | fix those rows in the timesheet; `projects_health` gives their numbers |

The server rebuilds its links every half hour, so a fixed row or name shows up within about thirty minutes.

## Rules

- **A gap is never zero.** Say «данных нет, потому что…», never «работы не было» or «клиент не писал».
- Service chats and internal names («Внутренние проекты», test groups) are expected and need no fix.
- Duplicates in the sheet lose no data; mention them only if the Manager is tidying the sheet.
- Do not read `projects_health` out in full. Pick what concerns the Manager's project or question.

## Output

One line per gap: what is missing, why, and the one action that fixes it — with who does it.
