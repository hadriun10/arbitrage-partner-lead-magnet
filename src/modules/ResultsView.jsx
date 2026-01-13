import React from 'react';
import { modelMetadata } from './ModelChoiceStep.jsx';
import { ContactModal } from './ContactModal.jsx';

function formatEuroCompact(value) {
  if (!value || Number.isNaN(value)) return '—';
  const rounded = Math.round(value);
  return `${rounded.toLocaleString('fr-FR')} €`;
}

function capitalizeFirst(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
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

  // Calcul de la valeur réelle d'un deal selon le modèle
  const getDealValue = () => {
    if (!estimation.details || !parameters) return 0;
    
    switch (modelKey) {
      case 'recurring':
        return (parameters.annualRevenuePerClient || 0) * ((estimation.details.incrementalMarginPct || 0) / 100);
      case 'projects':
        return (parameters.avgContractValue || 0) * ((estimation.details.marginPct || 0) / 100);
      case 'transactions':
        return (estimation.details.annualisedRevenuePerMandate || 0) * ((estimation.details.netMarginPct || 0) / 100);
      case 'financing':
        return (estimation.details.annualRevenuePerDeal || 0) * ((estimation.details.netMarginPct || 0) / 100);
      case 'asset_management':
        return (estimation.details.annualRevenuePerRelation || 0) * ((estimation.details.netMarginPct || 0) / 100);
      default:
        return 0;
    }
  };

  const dealValue = getDealValue();

  // Calculs pour les 3 blocs selon le modèle
  const getYourFigures = () => {
    if (!parameters || !estimation.details) return null;

    switch (modelKey) {
      case 'recurring':
        return {
          revenuePerContract: parameters.annualRevenuePerClient || 0,
          signatureRate: parameters.convIntroToClient || 0,
          revenuePerIntro: (parameters.annualRevenuePerClient || 0) * ((parameters.convIntroToClient || 0) / 100)
        };
      case 'projects':
        return {
          revenuePerContract: parameters.avgContractValue || 0,
          signatureRate: parameters.convOppToClient || 0,
          revenuePerIntro: (parameters.avgContractValue || 0) * ((parameters.convOppToClient || 0) / 100)
        };
      case 'transactions':
        return {
          revenuePerContract: estimation.details.annualisedRevenuePerMandate || 0,
          signatureRate: parameters.convIntroToMandate || 0,
          revenuePerIntro: (estimation.details.annualisedRevenuePerMandate || 0) * ((parameters.convIntroToMandate || 0) / 100)
        };
      case 'financing':
        return {
          revenuePerContract: estimation.details.annualRevenuePerDeal || 0,
          signatureRate: parameters.convIntroToFinancing || 0,
          revenuePerIntro: (estimation.details.annualRevenuePerDeal || 0) * ((parameters.convIntroToFinancing || 0) / 100)
        };
      case 'asset_management':
        return {
          revenuePerContract: estimation.details.annualRevenuePerRelation || 0,
          signatureRate: parameters.convIntroToRelationship || 0,
          revenuePerIntro: (estimation.details.annualRevenuePerRelation || 0) * ((parameters.convIntroToRelationship || 0) / 100)
        };
      default:
        return null;
    }
  };

  const getCollaborationHypothesis = () => {
    if (!parameters || !estimation.details) return null;

    const UPLIFT = 1.5;
    let introsPerQuarter = 0;
    let conversionRate = 0;

    switch (modelKey) {
      case 'recurring':
        introsPerQuarter = (parameters.introsPerQuarter || 0) * UPLIFT;
        conversionRate = parameters.convIntroToClient || 0;
        break;
      case 'projects':
        introsPerQuarter = (parameters.qualifiedOppPerQuarter || 0) * UPLIFT;
        conversionRate = parameters.convOppToClient || 0;
        break;
      case 'transactions':
        introsPerQuarter = (parameters.introsPerQuarter || 0) * UPLIFT;
        conversionRate = parameters.convIntroToMandate || 0;
        break;
      case 'financing':
        introsPerQuarter = (parameters.introsPerQuarter || 0) * UPLIFT;
        conversionRate = parameters.convIntroToFinancing || 0;
        break;
      case 'asset_management':
        introsPerQuarter = (parameters.introsPerQuarter || 0) * UPLIFT;
        conversionRate = parameters.convIntroToRelationship || 0;
        break;
      default:
        return null;
    }

    const clientsPerQuarter = introsPerQuarter * (conversionRate / 100);
    const bestCollaboratorIntros = (parameters.introsPerQuarter || 0);

    return {
      introsPerQuarter,
      clientsPerQuarter,
      bestCollaboratorIntros
    };
  };

  const getEconomicValue = () => {
    if (!estimation) return null;

    // Calcul du revenu annuel récurrent généré par les introductions qualifiées
    // Pour le modèle recurring : revenu généré par les clients additionnels (ARR)
    // Pour les autres modèles : revenu additionnel calculé
    let annualRevenueFromIntros = 0;
    
    if (modelKey === 'recurring' && parameters && estimation.details) {
      // Le revenu annuel récurrent correspond à l'ARR généré par les nouveaux clients
      // C'est le CA par client × nombre de clients additionnels par an
      annualRevenueFromIntros = (parameters.annualRevenuePerClient || 0) * (estimation.details.additionalClientsPerYear || 0);
    } else {
      // Pour les autres modèles, utiliser le revenu additionnel calculé
      annualRevenueFromIntros = estimation.additionalRevenue || 0;
    }

    return {
      annualRevenue: annualRevenueFromIntros,
      valuationGain: estimation.valuationGain || 0,
      arrMultiple: estimation.details?.arrMultiple || estimation.details?.ebitdaMultiple || estimation.details?.mgmtFeesMultiple || 0
    };
  };

  const yourFigures = getYourFigures();
  const collaborationHypothesis = getCollaborationHypothesis();
  const economicValue = getEconomicValue();

  return (
    <>
      <div className="results-page">
        {/* Header avec logo */}
        <div className="results-header">
          <div className="results-logo">
            <img src="/logo_arbrigrage_blanc.png" alt="Arbitrage Partners" />
          </div>
          <h1 className="results-main-title">
            Votre <em>gain économique potentiel</em> avec Arbitrage Partners
          </h1>
          <p className="results-main-subtitle">
            Cette estimation est une <strong className="results-text-green">projection indicative</strong> basée sur{' '}
            <strong className="results-text-blue">les données que vous avez fournies</strong>, et notre historique de résultats.
          </p>
        </div>

        {/* Section: VOS CHIFFRES - Design Figma */}
        {yourFigures && (
          <div className="results-your-figures-section">
            <div className="results-your-figures-card">
              <h2 className="results-section-title-small">VOS CHIFFRES</h2>
              <div className="results-figures-grid">
              <div className="results-figure-card">
                <div className="results-figure-amount-row">
                  <div className="results-figure-icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#6dc0ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="1" x2="12" y2="23"></line>
                      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                    </svg>
                  </div>
                  <div
                    className={
                      isBlurred ? 'results-figure-amount results-blurred' : 'results-figure-amount'
                    }
                  >
                    {formatEuroCompact(yourFigures.revenuePerContract)}
                  </div>
                </div>
                <div className="results-figure-label">
                  {modelKey === 'recurring' 
                    ? 'Chiffre d\'affaire annuel récurrent moyen généré par un contrat'
                    : modelKey === 'projects'
                    ? 'Valeur moyenne d\'un contrat'
                    : 'Revenu annuel moyen par contrat'}
                </div>
              </div>
              <div className="results-figure-arrow">≈</div>
              <div className="results-figure-card">
                <div className="results-figure-amount-row">
                  <div className="results-figure-icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#6dc0ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="6" x2="12" y2="12"></line>
                      <line x1="12" y1="12" x2="16" y2="16"></line>
                    </svg>
                  </div>
                  <div
                    className={
                      isBlurred ? 'results-figure-amount results-blurred' : 'results-figure-amount'
                    }
                  >
                    {Math.round(yourFigures.signatureRate)}%
                  </div>
                </div>
                <div className="results-figure-label">
                  Taux de signature moyen d'une opportunité qualifiée
                </div>
              </div>
              <div className="results-figure-arrow">≈</div>
              <div className="results-figure-card">
                <div className="results-figure-amount-row">
                  <div className="results-figure-icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#6dc0ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="1" x2="12" y2="23"></line>
                      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                    </svg>
                  </div>
                  <div
                    className={
                      isBlurred ? 'results-figure-amount results-blurred' : 'results-figure-amount'
                    }
                  >
                    {formatEuroCompact(yourFigures.revenuePerIntro)}
                  </div>
                </div>
                <div className="results-figure-label">
                  Chiffre d'affaires récurrent moyen généré par une introduction qualifiée
                </div>
              </div>
            </div>
            </div>
          </div>
        )}

        {/* Section: LE VOLUME D'INTRODUCTIONS QUALIFIÉES POTENTIEL - Design Figma */}
        {collaborationHypothesis && (
          <div className="results-collaboration-section">
            <div className="results-collaboration-card">
              <h2 className="results-section-title-small">LE VOLUME D'INTRODUCTIONS QUALIFIÉES POTENTIEL</h2>
              <div className="results-collaboration-grid">
              <div className="results-collaboration-item">
                <div className="results-collaboration-amount-row">
                  <div className="results-collaboration-icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#209c01" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                  </div>
                  <div
                    className={
                      isBlurred ? 'results-collaboration-amount results-blurred' : 'results-collaboration-amount'
                    }
                  >
                    {Math.round(collaborationHypothesis.introsPerQuarter)}
                  </div>
                </div>
                <div className="results-collaboration-label">
                  introductions qualifiées par trimestre
                </div>
                <div className="results-collaboration-explanation">
                  Correspondant à 1,5x les {Math.round(collaborationHypothesis.bestCollaboratorIntros)} introductions qualifiées que produit votre meilleur collaborateur.
                </div>
              </div>
              <div className="results-collaboration-arrow">≈</div>
              <div className="results-collaboration-item">
                <div className="results-collaboration-amount-row">
                  <div className="results-collaboration-icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#209c01" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                  </div>
                  <div
                    className={
                      isBlurred ? 'results-collaboration-amount results-blurred' : 'results-collaboration-amount'
                    }
                  >
                    {collaborationHypothesis.clientsPerQuarter.toFixed(1).replace('.', ',').replace(',0', '')}
                  </div>
                </div>
                <div className="results-collaboration-label">
                  clients par trimestre en moyenne
                </div>
                <div className="results-collaboration-explanation">
                  En prenant en compte votre taux de signature de <strong>{Math.round(yourFigures?.signatureRate || 0)}%</strong>.
                </div>
              </div>
            </div>
            </div>
          </div>
        )}

        {/* Section: VALEUR POTENTIELLE D'UN TRIMESTRE - Design Figma */}
        {economicValue && (
          <div className="results-economic-value-section">
            <div className="results-economic-value-card">
              <h2 className="results-section-title-small">VALEUR POTENTIELLE D'UN TRIMESTRE DE COLLABORATION</h2>
              <div className="results-economic-cards">
              <div className="results-economic-card">
                <div className="results-economic-amount-row">
                  <div className="results-economic-icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#6dc0ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="1" x2="12" y2="23"></line>
                      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                    </svg>
                  </div>
                  <div
                    className={
                      isBlurred ? 'results-economic-amount results-blurred' : 'results-economic-amount'
                    }
                  >
                    {formatEuroCompact(economicValue.annualRevenue / 4)}
                  </div>
                </div>
                <div className="results-economic-progress">
                  <div className="results-economic-progress-bar" style={{ width: '20%' }}></div>
                </div>
                <div className="results-economic-description">
                  <strong>Chiffre d'affaire annuel récurrent additionnel généré par{' '}
                  <em>{Math.round(collaborationHypothesis?.introsPerQuarter || 0)}</em> introductions qualifiées</strong>
                </div>
              </div>
              <div className="results-economic-card">
                <div className="results-economic-amount-row">
                  <div className="results-economic-icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#6dc0ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="1" x2="12" y2="23"></line>
                      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                    </svg>
                  </div>
                  <div
                    className={
                      isBlurred ? 'results-economic-amount results-blurred' : 'results-economic-amount'
                    }
                  >
                    {formatEuroCompact(economicValue.valuationGain)}
                  </div>
                </div>
                <div className="results-economic-progress">
                  <div className="results-economic-progress-bar" style={{ width: '100%' }}></div>
                </div>
                <div className="results-economic-description">
                  <strong>Gain de valorisation d'entreprise générée par{' '}
                  <em>{Math.round(collaborationHypothesis?.introsPerQuarter || 0)}</em> introductions qualifiées</strong>
                </div>
                <div className="results-economic-footnote">
                  En utilisant le multiple de <em>×{economicValue.arrMultiple}</em> l'ARR en vigueur dans votre secteur.
                </div>
                {onEditParameters && (
                  <div style={{ marginTop: 16, textAlign: 'center' }}>
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
                        fontSize: '11px',
                        fontFamily: 'inherit',
                        borderRadius: '10px'
                      }}
                    >
                      Modifier mes informations
                    </button>
                  </div>
                )}
              </div>
            </div>
            </div>
          </div>
        )}

        {/* Image faisceaux verts avec chevauchement */}
        <div className="results-gradient-separator-wrapper">
          <div className="results-gradient-image-container">
            <img 
              src="/image 4703.png" 
              alt="" 
              className="results-gradient-image"
            />
          </div>
        </div>

        {/* Section: QUI SOMMES-NOUS ? - Design Figma */}
        <div className="results-who-section">
          <div className="results-who-content-wrapper">
            <div className="results-who-content">
              <h2 className="results-who-title">Qui sommes-nous ?</h2>
              <p className="results-who-text">
                Arbitrage Partners intervient comme une boutique de dealflows qui vous apporte un pipeline d'introductions qualifié chaque trimestre auprès de vos décideurs cibles.
              </p>
              <p className="results-who-text">
                Après un échange avec vous, nous identifions un nombre précis d'introductions qualifiés à apporter sur le trimestre. Ce volume est garantie contractuellement. Si l'objectif n'est pas atteint, nous continuons jusqu'à livraison.
              </p>
            </div>
          </div>
          <div className="results-stats-grid">
            <div className="results-stat-item">
              <div className="results-stat-number">17</div>
              <div className="results-stat-label">introductions qualifiées par trimestre et par client en moyenne</div>
            </div>
            <div className="results-stat-item">
              <div className="results-stat-number">x10,5</div>
              <div className="results-stat-label">R.O.I. moyen sur les missions</div>
            </div>
            <div className="results-stat-item">
              <div className="results-stat-number">42 jours</div>
              <div className="results-stat-label">en moyenne avant d'avoir les premières conversations</div>
            </div>
          </div>
        </div>

        {/* Section: LES ENJEUX DE NOS CLIENTS - Design Figma */}
        <div className="results-challenges-section">
          <div className="results-challenges-header">
            <h2 className="results-challenges-title">Les enjeux de nos clients</h2>
            <p className="results-challenges-subtitle">
              Êtes-vous aligné avec <em>notre thèse</em> ?
            </p>
          </div>
          <div className="results-challenges-grid">
            <div className="results-challenge-card">
              <div className="results-challenge-image">
                <img src="/1.png" alt="" />
              </div>
              <div className="results-challenge-content">
                <h3 className="results-challenge-title">Dépendance au réseau existant</h3>
                <p className="results-challenge-text">Peu de création d'opportunités au-delà du réseau existant.</p>
              </div>
            </div>
            <div className="results-challenge-card">
              <div className="results-challenge-image">
                <img src="/2.png" alt="" />
              </div>
              <div className="results-challenge-content">
                <h3 className="results-challenge-title">Croissance imprévisible</h3>
                <p className="results-challenge-text">Le chiffre d'affaires dépend des opportunités aléatoires, pas d'un système pilotable.</p>
              </div>
            </div>
            <div className="results-challenge-card">
              <div className="results-challenge-image">
                <img src="/3.png" alt="" />
              </div>
              <div className="results-challenge-content">
                <h3 className="results-challenge-title">Ventes complexes & multi-décideurs</h3>
                <p className="results-challenge-text">Besoin d'aligner tôt les pôles finances, directions et opérations.</p>
              </div>
            </div>
            <div className="results-challenge-card">
              <div className="results-challenge-image">
                <img src="/4.png" alt="" />
              </div>
              <div className="results-challenge-content">
                <h3 className="results-challenge-title">Marchés à sensibilité réputationnelle</h3>
                <p className="results-challenge-text">Chaque prise de contact engage votre crédibilité</p>
              </div>
            </div>
            <div className="results-challenge-card">
              <div className="results-challenge-image">
                <img src="/5.png" alt="" />
              </div>
              <div className="results-challenge-content">
                <h3 className="results-challenge-title">Pas de flux réguliers d'opportunités</h3>
                <p className="results-challenge-text">Les efforts internes ne produisent pas un flux régulier d'opportunités qualifiées.</p>
              </div>
            </div>
            <div className="results-challenge-card">
              <div className="results-challenge-image">
                <img src="/6.png" alt="" />
              </div>
              <div className="results-challenge-content">
                <h3 className="results-challenge-title">Décideurs difficiles d'accès</h3>
                <p className="results-challenge-text">Dirigeants, opérateurs et experts qui ignorent la prospection de masse.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Section: NOS CLIENTS ONT OBTENU - Design Figma */}
        <div className="results-clients-section">
          <h2 className="results-clients-title">Nos clients ont obtenu des introductions auprès de :</h2>
          <div className="results-clients-grid">
            <div className="results-client-logo">
              <img src="/logos/image 4702.png" alt="Client 1" />
            </div>
            <div className="results-client-logo">
              <img src="/logos/image 4703.png" alt="Client 2" />
            </div>
            <div className="results-client-logo">
              <img src="/logos/image 4704.png" alt="Client 3" />
            </div>
            <div className="results-client-logo">
              <img src="/logos/image 4706.png" alt="Client 4" />
            </div>
            <div className="results-client-logo">
              <img src="/logos/image 4708.png" alt="Client 5" />
            </div>
            <div className="results-client-logo">
              <img src="/logos/image 4710.png" alt="Client 6" />
            </div>
            <div className="results-client-logo">
              <img src="/logos/image 4712.png" alt="Client 7" />
            </div>
            <div className="results-client-logo">
              <img src="/logos/image 4702.png" alt="Client 8" />
            </div>
            <div className="results-client-logo">
              <img src="/logos/image 4703.png" alt="Client 9" />
            </div>
            <div className="results-client-logo">
              <img src="/logos/image 4704.png" alt="Client 10" />
            </div>
            <div className="results-client-logo">
              <img src="/logos/image 4706.png" alt="Client 11" />
            </div>
            <div className="results-client-logo">
              <img src="/logos/image 4708.png" alt="Client 12" />
            </div>
          </div>
        </div>

        {/* Section: CRITÈRES DE COLLABORATION - Design Figma */}
        <div className="results-criteria-section">
          <div className="results-criteria-content">
            <h2 className="results-criteria-title">
              Nous garantissons un pipeline d'opportunités qualifiées aux entreprises qui remplissent ces conditions :
            </h2>
            <p className="results-criteria-subtitle">Critères de collaboration</p>
            <div className="results-criteria-list">
              <div className="results-criteria-item">
                <div className="results-criteria-checkbox"></div>
                <p>La <strong>valeur moyenne d'un contrat</strong> est <strong>élevée</strong>.</p>
              </div>
              <div className="results-criteria-item">
                <div className="results-criteria-checkbox"></div>
                <p>Vos interlocuteurs sont des <strong>décideurs exécutifs ou techniques</strong> ou <strong>sophistiqués</strong>.</p>
              </div>
              <div className="results-criteria-item">
                <div className="results-criteria-checkbox"></div>
                <p>Votre offre <strong>répond à un besoin fort avec un produit</strong> ou <strong>service de qualité</strong>.</p>
              </div>
            </div>
            <div className="results-criteria-note">
              <p>Si vous remplissez ces conditions, nous pouvons effectuer un premier échange pour cadre votre contexte, évaluer l'accès à vos décideurs et déterminer s'il existe un alignement pour avancer ou non.</p>
            </div>
          </div>
          <div className="results-contact-form-wrapper">
            <div className="results-contact-form">
              <div className="results-contact-field">
                <label className="results-contact-label">Nom complet</label>
                <input type="text" className="results-contact-input" />
              </div>
              <div className="results-contact-field">
                <label className="results-contact-label">Email professionnel</label>
                <input type="email" className="results-contact-input" />
              </div>
              <div className="results-contact-field">
                <label className="results-contact-label">Entreprise</label>
                <input type="text" className="results-contact-input" />
              </div>
              <div className="results-contact-field">
                <label className="results-contact-label">Rôle</label>
                <input type="text" className="results-contact-input" />
              </div>
              <button type="button" className="results-contact-button" onClick={onOpenUnlock}>
                ✾ Entrer en relation
              </button>
            </div>
          </div>
        </div>

        {/* Footer - Design Figma */}
        <footer className="results-footer">
          <div className="results-footer-content">
            <div className="results-footer-column">
              <div className="results-footer-logo">
                <img src="/logo_arbrigrage_blanc.png" alt="Arbitrage Partners" />
              </div>
              <div className="results-footer-definition">
                <p>
                  <strong>Arbitrage</strong> <span>(nom masculin)</span>
                </p>
                <p>/ˌaʁ.bi.tʁaʒ/</p>
                <p>Exploiter un déséquilibre pour obtenir un avantage économique.</p>
              </div>
            </div>
            <div className="results-footer-column">
              <h3 className="results-footer-title">Bureaux</h3>
              <p className="results-footer-text">Paris 15e, 29 avenue de Lowendal</p>
              <p className="results-footer-text">Nice, 169 Promenade des Anglais</p>
            </div>
            <div className="results-footer-column">
              <h3 className="results-footer-title">Arbitrage Partners © 2025</h3>
              <p className="results-footer-text">admin@arbitrage-partners.com</p>
              <p className="results-footer-link">Mentions légales</p>
              <p className="results-footer-link">Confidentialité</p>
            </div>
          </div>
        </footer>
      </div>

      {unlockOpen && <ContactModal onClose={onCloseUnlock} onSubmit={onSubmitUnlock} />}
    </>
  );
}


