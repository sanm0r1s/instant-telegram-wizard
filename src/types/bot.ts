
export interface BotTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'ai' | 'utility' | 'social' | 'business' | 'automation';
  requiresApiKey?: boolean;
  apiKeyLabel?: string;
  features: string[];
}

export interface CreatedBot {
  id: string;
  name: string;
  apiToken: string;
  templates: BotTemplate[];
  createdAt: Date;
  botUrl: string;
  botUsername?: string;
}

export interface AdminUser {
  username: string;
  password: string;
}

export interface BotStats {
  totalBots: number;
  templatesUsage: Record<string, number>;
  apiTokensUsed: string[];
  recentBots: CreatedBot[];
}
