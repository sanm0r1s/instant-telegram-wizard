
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Bot, ExternalLink } from 'lucide-react';

interface StepOneProps {
  apiToken: string;
  onTokenChange: (token: string) => void;
  onNext: () => void;
}

export const StepOne = ({ apiToken, onTokenChange, onNext }: StepOneProps) => {
  const [isValidating, setIsValidating] = useState(false);

  const validateToken = async () => {
    if (!apiToken.trim()) return;
    
    setIsValidating(true);
    // Simulate token validation
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsValidating(false);
    onNext();
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <Bot className="h-16 w-16 text-purple-600 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-gray-800 mb-2">
          Введите API токен вашего Telegram бота
        </h3>
        <p className="text-gray-600">
          Получите токен от @BotFather в Telegram для начала работы
        </p>
      </div>

      <div className="max-w-md mx-auto space-y-4">
        <div>
          <Label htmlFor="token" className="text-base font-medium">
            Bot API Token
          </Label>
          <Input
            id="token"
            type="password"
            placeholder="123456789:ABCdefGHIjklMNOpqrsTUVwxyz"
            value={apiToken}
            onChange={(e) => onTokenChange(e.target.value)}
            className="mt-2"
          />
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-2">Как получить токен:</h4>
          <ol className="text-sm text-blue-800 space-y-1">
            <li>1. Найдите @BotFather в Telegram</li>
            <li>2. Отправьте команду /newbot</li>
            <li>3. Следуйте инструкциям</li>
            <li>4. Скопируйте полученный токен</li>
          </ol>
          <a
            href="https://t.me/botfather"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium mt-2"
          >
            Открыть @BotFather
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>

        <Button
          onClick={validateToken}
          disabled={!apiToken.trim() || isValidating}
          className="w-full"
          size="lg"
        >
          {isValidating ? 'Проверка токена...' : 'Продолжить'}
        </Button>
      </div>
    </div>
  );
};
