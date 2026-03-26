export type NotificationCategory = 'personal' | 'market';

export interface Notification {
  id: string;
  title: string;
  subtitle?: string;
  actionLabel?: string;
  actionHref?: string;
  timestamp: string;
  isRead: boolean;
  category: NotificationCategory;
}

export type NotificationTab = 'all' | 'personal' | 'market';
