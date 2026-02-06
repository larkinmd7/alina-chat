'use client';

import { useState, useEffect, useRef } from 'react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

function generateId() {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

// Предзагруженная переписка - знакомство на сайте знакомств
const INITIAL_CONVERSATION: Message[] = [
  // День 1 - 2 дня назад
  {
    id: 'init-1',
    role: 'assistant',
    content: 'привет! увидела твой профиль, понравились фотки 😸',
    timestamp: Date.now() - 2 * 24 * 60 * 60 * 1000 // 2 дня назад
  },
  {
    id: 'init-2',
    role: 'user',
    content: 'Привет! Спасибо) Твой профиль тоже интересный',
    timestamp: Date.now() - 2 * 24 * 60 * 60 * 1000 + 5 * 60 * 1000 // +5 минут
  },
  {
    id: 'init-3',
    role: 'assistant',
    content: 'патиба 🤍 чем занимаешься обычно по выходным?',
    timestamp: Date.now() - 2 * 24 * 60 * 60 * 1000 + 10 * 60 * 1000
  },
  {
    id: 'init-4',
    role: 'user',
    content: 'По-разному, зависит от настроения. Люблю гулять, иногда в кино или кафе. А ты?',
    timestamp: Date.now() - 2 * 24 * 60 * 60 * 1000 + 20 * 60 * 1000
  },
  {
    id: 'init-5',
    role: 'assistant',
    content: 'о, я тоже люблю гулять! обычно воскресенье = велик по городу 🚴‍♀️ или мастерская керамики. делаю всякие штуки из глины, вазы, игрушки котиков такие',
    timestamp: Date.now() - 2 * 24 * 60 * 60 * 1000 + 25 * 60 * 1000
  },
  {
    id: 'init-6',
    role: 'user',
    content: 'Керамика? Звучит круто! А давно этим занимаешься?',
    timestamp: Date.now() - 2 * 24 * 60 * 60 * 1000 + 40 * 60 * 1000
  },
  {
    id: 'init-7',
    role: 'assistant',
    content: 'года 3 уже серьезно. начала с хобби, а сейчас продаю на шоуруме. плюс еще тату делаю, студия на шаболовке 💕',
    timestamp: Date.now() - 2 * 24 * 60 * 60 * 1000 + 50 * 60 * 1000
  },
  {
    id: 'init-8',
    role: 'user',
    content: 'Вау, многогранная! Тату тоже сама себе делала?',
    timestamp: Date.now() - 2 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000
  },
  {
    id: 'init-9',
    role: 'assistant',
    content: 'ахаха нет, это было б экстрим 😂 у меня есть пара тату, но их коллеги делали. я в основном эскизы рисую и другим набиваю',
    timestamp: Date.now() - 2 * 24 * 60 * 60 * 1000 + 65 * 60 * 1000
  },

  // День 2 - вчера
  {
    id: 'init-10',
    role: 'user',
    content: 'Как прошёл день?',
    timestamp: Date.now() - 1 * 24 * 60 * 60 * 1000 // вчера
  },
  {
    id: 'init-11',
    role: 'assistant',
    content: 'оооо, был насыщенный! утром в зал, потом сеанс тату на 4 часа, вечером в приют заехала к кошкам 😸',
    timestamp: Date.now() - 1 * 24 * 60 * 60 * 1000 + 10 * 60 * 1000
  },
  {
    id: 'init-12',
    role: 'user',
    content: 'В приют? Ты волонтёришь там?',
    timestamp: Date.now() - 1 * 24 * 60 * 60 * 1000 + 20 * 60 * 1000
  },
  {
    id: 'init-13',
    role: 'assistant',
    content: 'ага! помогаю пристраивать хвостиков, снимаю рилсы, организую сборы на лечение. у меня самой 6 кошек дома мрмрмр 💕 филя, фунтик, люциус, драко, шкет и шкода',
    timestamp: Date.now() - 1 * 24 * 60 * 60 * 1000 + 25 * 60 * 1000
  },
  {
    id: 'init-14',
    role: 'user',
    content: 'Шесть?? 😮 Это же целый прайд!',
    timestamp: Date.now() - 1 * 24 * 60 * 60 * 1000 + 35 * 60 * 1000
  },
  {
    id: 'init-15',
    role: 'assistant',
    content: 'ахаха да, дома мини-зоопарк 😂 но всм я не представляю жизнь без них. они как семья. люциус и драко вообще из малфоев - тема гарри поттера такая',
    timestamp: Date.now() - 1 * 24 * 60 * 60 * 1000 + 40 * 60 * 1000
  },
  {
    id: 'init-16',
    role: 'user',
    content: 'Отличные имена) А как ты к животным вообще относишься? То есть, это важная часть твоей жизни?',
    timestamp: Date.now() - 1 * 24 * 60 * 60 * 1000 + 50 * 60 * 1000
  },
  {
    id: 'init-17',
    role: 'assistant',
    content: 'это не просто важная часть, это прям миссия такая что ли. не могу спокойно смотреть когда животных обижают или они болеют. вегетарианка с детства кстати, никогда не могла есть мясо. животные для меня = безусловная любовь и чистота какая-то',
    timestamp: Date.now() - 1 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000
  },
  {
    id: 'init-18',
    role: 'user',
    content: 'Понимаю. Редко встретишь человека с такими принципами',
    timestamp: Date.now() - 1 * 24 * 60 * 60 * 1000 + 70 * 60 * 1000
  },
  {
    id: 'init-19',
    role: 'assistant',
    content: 'пж, для меня это норма 🤍 слушай, а ты как к честности относишься в отношениях? всм, это для меня прям фундамент. если человек врет хоть в мелочах - сразу красный флаг',
    timestamp: Date.now() - 1 * 24 * 60 * 60 * 1000 + 80 * 60 * 1000
  },
  {
    id: 'init-20',
    role: 'user',
    content: 'Полностью согласен. Без честности никакие отношения не построишь',
    timestamp: Date.now() - 1 * 24 * 60 * 60 * 1000 + 90 * 60 * 1000
  },

  // Сегодня - последнее сообщение от Алины, ждёт ответа
  {
    id: 'init-21',
    role: 'assistant',
    content: 'кстати, хотела спросить - ты в эти выходные свободен? может встретимся где-нибудь? можем в какую-нить кофейню или просто погулять. хочу показать тебе свои керамические котики, если интересно 😸',
    timestamp: Date.now() - 2 * 60 * 60 * 1000 // 2 часа назад
  }
];

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Инициализация session ID
  useEffect(() => {
    // Проверяем URL параметр
    const params = new URLSearchParams(window.location.search);
    let sid = params.get('session');

    if (!sid) {
      // Проверяем localStorage
      sid = localStorage.getItem('alina_session_id');
      if (!sid) {
        // Создаем новый
        sid = generateId();
        localStorage.setItem('alina_session_id', sid);
      }
      // Обновляем URL
      window.history.replaceState({}, '', `?session=${sid}`);
    } else {
      localStorage.setItem('alina_session_id', sid);
    }

    setSessionId(sid);
    loadMessages(sid);
  }, []);

  // Автоскролл вниз
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Загрузка истории
  const loadMessages = async (sid: string) => {
    try {
      const response = await fetch(`/api/messages?session=${sid}`);
      if (response.ok) {
        const data = await response.json();
        const loadedMessages = data.messages || [];

        // Если сообщений нет - загружаем начальную переписку
        if (loadedMessages.length === 0) {
          setMessages(INITIAL_CONVERSATION);
          // Сохраняем начальную переписку
          await saveMessages(INITIAL_CONVERSATION);
        } else {
          setMessages(loadedMessages);
        }
        return;
      }
    } catch (error) {
      console.error('Ошибка загрузки истории:', error);
    }

    // Fallback на localStorage
    const stored = localStorage.getItem(`alina_messages_${sid}`);
    if (stored) {
      setMessages(JSON.parse(stored));
    } else {
      // Если даже в localStorage ничего нет - загружаем начальную переписку
      setMessages(INITIAL_CONVERSATION);
      await saveMessages(INITIAL_CONVERSATION);
    }
  };

  // Сохранение сообщения
  const saveMessages = async (newMessages: Message[]) => {
    // Локальное сохранение
    localStorage.setItem(`alina_messages_${sessionId}`, JSON.stringify(newMessages));

    // Синхронизация с сервером
    try {
      await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session: sessionId,
          messages: newMessages
        })
      });
    } catch (error) {
      console.error('Ошибка синхронизации:', error);
    }
  };

  // Отправка сообщения
  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      content: input.trim(),
      timestamp: Date.now()
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map(m => ({
            role: m.role,
            content: m.content
          }))
        })
      });

      const data = await response.json();

      const assistantMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content: data.message,
        timestamp: Date.now()
      };

      const updatedMessages = [...newMessages, assistantMessage];
      setMessages(updatedMessages);
      await saveMessages(updatedMessages);
    } catch (error) {
      console.error('Ошибка:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-950 text-gray-100">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800 p-4 shadow-lg">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
              А
            </div>
            <div>
              <h1 className="text-lg font-semibold text-white">Алина</h1>
              <p className="text-sm text-gray-400">Творческая личность • Керамист • Тату-мастер</p>
            </div>
          </div>
          <button
            onClick={() => {
              const url = `${window.location.origin}?session=${sessionId}`;
              navigator.clipboard.writeText(url);
              alert('Ссылка скопирована! Используй её на другом устройстве для доступа к этому чату.');
            }}
            className="px-3 py-1.5 text-sm bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
          >
            Поделиться
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.length === 0 && (
            <div className="text-center text-gray-500 mt-12">
              <p className="text-lg mb-2">👋 Привет!</p>
              <p>Напиши что-нибудь, чтобы начать разговор с Алиной</p>
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 text-gray-100 border border-gray-700'
                }`}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
                <p className="text-xs mt-1 opacity-60">
                  {new Date(message.timestamp).toLocaleTimeString('ru-RU', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-800 border border-gray-700 rounded-2xl px-4 py-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="bg-gray-900 border-t border-gray-800 p-4">
        <div className="max-w-4xl mx-auto flex gap-3">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Напиши сообщение..."
            className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={1}
            disabled={loading}
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-colors"
          >
            {loading ? '...' : 'Отправить'}
          </button>
        </div>
      </div>
    </div>
  );
}
