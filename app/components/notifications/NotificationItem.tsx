'use client';

import { useState } from 'react';
import { Notification } from './types';
import Checkbox from './Checkbox';

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onMarkAsUnread: (id: string) => void;
}

export default function NotificationItem({
  notification,
  onMarkAsRead,
  onMarkAsUnread,
}: NotificationItemProps) {
  const [isHovered, setIsHovered] = useState(false);
  // tracks whether the user just clicked to toggle back to unread
  const [justToggledUnread, setJustToggledUnread] = useState(false);

  function handleMouseEnter() {
    setIsHovered(true);
    if (!notification.isRead) {
      onMarkAsRead(notification.id);
    }
  }

  function handleMouseLeave() {
    setIsHovered(false);
    setJustToggledUnread(false);
  }

  function handleCheckboxChange() {
    if (notification.isRead) {
      setJustToggledUnread(true);
      onMarkAsUnread(notification.id);
    }
  }

  // Determine what to show in the indicator slot (right side of title row)
  // Unread + not hovering → red dot
  // Hover (any read state)  → Boros Checkbox CB/On
  //   · muted grey  = just-read (first hover) or hovering a read item
  //   · blue        = user clicked to re-mark as unread
  // Read + not hovering    → nothing
  const showCheckbox = isHovered;
  const checkboxBlue = isHovered && justToggledUnread;

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '2px',
        padding: '10px 15px',
        cursor: 'default',
        backgroundColor: isHovered
          ? 'var(--boros-background-surface-raised)'
          : 'transparent',
      }}
    >
      {/* Title row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
        <span
          style={{
            fontSize: 'var(--boros-primitive-text-size-base-small-heading)',
            fontWeight: 500,
            color: notification.isRead
              ? 'var(--boros-text-secondary)'
              : 'var(--boros-text-primary)',
            lineHeight: 1.4,
            flex: 1,
          }}
        >
          {notification.title}
        </span>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
          <span
            style={{
              fontSize: 'var(--boros-primitive-text-size-xs-caption)',
              color: 'var(--boros-text-inactive)',
              whiteSpace: 'nowrap',
            }}
          >
            {notification.timestamp}
          </span>

          {/* Indicator slot — always 14px wide so layout doesn't shift */}
          <div style={{ width: '14px', height: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            {showCheckbox ? (
              <Checkbox
                checked
                muted={!checkboxBlue}
                onChange={handleCheckboxChange}
                label={notification.isRead ? 'Mark as unread' : 'Marked as read'}
              />
            ) : !notification.isRead ? (
              <UnreadDot />
            ) : null}
          </div>
        </div>
      </div>

      {/* Subtitle */}
      {notification.subtitle && (
        <span
          style={{
            fontSize: 'var(--boros-primitive-text-size-xs-caption)',
            color: 'var(--boros-text-secondary)',
            lineHeight: 1.4,
          }}
        >
          {notification.subtitle}
        </span>
      )}

      {/* Action link */}
      {notification.actionLabel && notification.actionHref && (
        <a
          href={notification.actionHref}
          style={{
            fontSize: 'var(--boros-primitive-text-size-xs-caption)',
            color: 'var(--boros-text-info)',
            textDecoration: 'none',
            display: 'inline-block',
            marginTop: '2px',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.textDecoration = 'underline';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.textDecoration = 'none';
          }}
        >
          {notification.actionLabel} →
        </a>
      )}
    </div>
  );
}

function UnreadDot() {
  return (
    <div
      style={{
        width: '7px',
        height: '7px',
        borderRadius: '50%',
        backgroundColor: 'var(--boros-background-negative-or-short-solid)',
        flexShrink: 0,
      }}
    />
  );
}
