
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { CreatedBot } from '@/types/bot';
import { Rocket, ExternalLink, CheckCircle } from 'lucide-react';

interface StepThreeProps {
  builderState: {
    apiToken: string;
    selectedTemplates: any[];
    botName: string;
  };
  onPrev: () => void;
  onBotNameChange: (name: string) => void;
}

export const StepThree = ({ builderState, onPrev, onBotNameChange }: StepThreeProps) => {
  const [isCreating, setIsCreating] = useState(false);
  const [createdBot, setCreatedBot] = useState<CreatedBot | null>(null);
  const [requiredApiKeys, setRequiredApiKeys] = useState<Record<string, string>>({});

  const templatesWithApiKeys = builderState.selectedTemplates.filter(t => t.requiresApiKey);

  const createBot = async () => {
    setIsCreating(true);
    
    // Simulate bot creation process
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const newBot: CreatedBot = {
      id: Date.now().toString(),
      name: builderState.botName || 'Мой бот',
      apiToken: builderState.apiToken,
      templates: builderState.selectedTemplates,
      createdAt: new Date(),
      botUrl: `https://t.me/${builderState.botName?.toLowerCase().replace(/\s+/g, '_') || 'mybot'}`
    };

    // Save to localStorage
    const existingBots = JSON.parse(localStorage.getItem('createdBots') || '[]');
    localStorage.setItem('createdBots', JSON.stringify([...existingBots, newBot]));

    setCreatedBot(newBot);
    setIsCreating(false);
  };

  if (createdBot) {
    return (
      <div className="text-center space-y-6">
        <div className="mb-8">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            Ваш бот успешно создан!
          </h3>
          <p className="text-gray-600">
            Бот готов к использованию и уже развернут
          </p>
        </div>

        <Card className="p-6 max-w-md mx-auto bg-green-50 border-green-200">
          <h4 className="font-semibold text-green-800 mb-3">Информация о боте:</h4>
          <div className="space-y-2 text-sm">
            <div><strong>Название:</strong> {createdBot.name}</div>
            <div><strong>Шаблоны:</strong> {createdBot.templates.length}</div>
            <div><strong>Создан:</strong> {createdBot.createdAt.toLocaleString('ru-RU')}</div>
          </div>
          <a
            href={createdBot.botUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-4 text-green-600 hover:text-green-800 font-medium"
          >
            Открыть бота
            <ExternalLink className="h-4 w-4" />
          </a>
        </Card>

        <Button
          onClick={() => window.location.reload()}
          className="bg-purple-600 hover:bg-purple-700"
        >
          Создать еще одного бота
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <Rocket className="h-16 w-16 text-purple-600 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-gray-800 mb-2">
          Финальные настройки
        </h3>
        <p className="text-gray-600">
          Осталось немного - укажите название бота и необходимые API ключи
        </p>
      </div>

      <div className="max-w-md mx-auto space-y-6">
        <div>
          <Label htmlFor="botName" className="text-base font-medium">
            Название бота
          </Label>
          <Input
            id="botName"
            placeholder="Мой крутой бот"
            value={builderState.botName}
            onChange={(e) => onBotNameChange(e.target.value)}
            className="mt-2"
          />
        </div>

        {templatesWithApiKeys.length > 0 && (
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-800">
              Дополнительные API ключи:
            </h4>
            {templatesWithApiKeys.map(template => (
              <div key={template.id}>
                <Label className="text-sm font-medium">
                  {template.apiKeyLabel} (для {template.name})
                </Label>
                <Input
                  type="password"
                  placeholder="Введите API ключ..."
                  value={requiredApiKeys[template.id] || ''}
                  onChange={(e) => setRequiredApiKeys(prev => ({
                    ...prev,
                    [template.id]: e.target.value
                  }))}
                  className="mt-1"
                />
              </div>
            ))}
          </div>
        )}

        <Card className="p-4 bg-blue-50 border-blue-200">
          <h4 className="font-semibold text-blue-900 mb-2">Выбранные шаблоны:</h4>
          <div className="space-y-1">
            {builderState.selectedTemplates.map(template => (
              <div key={template.id} className="flex items-center gap-2 text-sm text-blue-800">
                <span>{template.icon}</span>
                <span>{template.name}</span>
              </div>
            ))}
          </div>
        </Card>

        <div className="flex justify-between pt-6">
          <Button variant="outline" onClick={onPrev} disabled={isCreating}>
            Назад
          </Button>
          <Button
            onClick={createBot}
            disabled={!builderState.botName.trim() || isCreating}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {isCreating ? 'Создание бота...' : 'Создать бота'}
          </Button>
        </div>
      </div>
    </div>
  );
};
