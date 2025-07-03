
import { BotTemplate } from '@/types/bot';

export const botTemplates: BotTemplate[] = [
  // AI Category
  {
    id: 'chatgpt',
    name: 'ChatGPT Бот',
    description: 'Интеграция с OpenAI API для умных ответов',
    icon: '🤖',
    category: 'ai',
    requiresApiKey: true,
    apiKeyLabel: 'OpenAI API Key',
    features: [
      'Ответы на любые вопросы',
      'Контекстные диалоги',
      'Генерация текста',
      'Настройка личности бота'
    ]
  },
  {
    id: 'translator',
    name: 'Переводчик',
    description: 'Автоматический перевод текста на разные языки',
    icon: '🌐',
    category: 'ai',
    features: [
      'Поддержка 100+ языков',
      'Определение языка',
      'Быстрый перевод',
      'Сохранение истории'
    ]
  },

  // Utility Category
  {
    id: 'reminder',
    name: 'Напоминания',
    description: 'Создание напоминаний и повторяющихся задач',
    icon: '⏰',
    category: 'utility',
    features: [
      'Разовые напоминания',
      'Повторяющиеся задачи',
      'Гибкие настройки времени',
      'Уведомления в Telegram'
    ]
  },
  {
    id: 'url-shortener',
    name: 'Сокращатель ссылок',
    description: 'Создание коротких ссылок и отслеживание кликов',
    icon: '🔗',
    category: 'utility',
    features: [
      'Короткие красивые ссылки',
      'Статистика переходов',
      'Пользовательские домены',
      'QR коды для ссылок'
    ]
  },
  {
    id: 'file-converter',
    name: 'Конвертер файлов',
    description: 'Конвертация файлов: PDF↔DOC, JPG↔PNG и др.',
    icon: '📄',
    category: 'utility',
    features: [
      'PDF в DOC и обратно',
      'Конвертация изображений',
      'Сжатие файлов',
      'Пакетная обработка'
    ]
  },

  // Social Category
  {
    id: 'anonymous-chat',
    name: 'Анонимный чат',
    description: 'Анонимное общение пользователей через бота',
    icon: '💬',
    category: 'social',
    features: [
      'Полная анонимность',
      'Случайные собеседники',
      'Фильтры по интересам',
      'Модерация контента'
    ]
  },
  {
    id: 'polls-voting',
    name: 'Опросы и голосования',
    description: 'Создание интерактивных опросов и голосований',
    icon: '📊',
    category: 'social',
    features: [
      'Многовариантные опросы',
      'Анонимное голосование',
      'Результаты в реальном времени',
      'Экспорт результатов'
    ]
  },
  {
    id: 'channel-stats',
    name: 'Статистика каналов',
    description: 'Аналитика и статистика Telegram каналов/групп',
    icon: '📈',
    category: 'social',
    features: [
      'Анализ активности',
      'Статистика участников',
      'Отчеты по контенту',
      'Экспорт данных'
    ]
  },

  // Business Category
  {
    id: 'payment-bot',
    name: 'Платежный бот',
    description: 'Прием платежей через Stripe/YooKassa',
    icon: '💳',
    category: 'business',
    requiresApiKey: true,
    apiKeyLabel: 'Stripe/YooKassa API',
    features: [
      'Прием карточных платежей',
      'Подписки и рекуррент',
      'Чеки и уведомления',
      'Аналитика продаж'
    ]
  },

  // Automation Category
  {
    id: 'rss-feed',
    name: 'RSS лента',
    description: 'Автоматическая публикация новостей из RSS',
    icon: '📰',
    category: 'automation',
    features: [
      'Мониторинг RSS фидов',
      'Автопостинг новостей',
      'Фильтрация по ключевым словам',
      'Настройка расписания'
    ]
  }
];
