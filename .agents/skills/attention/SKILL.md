---
name: attention
description: "Что горит: просроченные и зависшие задачи Битрикса, задачи на приёмке, чаты клиентов без ответа — по моим проектам, по PM, по одному проекту или по всем. Использовать на вопросы «что горит», «что просрочено», «кому не ответили», «что зависло»."
---

# Attention

Use when the Manager wants to know what needs action now.

## Choose the scope

`attention_list` takes one of:

- `pm` — part of a PM's surname as written in the «Проекты» sheet. This is how "my projects" works.
- `project` — one project.
- neither — every client project in the company. Large; use it only when asked for everything.

**You do not know who the Manager is.** The server knows their Google address, but you never see it. When they say «у меня» or «мои проекты», ask for their surname as it appears in the «Проекты» sheet — once per chat — and reuse it. Do not guess it from a greeting, a signature or anything else: a wrong guess answers for someone else's projects.

`stale_days` defaults to 14. Change it only when the Manager names a different threshold.

## What the sections mean

| Section | Meaning | Caveat |
|---|---|---|
| Просроченные задачи | active tasks past their deadline | a deadline nobody moved is still overdue here |
| Без движения больше N дней | active tasks unchanged for N days, overdue ones excluded | may be waiting on the client — a signal, not a failure |
| Ждут приёмки больше 3 дней | tasks awaiting acceptance for more than 3 days | someone has to accept or return them |
| Чаты без ответа | the last message in a project chat is not from an employee, older than a day, within two weeks | the answer may have happened by phone or in another chat |

A task of a group shared by several projects is listed once, with all its projects. The footnotes name projects without a Bitrix group and groups whose tasks were never loaded: those projects are **not** "all clear" — they are unknown.

## Output

Group by project, overdue first. For each item: the task link or the chat, how late or how long silent, and the responsible person as the server gave it. Keep it scannable — a list, not prose. If nothing is listed, say so, and still name the projects the footnotes mark as unknown.

Do not prescribe what to do with each task. Point at what needs a decision; the decision is the Manager's.
