
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Shield, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

interface AdminLoginProps {
  onLogin: () => void;
}

export const AdminLogin = ({ onLogin }: AdminLoginProps) => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [generatedCredentials, setGeneratedCredentials] = useState<{username: string, password: string} | null>(null);

  useEffect(() => {
    // Check if credentials already exist
    const existingCreds = localStorage.getItem('adminCredentials');
    if (!existingCreds) {
      // Generate new credentials on first launch
      const newCreds = {
        username: 'admin',
        password: Math.random().toString(36).slice(-8)
      };
      localStorage.setItem('adminCredentials', JSON.stringify(newCreds));
      setGeneratedCredentials(newCreds);
      
      toast.success('Сгенерированы новые учетные данные администратора!', {
        duration: 5000
      });
    }
  }, []);

  const handleLogin = () => {
    const storedCreds = JSON.parse(localStorage.getItem('adminCredentials') || '{}');
    
    if (credentials.username === storedCreds.username && 
        credentials.password === storedCreds.password) {
      onLogin();
      toast.success('Успешный вход в админ панель');
    } else {
      toast.error('Неверные учетные данные');
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <Card className="p-8">
        <div className="text-center mb-6">
          <Shield className="h-12 w-12 text-purple-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800">Админ панель</h2>
          <p className="text-gray-600">Вход в панель управления</p>
        </div>

        {generatedCredentials && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h3 className="font-semibold text-yellow-800 mb-2">
              Сгенерированы учетные данные:
            </h3>
            <div className="text-sm text-yellow-700 space-y-1">
              <div><strong>Логин:</strong> {generatedCredentials.username}</div>
              <div><strong>Пароль:</strong> {generatedCredentials.password}</div>
            </div>
            <p className="text-xs text-yellow-600 mt-2">
              Сохраните эти данные в надежном месте!
            </p>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <Label htmlFor="username">Логин</Label>
            <Input
              id="username"
              value={credentials.username}
              onChange={(e) => setCredentials(prev => ({
                ...prev,
                username: e.target.value
              }))}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="password">Пароль</Label>
            <div className="relative mt-1">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={credentials.password}
                onChange={(e) => setCredentials(prev => ({
                  ...prev,
                  password: e.target.value
                }))}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          <Button
            onClick={handleLogin}
            className="w-full"
            disabled={!credentials.username || !credentials.password}
          >
            Войти
          </Button>
        </div>
      </Card>
    </div>
  );
};
