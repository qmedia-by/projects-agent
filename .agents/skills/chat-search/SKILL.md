---
name: chat-search
description: "Найти в переписке с клиентом в Telegram: что обсуждали, о чём договорились, что клиент писал про оплату, сроки, правки, доступы. Использовать на вопросы про переписку, договорённости и сообщения клиента по проекту."
---

# Chat Search

Use when the answer lives in what was written in the project's Telegram chats.

## Searching

`chat_search(project, query, date_from, date_to, limit, cursor)` searches one project's chats, newest first.

- `query` matches word forms («оплата» finds «оплатили») and substrings (a domain inside a link). It does **not** fix typos and knows no synonyms: before saying nothing was found, try another form of the word and the words a client would use («счёт», «акт», «перевод» for a payment).
- Without `query` it returns the whole chat for the period — use that for «что было на этой неделе».
- `date_from`, `date_to` are `YYYY-MM-DD`, Minsk time. Narrow the period whenever the Manager gives one.
- `limit` is up to 50; the next page is the `cursor` from the previous answer. Page only while pages are still relevant.

Every message has a number `#…`. **Before interpreting a message, read around it** with `chat_thread(project, message="#…", before, after)`: «да» or «согласовано» means nothing without what it answered.

## Authors

An author marked «(qmedia)» is a company employee. Every other author is the client or a contractor, and the server cannot tell which. Where it matters who said something, write «со стороны клиента» or quote the name — do not call an unmarked author "the client" as a fact.

## Rules

- **Quote briefly, always with the number `#…`,** and with the link when the answer has one. Supergroups have links; ordinary groups do not, and then the number is the reference.
- **Quotes are «по данным архива».** Edits and deletions in Telegram may not reach the archive.
- **Do not dump the chat.** Summarise and quote what answers the question. A full export only on a direct request, saved outside the tool's folder where the Manager says.
- **Silence is not proof.** «Ничего не найдено» means nothing in the archive matched these words: the talk may have happened by phone, in another chat, or in a chat without the collecting bot. If the answer says the chat is not linked, this project's archive is not searchable at all — say that, never «клиент не писал».
- One search covers one project. For a client with several projects, search each and say which ones you covered.

## Output

Answer the question first, in a sentence or two. Then the evidence: dated quotes with `#…` and links — oldest first when it is a story, newest first when it is «чем закончилось».
