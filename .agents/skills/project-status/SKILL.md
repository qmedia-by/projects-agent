---
name: project-status
description: "Сводка по проекту: что происходит, как дела, статус задач, часы и переписка. Использовать на вопросы «что с проектом», «как дела у клиента», «подготовь статус по проекту» и перед встречей с клиентом."
---

# Project Status

Use when the Manager asks what is going on with a project. The answer is a short status built from what the server actually returned, with every gap named.

## Start with the overview

Call `project_overview` with the project as the Manager named it. One call returns:

- Bitrix tasks of the project's group, the development team's only: active, overdue, stale for 14+ days, awaiting acceptance, deferred, closed in the last 30 days, and the nearest open tasks with links;
- hours from the timesheet for the last 30 days, with the top work types;
- the chat pulse: messages in two weeks, the last one, and whether the client is waiting for an answer;
- how fresh each source is.

Most status questions are answered by this call alone. Go further only when the question needs more than the overview shows:

| The Manager also wants | Call |
|---|---|
| where the hours went, or a period other than 30 days | `time_summary` — see `project-hours` |
| what exactly the client wrote or agreed | `chat_search`, `chat_thread` — see `chat-search` |
| every item that needs action, not just the counts | `attention_list` with `project` — see `attention` |

## When the server refuses

- **«подходит несколько проектов»** — list the candidates and ask which one. Projects of one client are separate projects; do not merge them unless asked about the client as a whole.
- **«проект не найден»** — say so and offer `projects_list` with part of the name. A project truly missing from the Registry needs a row in the «Проекты» sheet; you cannot add it.

## Reading the overview honestly

- A section saying the group is not linked, tasks were never loaded, or the chat is not linked means **no data**. Name the missing source, and the reason if the overview gives one. Never report it as "no tasks", "no hours" or "the client is silent". Offer `data-gaps` if the Manager wants it fixed.
- «Группа общая с: …» means the tasks belong to several projects together. Say that the task figures cover all of them.
- «найдена по названию» means the group link rests on the group's name, not on tasks from the timesheet. Mention it if the task numbers look wrong to the Manager.
- CRM deals are not in the overview. Asked about deals or payments by CRM, say the server has no CRM data.
- Task figures cover the development team only — responsible people who log hours in the DEV Timesheet. The overview says how many open tasks of other departments (SEO, PPC, Target) it left out; mention that count, and call `project_overview` with `all_departments=true` only when the Manager asks about those departments. A task with open subtasks is not counted as stale: the work happens in the subtasks.
- Stale and awaiting-acceptance counts are signals, not verdicts. A task untouched for two weeks may simply be waiting on the client; do not invent a reason.

## Output

Lead with one or two sentences on the state of the project in plain words. Then short blocks — Задачи, Часы, Переписка — each only if it has something, with links to Bitrix tasks and message numbers `#…`. End with what needs attention, if anything. Name every missing source in one line rather than dropping its block silently.
