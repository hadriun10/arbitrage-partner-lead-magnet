import React from 'react';
import { modelMetadata } from './ModelChoiceStep.jsx';
import { UnlockModal } from './UnlockModal.jsx';

function formatEuroCompact(value) {
  if (!value || Number.isNaN(value)) return '—';
  const abs = Math.abs(value);
  let formatted = '';
  if (abs >= 1_000_000_000) {
    formatted = `${(value / 1_000_000_000).toFixed(1)} Md€`;
  } else if (abs >= 1_000_000) {
    formatted = `${(value / 1_000_000).toFixed(1)} M€`;
  } else if (abs >= 1_000) {
    formatted = `${(value / 1_000).toFixed(1)} k€`;
  } else {
    formatted = `${Math.round(value).toLocaleString('fr-FR')} €`;
  }
  return formatted.replace('.0', '');
}

export function ResultsView({
  modelKey,
  estimation,
  blurred,
  unlockOpen,
  onOpenUnlock,
  onCloseUnlock,
  onSubmitUnlock,
  parameters,
  contactData
}) {
  const model = modelMetadata[modelKey];
  const isBlurred = blurred;

  return (
    <>
      <div className="card">
        <div className="results-hero-header">
          <h1 className="results-hero-title">Votre estimation</h1>
          <p className="results-hero-subtitle">
            Estimation indicative basée sur vos réponses
          </p>
        </div>

        <div className="results-hero-card">
          <div className="results-hero-label">Impact financier potentiel activable</div>
          <div className="results-hero-main">
            <div className="results-hero-amount">
              {formatEuroCompact(estimation.additionalRevenue)}
            </div>
            <div className="results-hero-separator">par an</div>
          </div>
          <div className="results-hero-secondary">
            Gain de valorisation estimé&nbsp;:&nbsp;
            <span className="results-hero-secondary-value">
              {formatEuroCompact(estimation.valuationGain)}
            </span>
          </div>
          <div className="results-tags">
            <span className="results-tag">Revenus additionnels</span>
            <span className="results-tag">Valorisation</span>
            {model && <span className="results-tag">{model.title}</span>}
          </div>
        </div>

        <section className="results-methodology-section">
          <h2 className="section-title">Méthodologie de valorisation</h2>
          <div
            className={
              isBlurred
                ? 'results-methodology-card results-blurred'
                : 'results-methodology-card'
            }
          >
            <div className="results-methodology-row">
              <div className="results-methodology-label">Axe revenus</div>
              <div className="results-methodology-value">
                Revenu additionnel annuel estimé de{' '}
                <strong>{formatEuroCompact(estimation.additionalRevenue)}</strong>
              </div>
            </div>
            <div className="results-methodology-row">
              <div className="results-methodology-label">Axe valorisation</div>
              <div className="results-methodology-value">
                Projection de gain de valorisation de{' '}
                <strong>{formatEuroCompact(estimation.valuationGain)}</strong> sur la base de
                multiples de marché prudents.
              </div>
            </div>
            <div className="results-methodology-row">
              <div className="results-methodology-label">Hypothèses clés</div>
              <div className="results-methodology-value">
                <ul className="results-levers">
                  {estimation.levers.map((lever) => (
                    <li key={lever}>{lever}</li>
                  ))}
                </ul>
              </div>
            </div>
            <p className="results-methodology-footnote">
              Lecture simplifiée. Les calculs détaillés pourront être repris et adaptés dans le
              cadre d’un échange dédié. Les hypothèses restent prudentes et cohérentes avec les
              pratiques de marché.
            </p>
            <div className="results-cta-over">
              <div className="results-cta-card">
                <div className="results-cta-title">
                  Discutez de cette estimation avec un conseiller Arbitrage Partners
                </div>
                <div className="results-cta-subtitle">
                  Affinez les hypothèses, comprenez la méthodologie détaillée et identifiez les
                  leviers concrets de création de valeur pour votre entreprise.
                </div>
                <button type="button" className="results-cta-button" onClick={onOpenUnlock}>
                  <span>Prendre rendez-vous pour accéder au détail complet</span>
                  <span>→</span>
                </button>
                <div className="results-cta-footnote">
                  Aucun engagement • 30 minutes d’échange • Lecture financière personnalisée
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {unlockOpen && <UnlockModal onClose={onCloseUnlock} onSubmit={onSubmitUnlock} />}
    </>
  );
}


