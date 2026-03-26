'use client';

interface CheckboxProps {
  checked: boolean;
  onChange?: () => void;
  muted?: boolean;
  /** aria-label for accessibility */
  label?: string;
}

/**
 * Boros Design System Checkbox (CB/On · CB/Off)
 * Size: 14×14px — matches node 4251:6230 in Boros-Design-System
 *
 * CB/On  — blue fill (#6079ff) + white checkmark, 2px radius
 * CB/Off — surface-raised bg + border/primary border, 2px radius
 *
 * `muted` renders CB/On in secondary grey instead of info-blue,
 *  used for the hover-to-confirm-read state in notification rows.
 */
export default function Checkbox({ checked, onChange, muted = false, label }: CheckboxProps) {
  const checkedBg = muted
    ? 'var(--boros-background-surface-raised)'
    : 'var(--boros-background-info-solid)';

  const checkedBorder = muted
    ? '1px solid var(--boros-border-secondary)'
    : '1px solid var(--boros-background-info-solid)';

  const checkColor = muted ? 'var(--boros-icon-secondary)' : '#ffffff';

  return (
    <div
      role="checkbox"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
      style={{
        width: '14px',
        height: '14px',
        borderRadius: 'var(--boros-radius-rounded-sm)',
        flexShrink: 0,
        cursor: onChange ? 'pointer' : 'default',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: checked
          ? checkedBg
          : 'var(--boros-background-surface-raised)',
        border: checked
          ? checkedBorder
          : '1px solid var(--boros-border-primary)',
        transition: 'background-color 0.15s, border-color 0.15s',
        boxSizing: 'border-box',
      }}
    >
      {checked && (
        <svg
          width="9"
          height="7"
          viewBox="0 0 9 7"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1 3.5L3.5 6L8 1"
            stroke={checkColor}
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </div>
  );
}
