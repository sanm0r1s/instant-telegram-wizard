
import React from 'react';
import { Button } from '@/components/ui/button';
import { TemplateCard } from './TemplateCard';
import { BotTemplate } from '@/types/bot';
import { botTemplates } from '@/data/templates';

interface StepTwoProps {
  selectedTemplates: BotTemplate[];
  onTemplatesChange: (templates: BotTemplate[]) => void;
  onNext: () => void;
  onPrev: () => void;
}

export const StepTwo = ({ selectedTemplates, onTemplatesChange, onNext, onPrev }: StepTwoProps) => {
  const toggleTemplate = (template: BotTemplate) => {
    const isSelected = selectedTemplates.some(t => t.id === template.id);
    if (isSelected) {
      onTemplatesChange(selectedTemplates.filter(t => t.id !== template.id));
    } else {
      onTemplatesChange([...selectedTemplates, template]);
    }
  };

  const categories = [
    { id: 'ai', name: 'ИИ и чат-боты', icon: '🤖' },
    { id: 'utility', name: 'Утилиты', icon: '🔧' },
    { id: 'social', name: 'Социальные', icon: '👥' },
    { id: 'business', name: 'Бизнес', icon: '💼' },
    { id: 'automation', name: 'Автоматизация', icon: '⚡' },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">
          Выберите шаблоны для вашего бота
        </h3>
        <p className="text-gray-600">
          Можете выбрать несколько шаблонов - они будут объединены в одном боте
        </p>
        <div className="mt-4 text-sm text-purple-600 font-medium">
          Выбрано: {selectedTemplates.length} шаблонов
        </div>
      </div>

      {categories.map(category => {
        const categoryTemplates = botTemplates.filter(t => t.category === category.id);
        return (
          <div key={category.id} className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <span className="text-2xl">{category.icon}</span>
              {category.name}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categoryTemplates.map(template => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  isSelected={selectedTemplates.some(t => t.id === template.id)}
                  onToggle={() => toggleTemplate(template)}
                />
              ))}
            </div>
          </div>
        );
      })}

      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={onPrev}>
          Назад
        </Button>
        <Button 
          onClick={onNext} 
          disabled={selectedTemplates.length === 0}
        >
          Создать бота ({selectedTemplates.length} шаблонов)
        </Button>
      </div>
    </div>
  );
};
