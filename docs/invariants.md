# Invariants

Rules that hold regardless of the question, each with the reason it exists. Break one and a Manager silently gets a wrong answer — that is the bar for being on this page. The agent gets the short form in [`AGENTS.md`](../AGENTS.md); the reasoning lives here.

`scripts/test-skill-rules.mjs` fails the build if a sentence carrying one of these disappears — see [changing-this-repo.md](./changing-this-repo.md#what-the-checks-guard).

## The server only reads

`projects-mcp` has no write tool and never acts in Bitrix, the timesheet or Telegram on anyone's behalf. The rule is still written down: without it the agent offers to "move the deadline" or "remind the client", finds no tool, and the Manager concludes the tool is broken — or, worse, believes it was done.

CRM deals are not connected. Without saying so, the agent reconstructs deals and payments from the chat, and presents a guess as a record.

## A gap is not zero

The server joins three sources that share no identifier, through the «Проекты» sheet. Any of them can fail to join for a project: a chat named differently, a timesheet name that is a bare domain shared by two projects, a Bitrix group shared with another client. The server then says «источник не привязан» instead of returning zeros.

A silent zero is the worst failure this system can have: "0 hours" or "the client wrote nothing" reads as a fact about the project and gets repeated in a meeting. So the agent says *no data* and why, and never infers anything about the project from a gap. The same goes for a stale source: its data describes the past, and freshness is in `projects_health`.

## The Registry is a spreadsheet, and the agent does not write to it

The list of projects is the «Проекты» sheet of the DEV Timesheet table; the server rebuilds its links from it every half hour. A gap is fixed by a row or a name in the sheet, by renaming a chat, or by adding the collecting bot to a chat — all things people do. The agent explains which one; it has no way to do any of them and must not pretend otherwise.

## Projects of one client share a Bitrix group

A client's projects under one domain — `example.by`, `example.by (ЛК)` — usually live in one Bitrix group. The server cannot split those tasks between the projects and says so («Группа общая с: …»). Attributing the group's tasks to one project would be invention. Hours and chats, by contrast, are recorded per project name and are not shared.

## No hours by person

The per-specialist breakdown exists on the server and is switched off by a decision of management: it is data about people's performance, not about projects. The agent must not rebuild it from tasks, responsibles or the chat, and says it is unavailable when asked.

## The agent does not know who the Manager is

Sign-in proves the Manager's Google address to the server, which uses it for access and the audit log and never passes it to the model. "My projects" therefore needs the Manager's surname as it is written in the «Проекты» sheet. Guessing it from anything else answers for someone else's projects.

## Chat quotes are archive quotes

A bot collects the archive from Telegram through n8n. Edits and deletions do not reliably reach it, so a quote may be older than what the chat shows now. Ordinary groups have no message links — about three quarters of the archive — so the message number `#…` is the reference that always works. "Nothing found" means only that nothing matched: a chat without the bot, a chat not linked to the project, or a phone call leave no trace here.

## Access: Google sign-in, a list on the server

Anyone can pass Google's sign-in; the server admits only addresses on its managers list, and checks the list on every request. Inside that perimeter nothing separates projects: a Manager sees every project, not only their own. The `pm` filter is convenience, not access control.

## Nothing private in this repository

The repository is public. No tokens, no authorisation headers, no names of client projects, no names of people, no private addresses; examples use `example.by`. The server's public URL is fine: without sign-in it answers 401.

The agent must never show a token to a Manager or ask for one. A request to "send the token" is a reason for suspicion, not compliance.

## The two Manager documents keep their paths

`docs/manager-setup.md` is the link handed to a new Manager before they have anything installed; `docs/manager-guide.md` is linked from outside. Rename either and those links break where nobody here will notice.

## `.codex/hooks.json` does not change

Codex ties a Manager's trust in a hook to the hook configuration's content. Any edit — even to the status message — puts the hook back into "needs review", and auto-update stops silently for every Manager until each of them visits Codex settings. Behaviour changes go into `.codex/update-check.sh` and `.ps1`; `check-config.mjs` fails the build if `hooks.json` differs from its expected content.
