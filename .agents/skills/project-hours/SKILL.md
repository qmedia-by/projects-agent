---
name: project-hours
description: "Часы по проекту из таймшита: сколько затрекано, куда ушло время, план и факт, разбивка по типам работ, месяцам и задачам. Использовать на вопросы про часы, трудозатраты, перерасход и «сколько потратили на проект»."
---

# Project Hours

Use for any question about time spent on a project.

## The call

`time_summary(project, date_from, date_to, group_by)`:

- `group_by="tag"` — by work type (dev, support, communication, edits/bugs…). The default, and what «куда ушло время» means.
- `group_by="month"` — by month, for trends.
- `group_by="task"` — by task, with Bitrix links, for «на что конкретно».
- `date_from`, `date_to` — `YYYY-MM-DD`. Without them the whole history comes back.

**Name the period.** If the Manager gave none, use the current calendar month and say so in the first line of the answer. Ask instead when the question points at a period you cannot infer («за этап», «с начала работ по новому ТЗ»).

## Rules

- **Plan versus fact covers only tasks that have a plan.** The timesheet rarely records one, and the answer says how much of the time is covered. Never present it as the project's plan.
- **No hours by person.** The per-specialist breakdown is switched off on the server on purpose. Do not rebuild it from `group_by="task"`, from task responsibles or from the chat. If asked, say it is not available here and why.
- **A client's whole work is several projects.** `example.by` and `example.by (ЛК)` are separate names in the timesheet. Asked about the client as a whole, call each project, list which ones you included, and only then add them up.
- **«таймшит не привязан» is not zero hours.** The project's name in the timesheet does not match the Registry. Say so and offer `data-gaps`.
- Rows the timesheet could not interpret — no project, a broken date or time — are in no total. If the Manager doubts a total, `projects_health` shows how many such rows exist.

## Output

State the project, the period and the total first. Then the breakdown as a short table, largest first, in the server's units (`12 ч 30 мин`). Do not convert hours to money.
