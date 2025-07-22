import { TelegramBotService } from './telegramBot';

// Обработчик webhook для входящих сообщений от Telegram
export class WebhookHandler {
  private static botServices: Map<string, TelegramBotService> = new Map();

  // Регистрация бота в системе и начало опроса
  static registerBot(apiToken: string, botService: TelegramBotService): void {
    this.botServices.set(apiToken, botService);
    botService.startPolling(); // Начинаем опрос сообщений
  }

  // Удаление бота из системы и остановка опроса
  static unregisterBot(apiToken: string): void {
    const botService = this.botServices.get(apiToken);
    if (botService) {
      botService.destroy(); // Останавливаем опрос
    }
    this.botServices.delete(apiToken);
  }

  // Обработка входящего webhook от Telegram
  static async handleWebhook(apiToken: string, update: any): Promise<void> {
    const botService = this.botServices.get(apiToken);
    
    if (!botService) {
      console.error(`Бот с токеном ${apiToken} не найден`);
      return;
    }

    try {
      await botService.handleUpdate(update);
    } catch (error) {
      console.error('Ошибка обработки сообщения:', error);
    }
  }

  // Инициализация всех сохраненных ботов при загрузке приложения
  static initializeBots(): void {
    try {
      const botConfigs = JSON.parse(localStorage.getItem('botConfigs') || '{}');
      const createdBots = JSON.parse(localStorage.getItem('createdBots') || '[]');

      createdBots.forEach((bot: any) => {
        const config = botConfigs[bot.apiToken];
        if (config) {
          const botService = new TelegramBotService(
            bot.apiToken,
            config.templates,
            config.apiKeys
          );
          this.registerBot(bot.apiToken, botService);
        }
      });

      console.log(`Инициализировано ${this.botServices.size} ботов`);
    } catch (error) {
      console.error('Ошибка инициализации ботов:', error);
    }
  }

  // Получение статистики активных ботов
  static getBotStats(): { totalBots: number; activeTokens: string[] } {
    return {
      totalBots: this.botServices.size,
      activeTokens: Array.from(this.botServices.keys())
    };
  }
}

// Инициализируем боты при загрузке модуля
if (typeof window !== 'undefined') {
  WebhookHandler.initializeBots();
}