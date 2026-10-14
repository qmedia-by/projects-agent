# Estimate rules

How to map a presale's input onto the templates. The templates live in «DEV Продажи / Сметы»; the server copies the right one, you switch rows on and off and change hours.

## Row model

Every template has the same columns: task, hours, specialist level, cost, «Включено». Cost is a formula: hours × the rate of the level from «Тарифы». An excluded row shows «-» and costs nothing. Each section ends with «Итого …», a sum over its rows.

- **Page-type rows** («Главная страница», «Категория каталога», «Карточка товара», …) mean one layout of that type, not one per page. Ten information pages are one «Информационная страница».
- **Quantity rows** carry the volume in the text: «(2 страницы)», «до 10 страниц», «за 50 товаров», «до 4 блоков». Scale both together: the number in the text and the hours.
- **Percentage rows** — rows whose hours `estimate_read` shows as «(формула)». In custom they are «Менеджмент проекта» (20%), «Приемочное тестирование» (10%), «Общее тестирование верстки», «Тестирование кроссбраузерности», «Тестирование адаптивности» (5% of layout each). Switch them on; never set their hours. In other templates the same names may be plain hours — then scale them like any row, with a reason.
- **Level** stays as in the template unless the input gives a reason (an integration with an accounting system is Senior or «TeamLead/TechLead» work). Use level names exactly as in «Тарифы» — `estimate_read` prints them. A row you add without a level gets Middle.

## Base rows by solution

### custom — Кастом

All rows are off in the template. For a new site switch on, even if the client never mentioned them:

- management and acceptance: «Менеджмент проекта», «Приемочное тестирование»;
- layout testing: «Общее тестирование верстки», «Тестирование кроссбраузерности», «Тестирование адаптивности», and in programming «Модульное тестирование», «Операционное тестирование»;
- the base of the site: «Подготовка инфраструктуры…», «Настройка и конфигурирование Evolution CMS», «Реализация базового функционала…», «Сквозные блоки…», «Главная страница» (layout), «Подключение SSL-сертификата», «Перенос сайта на сервер заказчика», «Обучение работе с Evolution CMS».

«Техническая поддержка (3 месяца)» stays off unless asked for. The «Смета на проектирование» sheet is switched on only when the input implies design work before development; its prototypes cover the same page types as the layout. When unclear, say it is an assumption.

### reacto — Коробка Reacto, ready — Готовое решение

The base package (fixed price) is on: it already covers structure, styling, test content up to 10 pages, acceptance, management, training, moving to the client's server and SSL. Add only «Дополнительные работы». «Техническая поддержка. 3 месяца» is on in the template — keep it unless the client declined it.

When you switch on functional rows of «Дополнительные работы» — integrations, payments, a personal account, delivery, languages, rows you add — also switch on «Операционное и модульное тестирование доп. функционала» and raise its hours with the volume of added work, with a reason. Content filling and graphics need no testing row.

### tilda

Most rows are on in the template. «Наполнение контентом доп. страниц» and «Техническая поддержка» are off: switch on only if asked. «Менеджмент проекта» here is plain hours, not a formula: raise it when you add work, with a reason.

### other — доработки

Empty rows. Each requested change becomes a row: fill them top to bottom, default level Middle, then `trim_empty=true` removes the unused ones. For an existing Project, base hours on `time_summary(group_by="task")` for similar past tasks.

## Typical bundles

| Input says | Rows (custom) |
|---|---|
| интернет-магазин | layout: «Категория каталога», «Карточка товара», «Корзина»; programming: «Фильтрация товаров», «Сортировка товаров», «Оформление заказа через корзину», «Подключение систем онлайн-оплаты заказа», «Расчет стоимости доставки в корзине» |
| каталог без корзины | «Категория каталога», «Карточка товара», «Фильтрация товаров» |
| личный кабинет | layout and prototypes «Личный кабинет …»; programming «Базовый личный кабинет пользователя…», «История заказов…» when there are orders |
| выгрузка из 1С, остатки, цены | «Интеграция сайта с системой учета склада (1С)» or the lighter «Экспорт/импорт товаров в excel…» — ask which, if the input does not say |
| несколько языков | «Мультиязычность» |
| блог, новости, акции | «Страница раздела для информационных страниц…» |

When the input names something no row covers — a quiz, a configurator, an integration with a specific service — add a row and base its hours on `estimates_find`.
