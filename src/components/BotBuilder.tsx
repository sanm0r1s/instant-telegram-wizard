
import React, { useState } from 'react';
import { StepOne } from './bot-builder/StepOne';
import { StepTwo } from './bot-builder/StepTwo';
import { StepThree } from './bot-builder/StepThree';
import { BotTemplate } from '@/types/bot';

interface BotBuilderState {
  apiToken: string;
  selectedTemplates: BotTemplate[];
  botName: string;
}

export const BotBuilder = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [builderState, setBuilderState] = useState<BotBuilderState>({
    apiToken: '',
    selectedTemplates: [],
    botName: ''
  });

  const updateState = (updates: Partial<BotBuilderState>) => {
    setBuilderState(prev => ({ ...prev, ...updates }));
  };

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-center space-x-8">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  step <= currentStep
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {step}
              </div>
              {step < 3 && (
                <div
                  className={`w-16 h-1 ml-2 ${
                    step < currentStep ? 'bg-purple-600' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-4">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-800">
              {currentStep === 1 && 'Шаг 1: Введите API токен'}
              {currentStep === 2 && 'Шаг 2: Выберите шаблоны'}
              {currentStep === 3 && 'Шаг 3: Создайте бота'}
            </h2>
          </div>
        </div>
      </div>

      {/* Step content */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        {currentStep === 1 && (
          <StepOne
            apiToken={builderState.apiToken}
            onTokenChange={(token) => updateState({ apiToken: token })}
            onNext={nextStep}
          />
        )}
        {currentStep === 2 && (
          <StepTwo
            selectedTemplates={builderState.selectedTemplates}
            onTemplatesChange={(templates) => updateState({ selectedTemplates: templates })}
            onNext={nextStep}
            onPrev={prevStep}
          />
        )}
        {currentStep === 3 && (
          <StepThree
            builderState={builderState}
            onPrev={prevStep}
            onBotNameChange={(name) => updateState({ botName: name })}
          />
        )}
      </div>
    </div>
  );
};
