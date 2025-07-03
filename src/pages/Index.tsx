
import React, { useState } from 'react';
import { BotBuilder } from '@/components/BotBuilder';
import { AdminPanel } from '@/components/AdminPanel';
import { Button } from '@/components/ui/button';
import { Shield, Bot } from 'lucide-react';

const Index = () => {
  const [currentView, setCurrentView] = useState<'builder' | 'admin'>('builder');

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <header className="bg-white/80 backdrop-blur-sm border-b border-purple-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Bot className="h-8 w-8 text-purple-600" />
            <h1 className="text-2xl font-bold text-gray-800">Telegram Bot Builder</h1>
          </div>
          <div className="flex gap-2">
            <Button
              variant={currentView === 'builder' ? 'default' : 'outline'}
              onClick={() => setCurrentView('builder')}
              className="flex items-center gap-2"
            >
              <Bot className="h-4 w-4" />
              Создать бота
            </Button>
            <Button
              variant={currentView === 'admin' ? 'default' : 'outline'}
              onClick={() => setCurrentView('admin')}
              className="flex items-center gap-2"
            >
              <Shield className="h-4 w-4" />
              Админ панель
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {currentView === 'builder' ? <BotBuilder /> : <AdminPanel />}
      </main>
    </div>
  );
};

export default Index;
