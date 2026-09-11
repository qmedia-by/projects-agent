# Changing this repository

You are here because someone asked for the **tool** to change, not for an answer about a project. That is the only case in which this repository is writable.

## Where a new fact belongs

Decide this before writing anything. A rule in the wrong layer looks done and is not.

| Layer | Put a fact here when | Cost |
|---|---|---|
| **The server's response** (`projects-mcp`) | losing it gives the Manager a wrong answer | a server change and a deploy |
| **`AGENTS.md`** | it is true in every session and dangerous to break | paid for in every session |
| **A skill** | it applies to one kind of question | loads only with the skill |
| **`docs/`** | it is for whoever changes the tool | never loaded by a Manager's session |
| **`docs/manager-guide.md`** | a Manager needs to act on it | Russian, nothing private |
| **`docs/manager-setup.md`** | it changes how a machine is set up | Russian, nothing private |

The first row matters most. A skill is text the Model may not load; a tool's response lands in the context every time. That is why the server itself prints «источник не привязан», the reason a chat or a timesheet name did not link, and the note that CRM deals are not in the overview. The instructions repeat these facts, but they are not the load-bearing copy.

Keep `AGENTS.md` under about a hundred lines; `lint-skills.mjs` enforces it.

## Editing skills

Skills live directly in `.agents/skills/<name>/`. Codex is the only Environment, so there is no source directory and no generated copies.

- `SKILL.md` frontmatter: `name` equal to the directory; `description` in Russian, in the words a Manager uses, under 500 characters — it is how the Model decides to load the skill.
- The body is English, for the Model.
- `agents/openai.yaml`: display name, short description, default prompt; `dependencies.tools` names the `qmedia_projects` MCP server for skills that call it.
- References go in `references/*.md` and are linked from `SKILL.md` in backticks.
- A new skill gets a row in the skills table of `AGENTS.md`.

Then, always:

```bash
npm test
```

## What the checks guard

| Script | Guards |
|---|---|
| `lint-skills.mjs` | frontmatter; `name` matching the directory; description language and length; `agents/openai.yaml` present; every skill listed in `AGENTS.md` and every listed skill present; references linked both ways; `AGENTS.md` length |
| `test-skill-rules.mjs` | that specific load-bearing sentences still exist in `AGENTS.md` and in skills |
| `check-config.mjs` | that `.codex/config.toml` defines exactly the `qmedia_projects` server at its URL with no static keys; that `README.md` and `connection-doctor` name the same address; that `.codex/hooks.json` is unchanged |

Add a rule to `test-skill-rules.mjs` only when losing the sentence would put a false statement in front of a Manager. Every extra check makes it more tempting to loosen a regex than to fix the text.

CI runs `npm test` on pull requests into `dev`. `dev` is the branch every Manager's checkout follows: whatever lands there reaches all of them at the start of their next chat.

## Keeping the documentation honest

When behaviour changes, update in the same change: the skill or instruction that carries it, `docs/manager-guide.md` if a Manager must act differently, and whichever page in `docs/` owns the fact. See [README.md](./README.md#how-these-documents-are-kept).

## Changes that span both repositories

1. Merge and deploy `projects-mcp`.
2. Verify on a real project.
3. Only then merge `projects-agent`.

The reverse order ships instructions for server behaviour that does not exist yet, and auto-update hands them to every Manager the same day.

## The update hook

A `SessionStart` hook runs `.codex/update-check.sh`, or `.ps1` on Windows. On `dev` it fetches and fast-forwards, discards edits to tracked files, never touches untracked ones, and tells the agent to suggest a new chat. Both scripts must behave the same. Never edit `.codex/hooks.json` — see [invariants.md](./invariants.md#codexhooksjson-does-not-change).
