
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CreatedBot, BotStats } from '@/types/bot';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { LogOut, Bot, Template, Users, TrendingUp } from 'lucide-react';

interface AdminDashboardProps {
  onLogout: () => void;
}

export const AdminDashboard = ({ onLogout }: AdminDashboardProps) => {
  const [stats, setStats] = useState<BotStats>({
    totalBots: 0,
    templatesUsage: {},
    apiTokensUsed: [],
    recentBots: []
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = () => {
    const bots: CreatedBot[] = JSON.parse(localStorage.getItem('createdBots') || '[]');
    const templatesUsage: Record<string, number> = {};
    const apiTokensUsed: string[] = [];

    bots.forEach(bot => {
      // Count template usage
      bot.templates.forEach(template => {
        templatesUsage[template.name] = (templatesUsage[template.name] || 0) + 1;
      });
      
      // Collect unique API tokens (masked for security)
      const maskedToken = bot.apiToken.slice(0, 8) + '...';
      if (!apiTokensUsed.includes(maskedToken)) {
        apiTokensUsed.push(maskedToken);
      }
    });

    setStats({
      totalBots: bots.length,
      templatesUsage,
      apiTokensUsed,
      recentBots: bots.slice(-5).reverse()
    });
  };

  const templateChartData = Object.entries(stats.templatesUsage).map(([name, count]) => ({
    name,
    count
  }));

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff00', '#ff00ff'];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-800">Панель администратора</h2>
        <Button onClick={onLogout} variant="outline" className="flex items-center gap-2">
          <LogOut className="h-4 w-4" />
          Выйти
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Всего ботов</p>
              <p className="text-3xl font-bold text-purple-600">{stats.totalBots}</p>
            </div>
            <Bot className="h-12 w-12 text-purple-400" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Шаблонов использовано</p>
              <p className="text-3xl font-bold text-blue-600">
                {Object.keys(stats.templatesUsage).length}
              </p>
            </div>
            <Template className="h-12 w-12 text-blue-400" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">API токенов</p>
              <p className="text-3xl font-bold text-green-600">{stats.apiTokensUsed.length}</p>
            </div>
            <Users className="h-12 w-12 text-green-400" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Популярность</p>
              <p className="text-3xl font-bold text-orange-600">
                {Math.max(...Object.values(stats.templatesUsage), 0)}
              </p>
            </div>
            <TrendingUp className="h-12 w-12 text-orange-400" />
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Популярность шаблонов</h3>
          {templateChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={templateChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-300 flex items-center justify-center text-gray-500">
              Нет данных для отображения
            </div>
          )}
        </Card>

        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Распределение шаблонов</h3>
          {templateChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={templateChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {templateChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-300 flex items-center justify-center text-gray-500">
              Нет данных для отображения
            </div>
          )}
        </Card>
      </div>

      {/* Recent Bots */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4">Последние созданные боты</h3>
        {stats.recentBots.length > 0 ? (
          <div className="space-y-4">
            {stats.recentBots.map(bot => (
              <div key={bot.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-semibold">{bot.name}</h4>
                  <p className="text-sm text-gray-600">
                    {bot.templates.length} шаблонов • {bot.createdAt.toLocaleString('ru-RU')}
                  </p>
                </div>
                <div className="text-sm text-gray-500">
                  {bot.apiToken.slice(0, 8)}...
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-8">
            Боты еще не созданы
          </div>
        )}
      </Card>

      {/* API Tokens Used */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4">Использованные API токены</h3>
        {stats.apiTokensUsed.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stats.apiTokensUsed.map((token, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded-lg font-mono text-sm">
                {token}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-8">
            API токены еще не использовались
          </div>
        )}
      </Card>
    </div>
  );
};
