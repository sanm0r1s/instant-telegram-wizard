
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BotTemplate } from '@/types/bot';
import { Check, Plus } from 'lucide-react';

interface TemplateCardProps {
  template: BotTemplate;
  isSelected: boolean;
  onToggle: () => void;
}

export const TemplateCard = ({ template, isSelected, onToggle }: TemplateCardProps) => {
  return (
    <Card className={`p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
      isSelected ? 'ring-2 ring-purple-500 bg-purple-50' : 'hover:bg-gray-50'
    }`} onClick={onToggle}>
      <div className="flex items-start justify-between mb-3">
        <div className="text-2xl">{template.icon}</div>
        <Button
          size="sm"
          variant={isSelected ? "default" : "outline"}
          className="h-8 w-8 p-0"
        >
          {isSelected ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
        </Button>
      </div>
      
      <h4 className="font-semibold text-gray-800 mb-2">{template.name}</h4>
      <p className="text-sm text-gray-600 mb-3">{template.description}</p>
      
      <div className="space-y-2">
        <div className="text-xs text-gray-500">Возможности:</div>
        <ul className="text-xs text-gray-600 space-y-1">
          {template.features.slice(0, 3).map((feature, index) => (
            <li key={index} className="flex items-center gap-2">
              <div className="w-1 h-1 bg-purple-400 rounded-full"></div>
              {feature}
            </li>
          ))}
          {template.features.length > 3 && (
            <li className="text-purple-600 font-medium">
              +{template.features.length - 3} больше
            </li>
          )}
        </ul>
      </div>

      {template.requiresApiKey && (
        <div className="mt-3 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
          Требует API ключ: {template.apiKeyLabel}
        </div>
      )}
    </Card>
  );
};
