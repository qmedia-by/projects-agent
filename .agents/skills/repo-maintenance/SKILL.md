---
name: repo-maintenance
description: "Править сам инструмент: скиллы, корневые инструкции, документацию, конфиг сервера. Использовать, когда Менеджер просит изменить поведение агента или поправить текст инструмента, а не ответить на вопрос по проекту."
---

# Repo Maintenance

Use when the task is to change this repository rather than to answer a question about a project. This is the only case in which the repository is writable; reports and notes still never land here.

## Read before editing

`docs/README.md` maps the rest. Then the page that owns your change:

| Change | Read |
|---|---|
| a rule the agent must follow | `docs/invariants.md` |
| where a fact belongs, the workflow, the checks | `docs/changing-this-repo.md` |
| how a Manager sets up or works | `docs/manager-setup.md`, `docs/manager-guide.md` |

The server lives in its own repository, `qmedia-by/projects-mcp`: `README.md` for the tools and their behaviour, `docs/DEPLOY.md` for deployment and access. It is the authority on those; do not restate it here.

## Rules that decide most of the work

- **Decide the layer first.** A fact whose loss gives the Manager a wrong answer belongs in the server's response, not only in an instruction. `AGENTS.md` holds what is true in every session; detail about one kind of question goes in a skill; maintenance guidance goes in `docs/`.
- **Keep `AGENTS.md` short** — under about a hundred lines. It is paid for in every session.
- **Skill descriptions are Russian**, in the words a Manager uses, under 500 characters. Bodies are English, for the Model.
- **Run `npm test` before you are done.**
- **Nothing private, ever.** The repository is public: no tokens, no names of client projects, no names of people, no private addresses. Examples use `example.by`.
- **Update the Manager's documents in the same change** when a Manager has to act differently. Both keep their paths.
- **Never edit `.codex/hooks.json`.** Codex ties trust in a hook to its content; an edit silently switches auto-update off for every Manager. Change `.codex/update-check.sh` and `.ps1` instead.

## Changes that reach the server

Merge and deploy `projects-mcp` first, verify on a real project, then merge this repository. The reverse order ships instructions for behaviour that does not exist yet, and auto-update delivers them to every Manager.

## Output

Say which files changed and which layer each fact landed in. If a change needs a decision that belongs to people — anything that changes what the Manager's guide promises — put the option in front of them instead of taking it.
