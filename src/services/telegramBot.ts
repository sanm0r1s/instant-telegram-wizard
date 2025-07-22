import { BotTemplate } from '@/types/bot';

interface TelegramWebhookUpdate {
  update_id: number;
  message?: {
    message_id: number;
    from: {
      id: number;
      is_bot: boolean;
      first_name: string;
      username?: string;
    };
    chat: {
      id: number;
      type: string;
      username?: string;
    };
    text?: string;
    date: number;
  };
}

export class TelegramBotService {
  private apiToken: string;
  private templates: BotTemplate[];
  private apiKeys: Record<string, string>;
  private baseUrl: string;

  constructor(apiToken: string, templates: BotTemplate[], apiKeys: Record<string, string> = {}) {
    this.apiToken = apiToken;
    this.templates = templates;
    this.apiKeys = apiKeys;
    this.baseUrl = `https://api.telegram.org/bot${apiToken}`;
  }

  // Проверка валидности токена
  async validateToken(): Promise<{ valid: boolean; botInfo?: any; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/getMe`);
      const data = await response.json();
      
      if (data.ok) {
        return { valid: true, botInfo: data.result };
      } else {
        return { valid: false, error: data.description };
      }
    } catch (error) {
      return { valid: false, error: 'Ошибка подключения к Telegram API' };
    }
  }

  // Настройка webhook для получения сообщений
  async setWebhook(webhookUrl: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/setWebhook`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: webhookUrl })
      });
      const data = await response.json();
      return data.ok;
    } catch (error) {
      console.error('Ошибка настройки webhook:', error);
      return false;
    }
  }

  // Отправка сообщения
  async sendMessage(chatId: number, text: string, parseMode: string = 'HTML'): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text,
          parse_mode: parseMode
        })
      });
      const data = await response.json();
      return data.ok;
    } catch (error) {
      console.error('Ошибка отправки сообщения:', error);
      return false;
    }
  }

  // Обработка входящих сообщений
  async handleUpdate(update: TelegramWebhookUpdate): Promise<void> {
    if (!update.message?.text) return;

    const chatId = update.message.chat.id;
    const text = update.message.text.toLowerCase();
    const userId = update.message.from.id;

    // Команда /start
    if (text === '/start') {
      await this.handleStartCommand(chatId);
      return;
    }

    // Команда /help
    if (text === '/help') {
      await this.handleHelpCommand(chatId);
      return;
    }

    // Обработка сообщений через шаблоны
    await this.processMessageThroughTemplates(chatId, text, userId);
  }

  private async handleStartCommand(chatId: number): Promise<void> {
    const templateNames = this.templates.map(t => `• ${t.name}`).join('\n');
    const welcomeMessage = `
🤖 <b>Добро пожаловать!</b>

Ваш бот создан с помощью следующих шаблонов:
${templateNames}

Отправьте /help для получения списка доступных команд.
    `;
    await this.sendMessage(chatId, welcomeMessage.trim());
  }

  private async handleHelpCommand(chatId: number): Promise<void> {
    const commands = this.generateCommandsList();
    const helpMessage = `
📚 <b>Доступные команды:</b>

${commands}

💡 Просто отправляйте сообщения - бот автоматически обработает их с помощью активных шаблонов.
    `;
    await this.sendMessage(chatId, helpMessage.trim());
  }

  private generateCommandsList(): string {
    const commands = ['/start - Приветствие', '/help - Справка'];
    
    this.templates.forEach(template => {
      switch (template.id) {
        case 'reminder':
          commands.push('/remind - Создать напоминание');
          break;
        case 'translator':
          commands.push('/translate - Перевести текст');
          break;
        case 'url-shortener':
          commands.push('/short - Сократить ссылку');
          break;
        case 'polls-voting':
          commands.push('/poll - Создать опрос');
          break;
      }
    });
    
    return commands.map(cmd => `• ${cmd}`).join('\n');
  }

  private async processMessageThroughTemplates(chatId: number, text: string, userId: number): Promise<void> {
    // Обработка через каждый активный шаблон
    for (const template of this.templates) {
      const handled = await this.processTemplate(template, chatId, text, userId);
      if (handled) break; // Если сообщение обработано, не передаваем другим шаблонам
    }
  }

  private async processTemplate(template: BotTemplate, chatId: number, text: string, userId: number): Promise<boolean> {
    switch (template.id) {
      case 'chatgpt':
        return await this.processChatGPT(chatId, text);
      
      case 'translator':
        return await this.processTranslator(chatId, text);
      
      case 'reminder':
        return await this.processReminder(chatId, text, userId);
      
      case 'url-shortener':
        return await this.processUrlShortener(chatId, text);
      
      case 'polls-voting':
        return await this.processPolls(chatId, text);
      
      case 'file-converter':
        return await this.processFileConverter(chatId, text);
      
      default:
        return false;
    }
  }

  private async processChatGPT(chatId: number, text: string): Promise<boolean> {
    if (!this.apiKeys['chatgpt']) {
      await this.sendMessage(chatId, '❌ OpenAI API ключ не настроен');
      return true;
    }

    try {
      await this.sendMessage(chatId, '🤖 Обрабатываю ваш запрос...');
      
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKeys['chatgpt']}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: text }],
          max_tokens: 500
        })
      });

      const data = await response.json();
      const reply = data.choices?.[0]?.message?.content || 'Извините, не смог обработать запрос';
      
      await this.sendMessage(chatId, `🤖 ${reply}`);
      return true;
    } catch (error) {
      await this.sendMessage(chatId, '❌ Ошибка при обращении к ChatGPT');
      return true;
    }
  }

  private async processTranslator(chatId: number, text: string): Promise<boolean> {
    if (text.startsWith('/translate ') || text.includes('перевед')) {
      const textToTranslate = text.replace('/translate ', '').replace(/перевед[а-я]*\s*/gi, '');
      
      try {
        // Используем Google Translate API или LibreTranslate
        const response = await fetch('https://libretranslate.de/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            q: textToTranslate,
            source: 'auto',
            target: 'en'
          })
        });

        const data = await response.json();
        await this.sendMessage(chatId, `🌐 <b>Перевод:</b>\n${data.translatedText}`);
        return true;
      } catch (error) {
        await this.sendMessage(chatId, '❌ Ошибка перевода. Попробуйте позже.');
        return true;
      }
    }
    return false;
  }

  private async processReminder(chatId: number, text: string, userId: number): Promise<boolean> {
    if (text.startsWith('/remind ') || text.includes('напомни')) {
      const reminderText = text.replace('/remind ', '').replace(/напомни[а-я]*\s*/gi, '');
      
      // Простая реализация напоминания
      const reminderId = Date.now().toString();
      const reminderData = {
        id: reminderId,
        userId,
        chatId,
        text: reminderText,
        createdAt: new Date().toISOString()
      };

      // Сохраняем в localStorage (в реальном приложении - в базу данных)
      const reminders = JSON.parse(localStorage.getItem('botReminders') || '[]');
      localStorage.setItem('botReminders', JSON.stringify([...reminders, reminderData]));

      await this.sendMessage(chatId, `⏰ <b>Напоминание создано:</b>\n"${reminderText}"\n\n💡 ID: ${reminderId}`);
      return true;
    }
    return false;
  }

  private async processUrlShortener(chatId: number, text: string): Promise<boolean> {
    if (text.startsWith('/short ') || text.startsWith('http')) {
      const url = text.startsWith('/short ') ? text.replace('/short ', '') : text;
      
      try {
        // Создаем короткую ссылку (упрощенная реализация)
        const shortId = Math.random().toString(36).substring(2, 8);
        const shortUrl = `https://t.me/${shortId}`;
        
        // Сохраняем соответствие (в реальном приложении - в базу данных)
        const urlMappings = JSON.parse(localStorage.getItem('botUrlMappings') || '{}');
        urlMappings[shortId] = url;
        localStorage.setItem('botUrlMappings', JSON.stringify(urlMappings));

        await this.sendMessage(chatId, `🔗 <b>Короткая ссылка создана:</b>\n${shortUrl}\n\n📊 Оригинал: ${url}`);
        return true;
      } catch (error) {
        await this.sendMessage(chatId, '❌ Ошибка создания короткой ссылки');
        return true;
      }
    }
    return false;
  }

  private async processPolls(chatId: number, text: string): Promise<boolean> {
    if (text.startsWith('/poll ')) {
      const pollData = text.replace('/poll ', '');
      const [question, ...optionsArray] = pollData.split('|');
      
      if (!question || optionsArray.length < 2) {
        await this.sendMessage(chatId, '❌ Формат: /poll Вопрос|Вариант1|Вариант2|...');
        return true;
      }

      try {
        const response = await fetch(`${this.baseUrl}/sendPoll`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            question: question.trim(),
            options: optionsArray.map(opt => opt.trim()),
            is_anonymous: true
          })
        });

        if (!response.ok) {
          await this.sendMessage(chatId, '❌ Ошибка создания опроса');
        }
        return true;
      } catch (error) {
        await this.sendMessage(chatId, '❌ Ошибка создания опроса');
        return true;
      }
    }
    return false;
  }

  private async processFileConverter(chatId: number, text: string): Promise<boolean> {
    if (text.includes('конверт') || text.includes('преобразов')) {
      await this.sendMessage(chatId, `📄 <b>Конвертер файлов</b>

Отправьте файл с подписью:
• "в pdf" - конвертация в PDF
• "в jpg" - конвертация в JPG  
• "в png" - конвертация в PNG
• "в doc" - конвертация в DOC

Поддерживаемые форматы: PDF, DOC, JPG, PNG, GIF`);
      return true;
    }
    return false;
  }
}