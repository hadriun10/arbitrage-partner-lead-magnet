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
  isBlurred,
  unlockOpen,
  onOpenUnlock,
  onCloseUnlock,
  onSubmitUnlock,
  parameters,
  onEditParameters
}) {
  const model = modelMetadata[modelKey];
  // isBlurred gère à la fois le flou ET la visibilité du CTA
  // true = flouté + CTA visible, false = déflouté + CTA caché

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
          <div className="results-hero-grid">
            <div className="results-hero-item">
              <div className="results-hero-item-label">Chiffre d'affaires annuel débloquable</div>
              <div
                className={
                  isBlurred
                    ? 'results-hero-item-amount results-blurred'
                    : 'results-hero-item-amount'
                }
              >
                {formatEuroCompact(estimation.additionalRevenue)}
              </div>
            </div>
            <div className="results-hero-item">
              <div className="results-hero-item-label">Gain de valorisation estimé</div>
              <div
                className={
                  isBlurred
                    ? 'results-hero-item-amount results-blurred'
                    : 'results-hero-item-amount'
                }
              >
                {formatEuroCompact(estimation.valuationGain)}
              </div>
            </div>
          </div>
        </div>

        <section className="results-methodology-section">
          <h2 className="section-title">Méthodologie de valorisation</h2>
          <div
            className={
              isBlurred
                ? 'results-methodology-card results-methodology-card-with-cta'
                : 'results-methodology-card'
            }
          >
            <div
              className={
                isBlurred ? 'results-methodology-content results-blurred' : 'results-methodology-content'
              }
            >
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
              {parameters && estimation.details && (
                <div className="results-methodology-row">
                  <div className="results-methodology-label">Détail du calcul</div>
                  <div className="results-methodology-value">
                    <div className="results-calculation-detail">
                      {modelKey === 'recurring' && (
                        <>
                          <p className="results-calculation-formula">
                            <strong>Clients additionnels par an</strong> = Introductions qualifiées par mois × Taux de transformation × 1,5 × 12 mois
                            <br />
                            <span className="results-formula-calculation">
                              = {parameters.introsPerQuarter || 4} × {parameters.convIntroToClient || 20}% × 1,5 × 12
                              <br />
                              = {Math.round(estimation.details.additionalClientsPerYear)} clients
                            </span>
                          </p>
                          <p className="results-calculation-formula">
                            <strong>Revenu additionnel</strong> = CA par client × Marge incrémentale × Clients additionnels
                            <br />
                            <span className="results-formula-calculation">
                              = {formatEuroCompact(parameters.annualRevenuePerClient)} × {Math.round(estimation.details.incrementalMarginPct)}% × {Math.round(estimation.details.additionalClientsPerYear)}
                              <br />
                              = {formatEuroCompact(estimation.additionalRevenue)}
                            </span>
                          </p>
                          <p className="results-calculation-formula">
                            <strong>Gain de valorisation</strong> = ARR incrémental × Multiple d'ARR
                            <br />
                            <span className="results-formula-calculation">
                              = {formatEuroCompact(
                                parameters.annualRevenuePerClient *
                                  estimation.details.additionalClientsPerYear
                              )} × {estimation.details.arrMultiple}
                              <br />
                              = {formatEuroCompact(estimation.valuationGain)}
                            </span>
                          </p>
                        </>
                      )}

                      {modelKey === 'projects' && (
                        <>
                          <p className="results-calculation-formula">
                            <strong>Contrats additionnels par an</strong> = Opportunités qualifiées par mois × Taux de conversion × 1,5 × 12 mois
                            <br />
                            <span className="results-formula-calculation">
                              = {parameters.qualifiedOppPerQuarter || 4} × {parameters.convOppToClient || 20}% × 1,5 × 12
                              <br />
                              = {Math.round(estimation.details.additionalContractsPerYear)} contrats
                            </span>
                          </p>
                          <p className="results-calculation-formula">
                            <strong>Revenu additionnel</strong> = Valeur moyenne contrat × Marge opérationnelle × Contrats additionnels
                            <br />
                            <span className="results-formula-calculation">
                              = {formatEuroCompact(parameters.avgContractValue)} × {Math.round(estimation.details.marginPct)}% × {Math.round(estimation.details.additionalContractsPerYear)}
                              <br />
                              = {formatEuroCompact(estimation.additionalRevenue)}
                            </span>
                          </p>
                          <p className="results-calculation-formula">
                            <strong>Gain de valorisation</strong> = EBITDA incrémental × Multiple d'EBITDA
                            <br />
                            <span className="results-formula-calculation">
                              = {formatEuroCompact(estimation.additionalRevenue)} × {estimation.details.ebitdaMultiple}
                              <br />
                              = {formatEuroCompact(estimation.valuationGain)}
                            </span>
                          </p>
                        </>
                      )}

                      {modelKey === 'transactions' && (
                        <>
                          <p className="results-calculation-formula">
                            <strong>Mandats additionnels par an</strong> = Introductions qualifiées par mois × Taux de conversion × 1,5 × 12 mois
                            <br />
                            <span className="results-formula-calculation">
                              = {parameters.introsPerQuarter || 4} × {parameters.convIntroToMandate || 20}% × 1,5 × 12
                              <br />
                              = {Math.round(estimation.details.additionalMandatesPerYear)} mandats
                            </span>
                          </p>
                          <p className="results-calculation-formula">
                            <strong>Success fee par mandat</strong> = Valeur transaction × Taux success fee × Probabilité de closing
                            <br />
                            <span className="results-formula-calculation">
                              = {formatEuroCompact(parameters.avgTransactionValue || 0)} × {parameters.successFee || 3}% × {parameters.closingProbability || 60}%
                              <br />
                              = {formatEuroCompact((parameters.avgTransactionValue || 0) * (parameters.successFee || 3) / 100 * (parameters.closingProbability || 60) / 100)} par mandat
                            </span>
                          </p>
                          <p className="results-calculation-formula">
                            <strong>Revenu par mandat (annualisé)</strong> = (Success fee + Work fees) × (12 / Durée mandat en mois)
                            <br />
                            <span className="results-formula-calculation">
                              = ({formatEuroCompact((parameters.avgTransactionValue || 0) * (parameters.successFee || 3) / 100 * (parameters.closingProbability || 60) / 100)} + {formatEuroCompact(parameters.workFees || 0)}) × (12 / {parameters.mandateDurationMonths || 9})
                              <br />
                              = {formatEuroCompact(estimation.details.annualisedRevenuePerMandate)} par mandat/an
                            </span>
                          </p>
                          <p className="results-calculation-formula">
                            <strong>EBITDA par mandat</strong> = Revenu annualisé × Marge nette
                            <br />
                            <span className="results-formula-calculation">
                              = {formatEuroCompact(estimation.details.annualisedRevenuePerMandate)} × {Math.round(estimation.details.netMarginPct)}%
                              <br />
                              = {formatEuroCompact(estimation.details.annualisedRevenuePerMandate * (estimation.details.netMarginPct / 100))} par mandat
                            </span>
                          </p>
                          <p className="results-calculation-formula">
                            <strong>Revenu additionnel</strong> = EBITDA par mandat × Mandats additionnels
                            <br />
                            <span className="results-formula-calculation">
                              = {formatEuroCompact(estimation.details.annualisedRevenuePerMandate * (estimation.details.netMarginPct / 100))} × {Math.round(estimation.details.additionalMandatesPerYear)}
                              <br />
                              = {formatEuroCompact(estimation.additionalRevenue)}
                            </span>
                          </p>
                          <p className="results-calculation-formula">
                            <strong>Gain de valorisation</strong> = EBITDA incrémental × Multiple d'EBITDA
                            <br />
                            <span className="results-formula-calculation">
                              = {formatEuroCompact(estimation.additionalRevenue)} × {estimation.details.ebitdaMultiple}
                              <br />
                              = {formatEuroCompact(estimation.valuationGain)}
                            </span>
                          </p>
                        </>
                      )}

                      {modelKey === 'financing' && (
                        <>
                          <p className="results-calculation-formula">
                            <strong>Financements additionnels par an</strong> = Introductions qualifiées par mois × Taux de conversion × 1,5 × 12 mois
                            <br />
                            <span className="results-formula-calculation">
                              = {parameters.introsPerQuarter || 4} × {parameters.convIntroToFinancing || 20}% × 1,5 × 12
                              <br />
                              = {Math.round(estimation.details.additionalDealsPerYear)} financements
                            </span>
                          </p>
                          <p className="results-calculation-formula">
                            <strong>Revenu par financement (annuel)</strong> = (Spread lifetime + Fees lifetime) / Durée en années
                            <br />
                            <span className="results-formula-calculation">
                              = ({formatEuroCompact((parameters.avgFinancedAmount || 0) * (parameters.annualSpread || 3) / 100 * (parameters.financingDurationYears || 4))} + {formatEuroCompact((parameters.arrangementFees || 0) + (parameters.structuringFees || 0) + (parameters.servicingFeesAnnual || 0) * (parameters.financingDurationYears || 4))}) / {parameters.financingDurationYears || 4}
                              <br />
                              = {formatEuroCompact(estimation.details.annualRevenuePerDeal)} par financement/an
                            </span>
                          </p>
                          <p className="results-calculation-formula">
                            <strong>EBITDA par financement</strong> = Revenu annuel × Marge nette
                            <br />
                            <span className="results-formula-calculation">
                              = {formatEuroCompact(estimation.details.annualRevenuePerDeal)} × {Math.round(estimation.details.netMarginPct)}%
                              <br />
                              = {formatEuroCompact(estimation.details.annualRevenuePerDeal * (estimation.details.netMarginPct / 100))} par financement
                            </span>
                          </p>
                          <p className="results-calculation-formula">
                            <strong>Revenu additionnel</strong> = EBITDA par financement × Financements additionnels
                            <br />
                            <span className="results-formula-calculation">
                              = {formatEuroCompact(estimation.details.annualRevenuePerDeal * (estimation.details.netMarginPct / 100))} × {Math.round(estimation.details.additionalDealsPerYear)}
                              <br />
                              = {formatEuroCompact(estimation.additionalRevenue)}
                            </span>
                          </p>
                          <p className="results-calculation-formula">
                            <strong>Gain de valorisation</strong> = EBITDA incrémental × Multiple d'EBITDA
                            <br />
                            <span className="results-formula-calculation">
                              = {formatEuroCompact(estimation.additionalRevenue)} × {estimation.details.ebitdaMultiple}
                              <br />
                              = {formatEuroCompact(estimation.valuationGain)}
                            </span>
                          </p>
                        </>
                      )}

                      {modelKey === 'asset_management' && (
                        <>
                          <p className="results-calculation-formula">
                            <strong>Relations additionnelles par an</strong> = Introductions qualifiées par mois × Taux de conversion × 1,5 × 12 mois
                            <br />
                            <span className="results-formula-calculation">
                              = {parameters.introsPerQuarter || 4} × {parameters.convIntroToRelationship || 20}% × 1,5 × 12
                              <br />
                              = {Math.round(estimation.details.additionalRelationsPerYear)} relations
                            </span>
                          </p>
                          <p className="results-calculation-formula">
                            <strong>Revenu par relation (annuel)</strong> = AUM initial × (Management fee + Performance fee + Commissions)
                            <br />
                            <span className="results-formula-calculation">
                              = {formatEuroCompact(parameters.initialAum)} × ({((parameters.mgmtFeeAnnual || 0.8) * 100).toFixed(1)}% + {((parameters.perfFee || 0) * 100).toFixed(1)}% + {((parameters.additionalCommissions || 0) * 100).toFixed(1)}%)
                              <br />
                              = {formatEuroCompact(estimation.details.annualRevenuePerRelation)} par relation/an
                            </span>
                          </p>
                          <p className="results-calculation-formula">
                            <strong>EBITDA par relation</strong> = Revenu annuel × Marge nette
                            <br />
                            <span className="results-formula-calculation">
                              = {formatEuroCompact(estimation.details.annualRevenuePerRelation)} × {Math.round(estimation.details.netMarginPct)}%
                              <br />
                              = {formatEuroCompact(estimation.details.annualRevenuePerRelation * (estimation.details.netMarginPct / 100))} par relation
                            </span>
                          </p>
                          <p className="results-calculation-formula">
                            <strong>Revenu additionnel</strong> = EBITDA par relation × Relations additionnelles
                            <br />
                            <span className="results-formula-calculation">
                              = {formatEuroCompact(estimation.details.annualRevenuePerRelation * (estimation.details.netMarginPct / 100))} × {Math.round(estimation.details.additionalRelationsPerYear)}
                              <br />
                              = {formatEuroCompact(estimation.additionalRevenue)}
                            </span>
                          </p>
                          <p className="results-calculation-formula">
                            <strong>Gain de valorisation</strong> = Management fees annualisées × Multiple des management fees
                            <br />
                            <span className="results-formula-calculation">
                              = {formatEuroCompact((parameters.initialAum || 0) * (parameters.mgmtFeeAnnual || 0.8) / 100 * estimation.details.additionalRelationsPerYear)} × {estimation.details.mgmtFeesMultiple}
                              <br />
                              = {formatEuroCompact(estimation.valuationGain)}
                            </span>
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}
              <p className="results-methodology-footnote">
                Lecture simplifiée. Les calculs détaillés pourront être repris et adaptés dans le
                cadre d'un échange dédié. Les hypothèses restent prudentes et cohérentes avec les
                pratiques de marché.
              </p>
            </div>
            {isBlurred && (
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
                    Aucun engagement • 30 minutes d'échange • Lecture financière personnalisée
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        <section className="results-methodology-section">
          <h2 className="section-title">Ressources offertes</h2>
          <div className="results-methodology-card results-resources-card">
            <div
              className={
                isBlurred
                  ? 'results-resources-content results-blurred'
                  : 'results-resources-content'
              }
            >
              <div className="results-methodology-row">
                <div className="results-methodology-label">Ressource 1</div>
                <div className="results-methodology-value">
                  Description de la première ressource offerte
                </div>
                <div className="results-methodology-action">
                  <button type="button" className="results-download-button">Télécharger</button>
                </div>
              </div>
              <div className="results-methodology-row">
                <div className="results-methodology-label">Ressource 2</div>
                <div className="results-methodology-value">
                  Description de la deuxième ressource offerte
                </div>
                <div className="results-methodology-action">
                  <button type="button" className="results-download-button">Télécharger</button>
                </div>
              </div>
              <div className="results-methodology-row">
                <div className="results-methodology-label">Ressource 3</div>
                <div className="results-methodology-value">
                  Description de la troisième ressource offerte
                </div>
                <div className="results-methodology-action">
                  <button type="button" className="results-download-button">Télécharger</button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {onEditParameters && (
          <div style={{ marginTop: 24, fontSize: 12 }}>
            <button
              type="button"
              onClick={onEditParameters}
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                color: 'rgba(255, 255, 255, 0.6)',
                textDecoration: 'underline',
                fontSize: '12px',
                fontFamily: 'inherit'
              }}
            >
              Modifier mes informations
            </button>
          </div>
        )}
      </div>

      {unlockOpen && <UnlockModal onClose={onCloseUnlock} onSubmit={onSubmitUnlock} />}
    </>
  );
}


