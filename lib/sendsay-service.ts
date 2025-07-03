// Сервис для работы с Sendsay API
require('isomorphic-fetch'); // Полифилл для fetch в Node.js
const Sendsay = require('sendsay-api');

export interface SendsayConfig {
  apiKey?: string;
  login?: string;
  sublogin?: string;
  password?: string;
}

export interface EmailCampaign {
  subject: string;
  content: string;
  recipients: string[];
}

export interface SendResult {
  success: boolean;
  sent: number;
  failed: number;
  mode: 'sendsay' | 'simulation';
  details?: any;
}

export class SendsayService {
  private sendsay: any;
  private isSimulation: boolean;

  constructor(config?: SendsayConfig) {
    this.isSimulation = !config?.apiKey && !config?.login;
    
    if (!this.isSimulation) {
      try {
        if (config?.apiKey) {
          // Аутентификация через API ключ (рекомендуется)
          this.sendsay = new Sendsay({ apiKey: config.apiKey });
        } else if (config?.login && config?.password) {
          // Аутентификация через логин/пароль
          this.sendsay = new Sendsay({
            auth: {
              login: config.login,
              sublogin: config.sublogin || '',
              password: config.password
            }
          });
        } else {
          throw new Error('Необходим API ключ или логин/пароль для Sendsay');
        }
      } catch (error) {
        console.error('Ошибка инициализации Sendsay:', error);
        this.isSimulation = true;
      }
    }
    
    if (this.isSimulation) {
      console.warn('🔄 Sendsay работает в режиме симуляции');
    }
  }

  // Проверка соединения с Sendsay
  async verifyConnection(): Promise<boolean> {
    if (this.isSimulation) {
      console.log('✅ Симуляция: соединение с Sendsay проверено');
      return true;
    }

    try {
      const response = await this.sendsay.request({
        action: 'sys.settings.get',
        list: ['about.id']
      });
      
      console.log('✅ Соединение с Sendsay установлено:', response.list['about.id']);
      return true;
    } catch (error) {
      console.error('❌ Ошибка соединения с Sendsay:', error);
      return false;
    }
  }

  // Отправка email кампании
  async sendCampaign(campaign: EmailCampaign): Promise<SendResult> {
    if (this.isSimulation) {
      return this.simulateSend(campaign);
    }

    try {
      console.log(`📨 Отправка кампании "${campaign.subject}" для ${campaign.recipients.length} получателей`);

      // Подготавливаем данные для отправки
      const campaignData = {
        action: 'issue.send',
        letter: {
          subject: campaign.subject,
          body: {
            html: campaign.content,
            text: this.stripHtml(campaign.content) // Текстовая версия
          }
        },
        sendwhen: 'now',
        users: {
          list: campaign.recipients
        }
      };

      const response = await this.sendsay.request(campaignData);

      if (response.errors && response.errors.length > 0) {
        throw new Error(`Sendsay API ошибки: ${JSON.stringify(response.errors)}`);
      }

      console.log('✅ Кампания отправлена через Sendsay');

      return {
        success: true,
        sent: campaign.recipients.length,
        failed: 0,
        mode: 'sendsay',
        details: response
      };

    } catch (error) {
      console.error('❌ Ошибка отправки через Sendsay:', error);
      
      return {
        success: false,
        sent: 0,
        failed: campaign.recipients.length,
        mode: 'sendsay',
        details: error
      };
    }
  }

  // Добавление подписчика
  async addSubscriber(email: string, listId?: string): Promise<boolean> {
    if (this.isSimulation) {
      console.log(`✅ Симуляция: подписчик ${email} добавлен`);
      return true;
    }

    try {
      const response = await this.sendsay.request({
        action: 'member.set',
        email: email,
        // Можно добавить дополнительные поля
        return_fresh: 1
      });

      console.log(`✅ Подписчик ${email} добавлен в Sendsay`);
      return true;

    } catch (error) {
      console.error(`❌ Ошибка добавления подписчика ${email}:`, error);
      return false;
    }
  }

  // Удаление подписчика
  async removeSubscriber(email: string): Promise<boolean> {
    if (this.isSimulation) {
      console.log(`✅ Симуляция: подписчик ${email} удален`);
      return true;
    }

    try {
      const response = await this.sendsay.request({
        action: 'member.delete',
        email: email
      });

      console.log(`✅ Подписчик ${email} удален из Sendsay`);
      return true;

    } catch (error) {
      console.error(`❌ Ошибка удаления подписчика ${email}:`, error);
      return false;
    }
  }

  // Получение статистики
  async getStatistics(dateFrom?: string, dateTo?: string): Promise<any> {
    if (this.isSimulation) {
      return {
        mode: 'simulation',
        total_sent: 150,
        total_opened: 45,
        total_clicked: 12,
        bounce_rate: 2.1,
        open_rate: 30.0,
        click_rate: 8.0
      };
    }

    try {
      const response = await this.sendsay.request({
        action: 'stat.uni',
        dimension: ['date'],
        filter: {
          date: {
            from: dateFrom || this.getDateWeekAgo(),
            to: dateTo || this.getDateToday()
          }
        }
      });

      return {
        mode: 'sendsay',
        data: response
      };

    } catch (error) {
      console.error('❌ Ошибка получения статистики:', error);
      return null;
    }
  }

  // Приватные методы
  private async simulateSend(campaign: EmailCampaign): Promise<SendResult> {
    console.log(`🔄 Симуляция отправки кампании "${campaign.subject}"`);
    console.log(`📧 Получатели: ${campaign.recipients.length}`);
    
    // Симулируем задержку
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Симулируем небольшой процент неудачных отправок
    const failedCount = Math.floor(campaign.recipients.length * 0.02); // 2% неудач
    const sentCount = campaign.recipients.length - failedCount;
    
    console.log(`✅ Симуляция завершена: отправлено ${sentCount}, неудач ${failedCount}`);
    
    return {
      success: true,
      sent: sentCount,
      failed: failedCount,
      mode: 'simulation'
    };
  }

  private stripHtml(html: string): string {
    return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
  }

  private getDateToday(): string {
    return new Date().toISOString().split('T')[0];
  }

  private getDateWeekAgo(): string {
    const date = new Date();
    date.setDate(date.getDate() - 7);
    return date.toISOString().split('T')[0];
  }
}

// Экспорт singleton instance
let sendsayInstance: SendsayService | null = null;

export const getSendsayService = (): SendsayService => {
  if (!sendsayInstance) {
    const config: SendsayConfig = {
      apiKey: process.env.SENDSAY_API_KEY,
      login: process.env.SENDSAY_LOGIN,
      sublogin: process.env.SENDSAY_SUBLOGIN,
      password: process.env.SENDSAY_PASSWORD
    };
    
    sendsayInstance = new SendsayService(config);
  }
  
  return sendsayInstance;
}; 