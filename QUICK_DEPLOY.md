# 🚀 БЫСТРЫЙ ДЕПЛОЙ — 1 МИНУТА

## Вариант 1: Netlify (Рекомендуется)

```bash
cd /tmp/alina-chat
netlify deploy --prod --dir=.next
```

Следуй промптам:
1. "What would you like to do?" → Выбери "Create & configure a new project"
2. Команда: AICJM
3. Site name: оставь пустым (будет рандомный)
4. Deploy!

Получишь ссылку вида: `https://random-name-123.netlify.app`

---

## Вариант 2: Vercel (Ещё проще)

```bash
cd /tmp/alina-chat
npx vercel --prod
```

Следуй промптам - Vercel сам всё настроит.

---

## Вариант 3: Railway (Один клик)

1. Зарегистрируйся на https://railway.app
2. Нажми "New Project" → "Deploy from GitHub repo"
3. Залей код в GitHub
4. Railway автоматически задеплоит

---

## Что уже готово:

✅ Проект собран (`npm run build` выполнен)
✅ Gemini 2.0 Flash Thinking настроен
✅ API ключ встроен
✅ Интерфейс чата готов
✅ Сохранение истории работает

Просто запусти одну из команд выше и получишь ссылку!
