# Documentation for changing the tool

These pages are for the agent — or the person — changing this repository. A session answering questions about projects never loads them; it reads `AGENTS.md`, `CONTEXT.md` and the skills.

| Page | Owns |
|---|---|
| [invariants.md](./invariants.md) | rules that hold in every session, each with the reason it exists |
| [changing-this-repo.md](./changing-this-repo.md) | where a fact belongs, the workflow, what the checks guard, the order across repositories |
| [manager-setup.md](./manager-setup.md) | setting up a Manager's machine — in Russian, for the Manager |
| [manager-guide.md](./manager-guide.md) | typical questions and errors — in Russian, for the Manager |

The server is documented in its own repository, `qmedia-by/projects-mcp`: the tools and their behaviour in `README.md`, deployment and access in `docs/DEPLOY.md`.

## How these documents are kept

- **One home per fact.** Link to it rather than restating it: two copies diverge on the first edit.
- **Reasons next to rules.** A rule without its reason gets deleted as noise by the next person who never saw the failure it prevents.
- **Edit in place.** No changelogs inside documents; git history is the changelog.
