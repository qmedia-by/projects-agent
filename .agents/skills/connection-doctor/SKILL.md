---
name: connection-doctor
description: "Подключить сервер проектов в первый раз и чинить сбои подключения: вход через Google, ошибка авторизации, сервер не отвечает, инструменты не видны, устаревшая версия. Использовать на фразы «подключи сервер проектов», «войди», «проверь подключение» и при ошибках MCP."
---

# Connection Doctor

Find which layer failed and give exactly one next action.

## The layers, in order

1. **Config.** The server is defined in this repository's `.codex/config.toml` as `qmedia_projects`, URL `https://projects-mcp.tech.qmedia.by/mcp`. Codex reads that file only when the folder is trusted. If `codex mcp list` does not show the server, the folder was not trusted — point the Manager at step 6 of `docs/manager-setup.md`.
2. **Sign-in.** Google OAuth. `codex mcp list` shows `Auth: OAuth` for a signed-in server.
3. **Access.** The server admits only addresses on its managers list. Signing in with any other Google account succeeds in the browser and still fails on the server.
4. **Tools.** Only after sign-in and access: are `project_overview`, `projects_list` and the rest available?
5. **Version.** Only when all of the above works but the agent does not behave as written: is the checkout behind `origin/dev`?

Do not skip ahead: a missing tool before sign-in is a sign-in problem.

## Signing in, in Codex

A Manager in VS Code cannot start the OAuth flow from the extension, so do it for them: `codex mcp login qmedia_projects`, run from this folder so the project config is read.

**Find the binary.** `codex` is often not on the PATH of your shell. Try in this order and stop at the first hit:

```bash
command -v codex
readlink -f "$(command -v apply_patch)"
ls ~/.vscode/extensions/openai.chatgpt-*/bin/*/codex
ls /Applications/ChatGPT.app/Contents/Resources/codex
```

**Escalate.** The command needs the network and opens a browser, and the sandbox blocks both. Request escalated permissions with a one-line justification instead of reporting a sandbox error as a failure.

Before the browser opens, tell the Manager: choose the **work** Google account — the one whose address they gave the administrator — and allow access on the server's own page as well.

The command waits for the browser, so it can outlive the tool timeout. **A timeout is not a failure and must not be retried blindly** — check `codex mcp list` instead.

## States

**Not signed in.** `Auth` is not `OAuth`, or every call fails with an authorization error from the start. One action: sign in as above.

**Signed in, still refused.** The browser flow completed, `codex mcp list` shows `OAuth`, and calls still fail with an authorization error or the server asks to sign in again. This is access, not sign-in: the Google address used is not on the server's managers list — most often a personal account chosen instead of the work one. One action: sign in again with the work account; if it already was the work account, the Manager asks the administrator to add that exact address. Repeating the same sign-in does not help.

**A static key in a config.** An `Authorization` header, `http_headers`, `env_http_headers` or `bearer_token_env_var` for `qmedia_projects` in `~/.codex/config.toml` overrides OAuth, and Codex will not even try to sign in. Report that the line has to go, without printing its value.

**Server unreachable.** Connection errors, timeouts or 5xx on every call while sign-in looks fine. `https://projects-mcp.tech.qmedia.by/health` answering `ok` means the server is up and the fault is local; anything else is a server fault. One action: tell the administrator. Do not suggest signing in again.

**The checkout is behind.** Check without touching the working tree:

```bash
git fetch --quiet origin dev && git rev-list --count HEAD..origin/dev
```

A non-zero count explains absent skills and rules that no longer match. One action: the `tool-update` skill, then a new chat. It explains nothing about authorization errors.

## Output

Report the failing layer (`config`, `oauth`, `access`, `server`, `tools`, `version`), one next action, and what to check after it.

Never print tokens or authorization headers, and never ask the Manager to paste them.
