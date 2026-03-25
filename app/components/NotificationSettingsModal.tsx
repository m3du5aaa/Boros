'use client';

import { useState } from 'react';
import styles from './NotificationSettingsModal.module.css';

interface Props {
  onClose: () => void;
}

type MatrixRow = { inApp: boolean; push: boolean; telegram: boolean };

const INITIAL_MATRIX: Record<string, MatrixRow> = {
  liquidation:         { inApp: true, push: true,  telegram: true  },
  positionUpdates:     { inApp: true, push: true,  telegram: true  },
  orders:              { inApp: true, push: true,  telegram: true  },
  settlements:         { inApp: true, push: true,  telegram: false },
  depositsWithdrawals: { inApp: true, push: true,  telegram: false },
  otc:                 { inApp: true, push: true,  telegram: false },
  marketUpdates:       { inApp: true, push: false, telegram: false },
  customPriceAlerts:   { inApp: true, push: true,  telegram: true  },
};

const MATRIX_ROWS: { key: string; label: string }[] = [
  { key: 'liquidation',         label: 'Liquidation & margin calls' },
  { key: 'positionUpdates',     label: 'Position updates' },
  { key: 'orders',              label: 'Orders' },
  { key: 'settlements',         label: 'Settlements' },
  { key: 'depositsWithdrawals', label: 'Deposits & withdrawals' },
  { key: 'otc',                 label: 'OTC' },
  { key: 'marketUpdates',       label: 'Market updates' },
  { key: 'customPriceAlerts',   label: 'Custom price alerts' },
];

type CustomAlert = { id: string; pair: string; condition: string; threshold: string };

const INITIAL_CUSTOM_ALERTS: CustomAlert[] = [
  { id: '1', pair: 'BTCUSDT', condition: 'Underlying APR Target',    threshold: '10' },
  { id: '2', pair: 'ETHUSDC', condition: 'Market Spread Moves By %', threshold: '5'  },
];

const MARKETS = [
  { id: 'BTCUSDT',  name: 'BTCUSDT',  maturity: '27 Mar 2026' },
  { id: 'ETHUSDC',  name: 'ETHUSDC',  maturity: '27 Mar 2026' },
  { id: 'SOLUSDC',  name: 'SOLUSDC',  maturity: '27 Mar 2026' },
  { id: 'BNBUSDT',  name: 'BNBUSDT',  maturity: '27 Jun 2026' },
  { id: 'AVAXUSDC', name: 'AVAXUSDC', maturity: '27 Sep 2026' },
  { id: 'LINKUSDC', name: 'LINKUSDC', maturity: '27 Mar 2026' },
];

const ALERT_TYPES = [
  { id: 'Implied APR Target',       label: 'Implied APR Target',       description: 'Alert when implied APR reaches a target value' },
  { id: 'Underlying APR Target',    label: 'Underlying APR Target',    description: 'Alert when underlying APR reaches a target value' },
  { id: 'Market Spread Target',     label: 'Market Spread Target',     description: 'Alert when market spread reaches a target value' },
  { id: 'Implied APR Moves By %',   label: 'Implied APR Moves By %',   description: 'Alert when implied APR moves by a set percentage in 1 hour' },
  { id: 'Underlying APR Moves By %', label: 'Underlying APR Moves By %', description: 'Alert when underlying APR moves by a set percentage in 1 hour' },
  { id: 'Market Spread Moves By %', label: 'Market Spread Moves By %', description: 'Alert when market spread changes by a set percentage in 1 hour' },
];

const STEP_TITLES: Record<number, string> = {
  1: 'Select market',
  2: 'Configure alert',
  3: 'Confirm alert',
};

type WizardState = {
  step: 1 | 2 | 3;
  market: string;
  alertType: string;
  direction: 'Above' | 'Below';
  threshold: string;
  delivery: { inApp: boolean; push: boolean; telegram: boolean };
};

export default function NotificationSettingsModal({ onClose }: Props) {
  const [matrix, setMatrix] = useState(INITIAL_MATRIX);
  const [alerts, setAlerts] = useState(INITIAL_CUSTOM_ALERTS);
  const [expanded, setExpanded] = useState<{ id: string; mode: 'edit' | 'delete' } | null>(null);
  const [editValue, setEditValue] = useState('');
  const [wizard, setWizard] = useState<WizardState | null>(null);
  const [marketSearch, setMarketSearch] = useState('');

  function toggleMatrix(row: string, col: keyof MatrixRow) {
    setMatrix((prev) => ({
      ...prev,
      [row]: { ...prev[row], [col]: !prev[row][col] },
    }));
  }

  function openEdit(alert: CustomAlert) {
    setEditValue(alert.threshold);
    setExpanded({ id: alert.id, mode: 'edit' });
  }

  function openDelete(id: string) {
    setExpanded({ id, mode: 'delete' });
  }

  function collapse() {
    setExpanded(null);
  }

  function saveEdit(id: string) {
    setAlerts((prev) => prev.map((a) => a.id === id ? { ...a, threshold: editValue } : a));
    setExpanded(null);
  }

  function removeAlert(id: string) {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
    setExpanded(null);
  }

  function startWizard() {
    setMarketSearch('');
    setWizard({ step: 1, market: '', alertType: '', direction: 'Above', threshold: '', delivery: { inApp: true, push: true, telegram: true } });
  }

  function goBack() {
    if (!wizard) return;
    if (wizard.step === 1) { setWizard(null); return; }
    setWizard({ ...wizard, step: (wizard.step - 1) as 1 | 2 | 3 });
  }

  function selectMarket(marketId: string) {
    setWizard((w) => w ? { ...w, step: 2, market: marketId, alertType: '', threshold: '' } : w);
  }

  function selectAlertType(typeId: string) {
    setWizard((w) => w ? { ...w, alertType: typeId, threshold: '' } : w);
  }

  function goToStep3() {
    setWizard((w) => w ? { ...w, step: 3 } : w);
  }

  function createAlert() {
    if (!wizard) return;
    setAlerts((prev) => [...prev, {
      id: Date.now().toString(),
      pair: wizard.market,
      condition: wizard.alertType,
      threshold: wizard.threshold,
    }]);
    setWizard(null);
  }

  const filteredMarkets = MARKETS.filter((m) =>
    m.name.toLowerCase().includes(marketSearch.toLowerCase())
  );

  return (
    <>
      <div className={styles.overlay} onClick={onClose} aria-hidden="true" />

      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-label={wizard ? STEP_TITLES[wizard.step] : 'Notification settings'}
      >
        {/* Header */}
        {wizard ? (
          <div className={styles.header}>
            <button className={styles.backBtn} onClick={goBack} aria-label="Back">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <div className={styles.wizardHeaderCenter}>
              <h2 className={styles.title}>{STEP_TITLES[wizard.step]}</h2>
              <span className={styles.stepLabel}>Step {wizard.step} of 3</span>
            </div>
            <button className={styles.closeButton} onClick={onClose} aria-label="Close">×</button>
          </div>
        ) : (
          <div className={styles.header}>
            <h2 className={styles.title}>Notification settings</h2>
            <button className={styles.closeButton} onClick={onClose} aria-label="Close">×</button>
          </div>
        )}

        {/* Wizard body */}
        {wizard ? (
          <div className={styles.wizardBody}>

            {/* Step 1 — Select market */}
            {wizard.step === 1 && (
              <>
                <div className={styles.wizardSearchWrap}>
                  <input
                    className={styles.wizardSearch}
                    type="text"
                    placeholder="Search markets..."
                    value={marketSearch}
                    onChange={(e) => setMarketSearch(e.target.value)}
                    autoFocus
                  />
                </div>
                <div className={styles.marketList}>
                  {filteredMarkets.map((m) => (
                    <button
                      key={m.id}
                      className={styles.marketRow}
                      type="button"
                      onClick={() => selectMarket(m.id)}
                    >
                      <span className={styles.marketIcon} aria-hidden="true" />
                      <span className={styles.marketInfo}>
                        <span className={styles.marketName}>{m.name}</span>
                        <span className={styles.marketMaturity}>{m.maturity}</span>
                      </span>
                    </button>
                  ))}
                  {filteredMarkets.length === 0 && (
                    <p className={styles.marketEmpty}>No markets match "{marketSearch}"</p>
                  )}
                </div>
              </>
            )}

            {/* Step 2 — Configure alert */}
            {wizard.step === 2 && (
              <div className={styles.wizardStep}>
                <div className={styles.wizardMarketPill}>
                  <span className={styles.wizardMarketDot} aria-hidden="true" />
                  {wizard.market}
                </div>
                <div className={styles.alertTypeList}>
                  {ALERT_TYPES.map((t) => (
                    <label
                      key={t.id}
                      className={`${styles.alertTypeRow} ${wizard.alertType === t.id ? styles.alertTypeRowSelected : ''}`}
                    >
                      <input
                        type="radio"
                        name="alertType"
                        className={styles.alertTypeRadio}
                        checked={wizard.alertType === t.id}
                        onChange={() => selectAlertType(t.id)}
                      />
                      <span className={styles.alertTypeContent}>
                        <span className={styles.alertTypeLabel}>{t.label}</span>
                        <span className={styles.alertTypeDesc}>{t.description}</span>
                      </span>
                    </label>
                  ))}
                </div>

                {wizard.alertType && (
                  <div className={styles.alertConfig}>
                    <div className={styles.directionToggle}>
                      {(['Above', 'Below'] as const).map((dir) => (
                        <button
                          key={dir}
                          type="button"
                          className={`${styles.directionBtn} ${wizard.direction === dir ? styles.directionBtnActive : ''}`}
                          onClick={() => setWizard((w) => w ? { ...w, direction: dir } : w)}
                        >
                          {dir}
                        </button>
                      ))}
                    </div>
                    <div className={styles.thresholdRow}>
                      <input
                        type="number"
                        className={styles.thresholdInput}
                        placeholder="e.g. 4.2"
                        value={wizard.threshold}
                        onChange={(e) => setWizard((w) => w ? { ...w, threshold: e.target.value } : w)}
                      />
                      <span className={styles.thresholdUnit}>%</span>
                    </div>
                    <button
                      className={styles.continueBtn}
                      type="button"
                      disabled={!wizard.threshold}
                      onClick={goToStep3}
                    >
                      Continue
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Step 3 — Confirm */}
            {wizard.step === 3 && (
              <div className={styles.wizardStep}>
                <div className={styles.wizardMarketPill}>
                  <span className={styles.wizardMarketDot} aria-hidden="true" />
                  {wizard.market}
                </div>
                <div className={styles.confirmSummary}>
                  {[
                    { label: 'Market',     value: wizard.market },
                    { label: 'Alert type', value: wizard.alertType },
                    { label: 'Direction',  value: wizard.direction },
                    { label: 'Threshold',  value: `${wizard.threshold}%` },
                  ].map(({ label, value }) => (
                    <div key={label} className={styles.confirmRow}>
                      <span className={styles.confirmLabel}>{label}</span>
                      <span className={styles.confirmValue}>{value}</span>
                    </div>
                  ))}
                </div>
                <button className={styles.createAlertBtn} type="button" onClick={createAlert}>
                  Create alert
                </button>
              </div>
            )}

          </div>
        ) : (

          /* Main settings body */
          <div className={styles.body}>

            {/* Section 1 — Telegram */}
            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>Telegram</h3>
              <div className={styles.telegramRow}>
                <span className={styles.greenDot} aria-hidden="true" />
                <div className={styles.telegramInfo}>
                  <span className={styles.telegramHandle}>@junieloodesign</span>
                  <span className={styles.telegramSub}>Connected via @PendleAlertBot</span>
                </div>
                <button className={styles.unlinkButton} type="button">
                  Unlink
                </button>
              </div>
            </section>

            {/* Section 2 — Alert delivery matrix */}
            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>Alert delivery</h3>
              <div className={styles.matrixWrapper}>
                <table className={styles.matrix}>
                  <thead>
                    <tr>
                      <th className={styles.matrixLabelCol} />
                      <th className={styles.matrixColHead}>In-app</th>
                      <th className={styles.matrixColHead}>Push</th>
                      <th className={styles.matrixColHead}>Telegram</th>
                    </tr>
                  </thead>
                  <tbody>
                    {MATRIX_ROWS.map(({ key, label }) => (
                      <tr key={key} className={styles.matrixRow}>
                        <td className={styles.matrixLabel}>{label}</td>
                        {(['inApp', 'push', 'telegram'] as const).map((col) => (
                          <td key={col} className={styles.matrixCell}>
                            <input
                              type="checkbox"
                              className={styles.checkbox}
                              checked={matrix[key][col]}
                              onChange={() => toggleMatrix(key, col)}
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Section 3 — Custom price alerts */}
            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>Custom price alerts</h3>
              <div className={styles.customAlerts}>
                {alerts.map((alert) => {
                  const isExpanded = expanded?.id === alert.id;
                  const mode = isExpanded ? expanded!.mode : null;
                  return (
                    <div key={alert.id} className={styles.customAlertWrapper}>
                      {/* Main row */}
                      <div className={styles.customAlert}>
                        <div className={styles.customAlertMain}>
                          <span className={styles.customAlertPair}>{alert.pair}</span>
                          <span className={styles.alertTypePill}>{alert.condition}</span>
                          <span className={styles.customAlertThreshold}>{alert.threshold}%</span>
                        </div>
                        <div className={styles.alertActions}>
                          <button
                            className={styles.alertIconBtn}
                            type="button"
                            aria-label="Edit alert"
                            onClick={() => isExpanded && mode === 'edit' ? collapse() : openEdit(alert)}
                          >
                            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
                              <path d="M9.5 1.5a1.414 1.414 0 0 1 2 2L4 11H2v-2L9.5 1.5Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </button>
                          <button
                            className={styles.alertIconBtn}
                            type="button"
                            aria-label="Delete alert"
                            onClick={() => isExpanded && mode === 'delete' ? collapse() : openDelete(alert.id)}
                          >
                            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
                              <path d="M2 2l9 9M11 2l-9 9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                            </svg>
                          </button>
                        </div>
                      </div>

                      {/* Inline expand: delete confirm */}
                      {mode === 'delete' && (
                        <div className={styles.alertExpanded}>
                          <span className={styles.alertExpandedText}>Remove this alert?</span>
                          <div className={styles.alertExpandedActions}>
                            <button className={styles.btnCancel} type="button" onClick={collapse}>Cancel</button>
                            <button className={styles.btnRemove} type="button" onClick={() => removeAlert(alert.id)}>Remove</button>
                          </div>
                        </div>
                      )}

                      {/* Inline expand: edit threshold */}
                      {mode === 'edit' && (
                        <div className={styles.alertExpanded}>
                          <div className={styles.alertExpandedInput}>
                            <input
                              type="number"
                              className={styles.thresholdInput}
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              autoFocus
                            />
                            <span className={styles.thresholdUnit}>%</span>
                          </div>
                          <div className={styles.alertExpandedActions}>
                            <button className={styles.btnCancel} type="button" onClick={collapse}>Cancel</button>
                            <button className={styles.btnSave} type="button" onClick={() => saveEdit(alert.id)}>Save</button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              <button className={styles.addAlertButton} type="button" onClick={startWizard}>
                + Add custom alert
              </button>
            </section>

          </div>
        )}
      </div>
    </>
  );
}
