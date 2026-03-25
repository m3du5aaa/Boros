'use client';

import { useState } from 'react';
import styles from './NotificationBell.module.css';
import NotificationSettingsModal from './NotificationSettingsModal';

type Tab = 'all' | 'personal' | 'market';
type NotifTab = 'personal' | 'market';

interface Notification {
  id: string;
  title: string;
  body: string;
  timestamp: string;
  read: boolean;
  tab: NotifTab;
  cta?: string;
}

const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    title: 'Position settled',
    body: 'OKX XRPUSDC (12 Mar 2026) (ETH) · Paid 0.74% · Recv -1.91% · Net -0.00781121 (S$16.63)',
    timestamp: '5m',
    read: false,
    tab: 'personal',
  },
  {
    id: '2',
    title: 'Health factor low',
    body: 'OKX XRPUSDC (12 Mar 2026) (ETH) · Health factor at 1.12 — add margin to avoid liquidation',
    timestamp: '20m',
    read: false,
    tab: 'personal',
    cta: 'Add margin',
  },
  {
    id: '3',
    title: 'Order filled',
    body: 'OKX XRPUSDC (12 Mar 2026) (ETH) · Long @ 2.45% implied APR',
    timestamp: '1h',
    read: false,
    tab: 'personal',
  },
  {
    id: '4',
    title: 'Deposit confirmed',
    body: 'OKX XRPUSDC (12 Mar 2026) (ETH) · 500 USDC',
    timestamp: '2h',
    read: false,
    tab: 'personal',
  },
  {
    id: '5',
    title: 'Withdrawal failed',
    body: 'OKX XRPUSDC (12 Mar 2026) (ETH) · Insufficient margin',
    timestamp: '3h',
    read: false,
    tab: 'personal',
    cta: 'Review position',
  },
  {
    id: '6',
    title: 'Market close-only',
    body: 'OKX XRPUSDC (12 Mar 2026) (ETH) · New positions paused',
    timestamp: '1d',
    read: false,
    tab: 'market',
  },
  {
    id: '7',
    title: 'New market live',
    body: 'Binance BTCUSDC (30 Jun 2026) (ETH)',
    timestamp: '2d',
    read: false,
    tab: 'market',
    cta: 'View market',
  },
];

const TABS: { id: Tab; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'personal', label: 'Personal' },
  { id: 'market', label: 'Market' },
];

function BellIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M8 1.5A3.5 3.5 0 0 0 4.5 5v1.5C4.5 8 3 9 3 10h10c0-1-1.5-2-1.5-3.5V5A3.5 3.5 0 0 0 8 1.5Z"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
      <path
        d="M6.5 10v.5a1.5 1.5 0 0 0 3 0V10"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
    </svg>
  );
}

function GearIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path
        d="M7 9a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"
        stroke="currentColor"
        strokeWidth="1.25"
      />
      <path
        d="M11.6 8.4a1 1 0 0 0 .2 1.1l.04.04a1.2 1.2 0 0 1-1.7 1.7l-.04-.04a1 1 0 0 0-1.1-.2 1 1 0 0 0-.6.92V12a1.2 1.2 0 0 1-2.4 0v-.05A1 1 0 0 0 5.4 11a1 1 0 0 0-1.1.2l-.04.04a1.2 1.2 0 0 1-1.7-1.7l.04-.04a1 1 0 0 0 .2-1.1 1 1 0 0 0-.92-.6H2a1.2 1.2 0 0 1 0-2.4h.05A1 1 0 0 0 3 5a1 1 0 0 0-.2-1.1l-.04-.04a1.2 1.2 0 0 1 1.7-1.7l.04.04A1 1 0 0 0 5.6 2.4 1 1 0 0 0 6.5 1.5V2a1.2 1.2 0 0 1 1 1.2 1.2 1.2 0 0 1 0-.4v-.3a1.2 1.2 0 0 1 2.4 0v.05A1 1 0 0 0 11 3a1 1 0 0 0 1.1-.2l.04-.04a1.2 1.2 0 0 1 1.7 1.7l-.04.04A1 1 0 0 0 13.6 5.6a1 1 0 0 0 .92.6H14a1.2 1.2 0 0 1 0 2.4h-.05a1 1 0 0 0-.95.6Z"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path
        d="M2 6l3 3 5-5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function UnreadIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.25" />
    </svg>
  );
}

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  const [isOpen, setIsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('all');

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filtered =
    activeTab === 'all' ? notifications : notifications.filter((n) => n.tab === activeTab);

  function toggleRead(id: string) {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n))
    );
  }

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  return (
    <>
      <button
        className={`${styles.bellButton} ${isOpen ? styles.active : ''}`}
        onClick={() => setIsOpen((v) => !v)}
        aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ''}`}
      >
        <BellIcon />
        {unreadCount > 0 && (
          <span className={styles.badge}>{unreadCount > 99 ? '99+' : unreadCount}</span>
        )}
      </button>

      {isOpen && (
        <div className={styles.backdrop} onClick={() => setIsOpen(false)} aria-hidden="true" />
      )}

      <div
        className={`${styles.panel} ${isOpen ? styles.open : ''}`}
        role="dialog"
        aria-label="Notifications"
        aria-modal="true"
      >
        <div className={styles.header}>
          <span className={styles.headerTitle}>Notifications</span>
          <button
            className={styles.iconButton}
            aria-label="Notification settings"
            onClick={() => setIsSettingsOpen(true)}
          >
            <GearIcon />
          </button>
          <button className={styles.markAllRead} onClick={markAllRead}>
            Mark all as read
          </button>
        </div>

        <div className={styles.tabs} role="tablist">
          {TABS.map((t) => (
            <button
              key={t.id}
              role="tab"
              aria-selected={activeTab === t.id}
              className={`${styles.tab} ${activeTab === t.id ? styles.tabActive : ''}`}
              onClick={() => setActiveTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className={styles.list} role="tabpanel">
          {filtered.length === 0 ? (
            <div className={styles.empty}>You&rsquo;re all caught up</div>
          ) : (
            filtered.map((n) => (
              <div
                key={n.id}
                className={`${styles.row} ${n.read ? styles.rowRead : ''}`}
              >
                <div className={styles.dotCol}>
                  <span className={styles.dot} aria-label={n.read ? '' : 'Unread'} />
                </div>

                <div className={styles.content}>
                  <div className={styles.rowTop}>
                    <span className={styles.title}>{n.title}</span>
                    <span className={styles.timestamp}>{n.timestamp}</span>
                  </div>
                  <p className={styles.body}>{n.body}</p>
                  {n.cta && (
                    <button className={styles.cta} type="button">
                      {n.cta}
                    </button>
                  )}
                </div>

                <button
                  className={styles.checkmark}
                  onClick={() => toggleRead(n.id)}
                  title={n.read ? 'Mark as unread' : 'Mark as read'}
                  aria-label={n.read ? 'Mark as unread' : 'Mark as read'}
                  type="button"
                >
                  {n.read ? <UnreadIcon /> : <CheckIcon />}
                </button>
              </div>
            ))
          )}
        </div>
      </div>
      {isSettingsOpen && (
        <NotificationSettingsModal onClose={() => setIsSettingsOpen(false)} />
      )}
    </>
  );
}
