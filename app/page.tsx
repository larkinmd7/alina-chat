'use client';

import { useState, useEffect, useRef } from 'react';
import Sidebar from './components/Sidebar';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

interface ChatSession {
  id: string;
  name: string;
  lastMessage: string;
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
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

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
    // Сначала проверяем localStorage
    const stored = localStorage.getItem(`alina_messages_${sid}`);

    if (stored) {
      // Если есть сохраненная история - загружаем её
      try {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.length > 0) {
          setMessages(parsed);
          return;
        }
      } catch (e) {
        console.error('Parse error:', e);
      }
    }

    // Если нет сохраненной истории - загружаем начальную переписку
    setMessages(INITIAL_CONVERSATION);
    await saveMessages(INITIAL_CONVERSATION, sid);
  };

  // Сохранение сообщения
  const saveMessages = async (newMessages: Message[], sid?: string) => {
    const currentSessionId = sid || sessionId;

    // Локальное сохранение
    localStorage.setItem(`alina_messages_${currentSessionId}`, JSON.stringify(newMessages));

    // Обновить метаданные сессии
    updateSessionMetadata(currentSessionId, newMessages);

    // Синхронизация с сервером
    try {
      await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session: currentSessionId,
          messages: newMessages
        })
      });
    } catch (error) {
      console.error('Ошибка синхронизации:', error);
    }
  };

  // Загрузка всех сессий
  const loadSessions = () => {
    const sessionsData: ChatSession[] = [];
    const keys = Object.keys(localStorage);

    keys.forEach(key => {
      if (key.startsWith('alina_messages_')) {
        const sid = key.replace('alina_messages_', '');
        const messagesJson = localStorage.getItem(key);
        if (messagesJson) {
          try {
            const msgs: Message[] = JSON.parse(messagesJson);
            if (msgs.length > 0) {
              const lastMsg = msgs[msgs.length - 1];
              sessionsData.push({
                id: sid,
                name: msgs[0]?.role === 'assistant' ? msgs[0].content.substring(0, 30) + '...' : `Чат ${sid.substring(8, 13)}`,
                lastMessage: lastMsg.content.substring(0, 50) + (lastMsg.content.length > 50 ? '...' : ''),
                timestamp: lastMsg.timestamp
              });
            }
          } catch (e) {
            console.error('Parse error:', e);
          }
        }
      }
    });

    sessionsData.sort((a, b) => b.timestamp - a.timestamp);
    setSessions(sessionsData);
  };

  // Обновление метаданных сессии
  const updateSessionMetadata = (sid: string, msgs: Message[]) => {
    loadSessions();
  };

  // Создание нового чата
  const createNewChat = () => {
    const newSid = `session-${Date.now()}`;
    window.location.href = `?session=${newSid}`;
  };

  // Переключение на другую сессию
  const switchSession = (sid: string) => {
    window.location.href = `?session=${sid}`;
  };

  // Создание ветки от сообщения
  const branchFromMessage = (messageIndex: number) => {
    const newSid = `session-${Date.now()}`;
    const branchMessages = messages.slice(0, messageIndex + 1);

    // Сохранить ветку
    localStorage.setItem(`alina_messages_${newSid}`, JSON.stringify(branchMessages));

    // Переключиться на ветку
    window.location.href = `?session=${newSid}`;
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
          messages: messages.map(m => ({
            role: m.role,
            content: m.content
          })).concat([{
            role: userMessage.role,
            content: userMessage.content
          }])
        })
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        console.error('API Error:', data.error || 'Unknown error');
        alert('Ошибка при получении ответа: ' + (data.error || 'Попробуй ещё раз'));
        return;
      }

      if (!data.message) {
        console.error('No message in response:', data);
        alert('Пустой ответ от сервера. Попробуй ещё раз');
        return;
      }

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
      alert('Ошибка соединения. Проверь интернет и попробуй снова');
    } finally {
      setLoading(false);
      // Вернуть фокус на поле ввода
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex h-screen bg-gray-950 text-gray-100">
      {/* Sidebar */}
      <Sidebar
        sessions={sessions}
        currentSessionId={sessionId}
        onSelectSession={switchSession}
        onNewChat={createNewChat}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* Main content */}
      <div className={`flex flex-col flex-1 transition-all duration-200 ${sidebarOpen ? 'md:ml-80' : ''}`}>
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

          {messages.map((message, index) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} group`}
            >
              {/* Avatar для Алины с кнопкой ветвления */}
              {message.role === 'assistant' && (
                <div className="relative mr-2 flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm">
                    А
                  </div>
                  {/* Кнопка ветвления - появляется при наведении */}
                  <button
                    onClick={() => branchFromMessage(index)}
                    className="absolute -right-1 -top-1 w-5 h-5 bg-blue-600 hover:bg-blue-700 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                    title="Создать ветку от этого сообщения"
                  >
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                  </button>
                </div>
              )}

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
            ref={inputRef}
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
    </div>
  );
}
