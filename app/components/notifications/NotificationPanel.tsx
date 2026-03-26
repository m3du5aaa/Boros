'use client';

import { useState } from 'react';
import { Notification, NotificationTab } from './types';
import NotificationItem from './NotificationItem';

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    title: 'XRPUSDC is now close-only',
    subtitle: 'OKX XRPUSDT · 12 Mar 2026 (ETH)',
    actionLabel: 'Manage positions',
    actionHref: '#',
    timestamp: '5s',
    isRead: false,
    category: 'market',
  },
  {
    id: '2',
    title: 'GOLDUSDC is now close-only',
    subtitle: 'Binance GOLDUSDC · 12 Mar 2026 (ETH)',
    actionLabel: 'Manage positions',
    actionHref: '#',
    timestamp: '20s',
    isRead: false,
    category: 'market',
  },
  {
    id: '3',
    title: 'Deposit confirmed',
    subtitle: '0.015 ETH are in and ready to use.',
    actionLabel: 'Wallet > Binance ETHUSDT · 23 May 2026 (ETH)',
    actionHref: '#',
    timestamp: '30s',
    isRead: false,
    category: 'personal',
  },
  {
    id: '4',
    title: 'New market live',
    subtitle: 'OKX ETHUSDT · 12 Mar 2026 (ETH)',
    actionLabel: 'View market',
    actionHref: '#',
    timestamp: '50s',
    isRead: false,
    category: 'market',
  },
  {
    id: '5',
    title: 'Deposit failed',
    subtitle: 'Wallet > ETH cross margin',
    actionLabel: 'Try again',
    actionHref: '#',
    timestamp: '50s',
    isRead: false,
    category: 'personal',
  },
  {
    id: '6',
    title: 'Withdrawal initiated',
    subtitle: '0.0029 ETH are on their way to your wallet.',
    actionLabel: 'OKX XRPUSDC · 12 Mar 2026 (ETH) > Wallet',
    actionHref: '#',
    timestamp: '15m',
    isRead: false,
    category: 'personal',
  },
  {
    id: '7',
    title: 'Implied APR above 18%',
    subtitle: 'OKX ETHUSDT · 12 Mar 2026 (ETH)',
    actionLabel: 'View market',
    actionHref: '#',
    timestamp: '2m',
    isRead: false,
    category: 'market',
  },
  {
    id: '8',
    title: 'Underlying APR above 9%',
    subtitle: 'Binance BTCUSDC · 12 Mar 2026 (BTC)',
    actionLabel: 'View market',
    actionHref: '#',
    timestamp: '15m',
    isRead: false,
    category: 'market',
  },
  {
    id: '9',
    title: 'Spread above 2%',
    subtitle: 'OKX XRPUSDT · 12 Mar 2026 (ETH)',
    actionLabel: 'View market',
    actionHref: '#',
    timestamp: '25m',
    isRead: false,
    category: 'market',
  },
  {
    id: '10',
    title: 'New OTC proposal received',
    subtitle: 'ETHUSDT (12 Mar 2026) · Expires in 24h',
    actionLabel: 'View proposal',
    actionHref: '#',
    timestamp: '2h',
    isRead: true,
    category: 'personal',
  },
  {
    id: '11',
    title: 'OTC proposal accepted',
    subtitle: 'BTCUSDC (27 Feb 2026) · Now settling',
    actionLabel: 'View proposal',
    actionHref: '#',
    timestamp: '5h',
    isRead: true,
    category: 'personal',
  },
  {
    id: '12',
    title: 'Health factor low',
    subtitle: 'Binance ETHUSDT · 23 May 2026 (ETH)',
    actionLabel: 'Add margin',
    actionHref: '#',
    timestamp: '3d',
    isRead: true,
    category: 'personal',
  },
];

const TABS: { key: NotificationTab; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'personal', label: 'Personal' },
  { key: 'market', label: 'Market' },
];

export default function NotificationPanel() {
  const [activeTab, setActiveTab] = useState<NotificationTab>('all');
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);

  const filtered = notifications.filter((n) => {
    if (activeTab === 'all') return true;
    return n.category === activeTab;
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  function markAsRead(id: string) {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  }

  function markAsUnread(id: string) {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: false } : n))
    );
  }

  function markAllAsRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  }

  return (
    <div
      style={{
        width: '320px',
        backgroundColor: 'var(--boros-background-primary)',
        border: '1px solid var(--boros-border-primary)',
        borderRadius: 'var(--boros-radius-rounded-lg)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '15px 15px 0',
        }}
      >
        <span
          style={{
            fontSize: 'var(--boros-primitive-text-size-base-small-heading)',
            fontWeight: 600,
            color: 'var(--boros-text-primary)',
          }}
        >
          Notifications
        </span>
        <GearIcon />
      </div>

      {/* Tabs row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 15px 0',
          borderBottom: '1px solid var(--boros-border-surface)',
        }}
      >
        <div style={{ display: 'flex', gap: '0' }}>
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '0 12px 8px',
                fontSize: 'var(--boros-primitive-text-size-xs-caption)',
                fontWeight: activeTab === tab.key ? 500 : 400,
                color:
                  activeTab === tab.key
                    ? 'var(--boros-text-primary)'
                    : 'var(--boros-text-inactive)',
                borderBottom: activeTab === tab.key
                  ? '2px solid var(--boros-tab-navigation-tab-active)'
                  : '2px solid transparent',
                marginBottom: '-1px',
                transition: 'color 0.15s',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: 'var(--boros-primitive-text-size-xs-caption)',
              color: 'var(--boros-text-secondary)',
              padding: '0 0 8px',
              whiteSpace: 'nowrap',
            }}
          >
            Mark all as read
          </button>
        )}
      </div>

      {/* Notification list */}
      <div
        style={{
          overflowY: 'auto',
          maxHeight: '480px',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {filtered.length === 0 ? (
          <div
            style={{
              padding: '32px 15px',
              textAlign: 'center',
              color: 'var(--boros-text-inactive)',
              fontSize: 'var(--boros-primitive-text-size-xs-caption)',
            }}
          >
            No notifications
          </div>
        ) : (
          filtered.map((notification, index) => (
            <div key={notification.id}>
              <NotificationItem
                notification={notification}
                onMarkAsRead={markAsRead}
                onMarkAsUnread={markAsUnread}
              />
              {index < filtered.length - 1 && (
                <div
                  style={{
                    height: '1px',
                    backgroundColor: 'var(--boros-border-surface)',
                    margin: '0 15px',
                  }}
                />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function GearIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ cursor: 'pointer', color: 'var(--boros-icon-secondary)' }}
    >
      <path
        d="M8 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.333 8a5.264 5.264 0 0 1-.053.72l1.56 1.22a.373.373 0 0 1 .087.473l-1.48 2.56a.373.373 0 0 1-.453.16l-1.84-.74a5.36 5.36 0 0 1-1.24.72l-.28 1.953a.36.36 0 0 1-.36.313H6.68a.36.36 0 0 1-.36-.313l-.28-1.953a5.36 5.36 0 0 1-1.24-.72l-1.84.74a.373.373 0 0 1-.453-.16L1.027 10.4a.367.367 0 0 1 .087-.473l1.56-1.22A5.333 5.333 0 0 1 2.62 8c0-.247.02-.487.053-.72L1.113 6.06a.373.373 0 0 1-.087-.473l1.48-2.56a.373.373 0 0 1 .453-.16l1.84.74a5.36 5.36 0 0 1 1.24-.72L6.32 .934A.36.36 0 0 1 6.68.62h2.64a.36.36 0 0 1 .36.314l.28 1.953a5.36 5.36 0 0 1 1.24.72l1.84-.74a.373.373 0 0 1 .453.16l1.48 2.56a.367.367 0 0 1-.087.473l-1.56 1.22c.033.233.053.473.047.72Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
