import { NotificationBell } from './components/notifications';
import { NotificationPanel } from './components/notifications';

export default function Home() {
  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--boros-background-primary)',
        fontFamily: 'var(--font-geist-sans), Arial, sans-serif',
      }}
    >
      {/* Demo navbar */}
      <nav
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 20px',
          borderBottom: '1px solid var(--boros-border-primary)',
          backgroundColor: 'var(--boros-background-primary)',
        }}
      >
        <span
          style={{
            fontSize: 'var(--boros-primitive-text-size-base-small-heading)',
            fontWeight: 600,
            color: 'var(--boros-text-primary)',
          }}
        >
          Boros
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <NotificationBell />
        </div>
      </nav>

      {/* Demo panels */}
      <main
        style={{
          padding: '40px 32px',
          display: 'flex',
          flexDirection: 'column',
          gap: '48px',
        }}
      >
        <section>
          <h2
            style={{
              fontSize: 'var(--boros-primitive-text-size-xs-caption)',
              fontWeight: 500,
              color: 'var(--boros-text-secondary)',
              marginBottom: '16px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            Notification Panel — click the bell in the nav to toggle, or view inline below
          </h2>
          <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
            <NotificationPanel />
          </div>
        </section>
      </main>
    </div>
  );
}
