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
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                      {/* Circular arrow */}
                      <path d="M23.4001 11.9C23.4001 18.8 18.3516 23.4 12.1232 23.4C7.06092 23.4 2.97612 20.7147 1.55012 16.5M0.400116 11.9C0.400116 4.99999 5.44862 0.399994 11.6782 0.399994C16.7393 0.399994 20.8218 3.08524 22.2501 7.29999" stroke="#6DC0FF" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M5.10466 17.6505L1.55012 16.6051L0.400116 20.2642M18.6956 6.15054L22.2501 7.19599L23.4001 4.05963" stroke="#6DC0FF" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round"/>
                      {/* Document centered inside - positioned at (6, 8.5) to center 12x7 viewBox in 24x24 */}
                      <g transform="translate(6, 8.5)">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="7" viewBox="0 0 12 7" fill="none">
                          <path d="M0.350006 0.350006H10.8046V6.62273H0.350006V0.350006Z" stroke="#6DC0FF" strokeWidth="0.7" strokeLinejoin="round"/>
                          <path d="M0.350006 2.44092C0.90455 2.44092 1.43638 2.22062 1.8285 1.8285C2.22062 1.43638 2.44092 0.90455 2.44092 0.350006H0.350006V2.44092ZM0.350006 4.53182C0.90455 4.53182 1.43638 4.75212 1.8285 5.14424C2.22062 5.53636 2.44092 6.06819 2.44092 6.62273H0.350006V4.53182ZM10.8046 4.53182V6.62273H8.71364C8.71364 6.06819 8.93394 5.53636 9.32606 5.14424C9.71818 4.75212 10.25 4.53182 10.8046 4.53182ZM10.8046 2.44092C10.25 2.44092 9.71818 2.22062 9.32606 1.8285C8.93394 1.43638 8.71364 0.90455 8.71364 0.350006H10.8046V2.44092Z" stroke="#6DC0FF" strokeWidth="0.7" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M5.56802 5.05564C6.28964 5.05564 6.87484 4.35362 6.87484 3.48746C6.87484 2.6213 6.28964 1.91928 5.56802 1.91928C4.84639 1.91928 4.2612 2.6213 4.2612 3.48746C4.2612 4.35362 4.84639 5.05564 5.56802 5.05564Z" stroke="#6DC0FF" strokeWidth="0.7" strokeLinejoin="round"/>
                        </svg>
                      </g>
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
                    <svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" viewBox="0 0 23 23" fill="none">
                      <path d="M18.1012 4.90031C18.0495 3.19189 17.8592 2.17212 17.153 1.46697C16.1849 0.5 14.6272 0.5 11.5118 0.5H7.10816C3.99274 0.5 2.43503 0.5 1.46807 1.46697C0.5 2.43283 0.5 3.98944 0.5 7.10046V15.9011C0.5 19.0121 0.5 20.5687 1.46807 21.5346C2.43613 22.5004 3.99274 22.5015 7.10816 22.5015H11.5129C14.6272 22.5015 16.1849 22.5015 17.153 21.5346C17.8592 20.8294 18.0495 19.8107 18.1012 18.1012" stroke="#6DC0FF" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M20.5688 11.2174L21.8636 9.92261C22.1606 9.62558 22.3102 9.47597 22.3894 9.31536C22.4633 9.16469 22.5017 8.99912 22.5017 8.83133C22.5017 8.66354 22.4633 8.49797 22.3894 8.3473C22.3102 8.18669 22.1606 8.03708 21.8636 7.74005C21.5666 7.44303 21.417 7.29342 21.2564 7.21422C21.1057 7.14039 20.9401 7.10201 20.7723 7.10201C20.6045 7.10201 20.439 7.14039 20.2883 7.21422C20.1277 7.29342 19.9792 7.44303 19.6811 7.74005L18.3863 9.03484M20.5688 11.2174L14.7758 17.0104L11.502 18.1017L12.5933 14.8278L18.3863 9.03484M20.5688 11.2174L18.3863 9.03484M3.80145 19.2018H4.90153L6.27662 16.4516L7.65172 19.2018H8.7518M4.90153 4.90076H13.7021M4.90153 9.30106H11.502" stroke="#6DC0FF" strokeLinecap="round" strokeLinejoin="round"/>
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
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="22" viewBox="0 0 24 22" fill="none">
                      {/* Document on top - centered horizontally */}
                      <g transform="translate(5.298, 0)">
                        <svg xmlns="http://www.w3.org/2000/svg" width="13.404" height="8.042" viewBox="0 0 14 9" fill="none" preserveAspectRatio="xMidYMid meet">
                          <path d="M0.25 0.25H13.6536V8.29218H0.25V0.25Z" stroke="#6DC0FF" strokeWidth="0.5" strokeLinejoin="round"/>
                          <path d="M0.25 2.93073C0.960973 2.93073 1.64283 2.64829 2.14556 2.14556C2.64829 1.64283 2.93073 0.960973 2.93073 0.25H0.25V2.93073ZM0.25 5.61145C0.960973 5.61145 1.64283 5.89389 2.14556 6.39662C2.64829 6.89935 2.93073 7.58121 2.93073 8.29218H0.25V5.61145ZM13.6536 5.61145V8.29218H10.9729C10.9729 7.58121 11.2553 6.89935 11.7581 6.39662C12.2608 5.89389 12.9427 5.61145 13.6536 5.61145ZM13.6536 2.93073C12.9427 2.93073 12.2608 2.64829 11.7581 2.14556C11.2553 1.64283 10.9729 0.960973 10.9729 0.25H13.6536V2.93073Z" stroke="#6DC0FF" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M6.95487 6.27295C7.88006 6.27295 8.63033 5.3729 8.63033 4.26241C8.63033 3.15192 7.88006 2.25186 6.95487 2.25186C6.02969 2.25186 5.27942 3.15192 5.27942 4.26241C5.27942 5.3729 6.02969 6.27295 6.95487 6.27295Z" stroke="#6DC0FF" strokeWidth="0.5" strokeLinejoin="round"/>
                        </svg>
                      </g>
                      {/* Dollar sign below */}
                      <g transform="translate(0, 8)">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="14" viewBox="0 0 24 14" fill="none">
                          <path d="M23.8765 4.8073L21.4059 0.557204C21.3377 0.439716 21.2433 0.334943 21.1281 0.248867C21.0129 0.162791 20.8792 0.0970995 20.7345 0.0555434C20.5898 0.0139874 20.437 -0.00261908 20.2849 0.0066723C20.1328 0.0159637 19.9842 0.0509709 19.8478 0.109695L17.3104 1.19805L12.0963 0.0113594C12.0329 -0.00312811 11.9662 -0.00312811 11.9027 0.0113594L6.68861 1.19805L4.15121 0.105528C4.01479 0.0468042 3.86627 0.011797 3.71414 0.0025056C3.562 -0.00678577 3.40923 0.00982068 3.26455 0.0513767C3.11987 0.0929328 2.98611 0.158624 2.87091 0.2447C2.75571 0.330776 2.66134 0.435549 2.59316 0.553038L0.122545 4.8073C0.0543516 4.92478 0.0136993 5.05267 0.00290963 5.18368C-0.00788001 5.31469 0.0114044 5.44625 0.0596615 5.57084C0.107919 5.69543 0.184203 5.81061 0.284159 5.90981C0.384114 6.00901 0.505783 6.09029 0.642217 6.14899L3.28316 7.28652L8.67826 10.6049C8.71756 10.6292 8.76192 10.6467 8.80891 10.6566L15.0024 11.99C15.0668 12.0045 15.1345 12.0044 15.199 11.9898C15.2634 11.9752 15.3223 11.9466 15.3701 11.9066L20.7449 7.27818L23.3578 6.15316C23.4942 6.09445 23.6159 6.01318 23.7158 5.91398C23.8158 5.81478 23.8921 5.69959 23.9403 5.575C23.9886 5.45041 24.0079 5.31886 23.9971 5.18785C23.9863 5.05684 23.9457 4.92894 23.8775 4.81146L23.8765 4.8073ZM18.9411 7.88653L15.3411 5.40314C15.2666 5.35165 15.1725 5.32571 15.0771 5.33033C14.9817 5.33495 14.8917 5.36978 14.8243 5.42814C12.9382 7.06484 10.8237 6.85401 9.47374 6.11149C9.42405 6.08404 9.38216 6.04732 9.35117 6.00404C9.32018 5.96077 9.30088 5.91205 9.29471 5.86148C9.2881 5.81281 9.29433 5.76348 9.31292 5.71716C9.33152 5.67085 9.36201 5.62874 9.40213 5.59398L13.7047 1.99974H17.1798L20.0443 6.93401L18.9411 7.88653ZM0.794151 5.35981C0.763204 5.27726 0.770841 5.18758 0.815441 5.1098L3.28993 0.851378C3.32168 0.796345 3.37048 0.749941 3.43094 0.717293C3.49139 0.684644 3.56115 0.667022 3.63251 0.666373C3.69237 0.666687 3.75134 0.678953 3.80476 0.702208L6.12732 1.70223L3.31025 6.55317L0.987697 5.55314C0.942268 5.53345 0.901792 5.50624 0.868582 5.47306C0.835372 5.43989 0.81008 5.4014 0.794151 5.35981ZM14.9772 11.2974L9.06826 10.0249L3.97799 6.89401L6.91409 1.83307L11.9995 0.67804L14.8756 1.33305H13.5479C13.4471 1.33297 13.3502 1.36676 13.2779 1.42722L8.85536 5.12147C8.73228 5.22746 8.63844 5.35592 8.58079 5.49735C8.52313 5.63878 8.50314 5.78957 8.52228 5.93855C8.54142 6.08753 8.59921 6.2309 8.69137 6.35806C8.78353 6.48522 8.9077 6.59291 9.05471 6.67317C10.9786 7.73236 13.3253 7.50652 15.1185 6.10566L18.3865 8.36071L14.9772 11.2974ZM23.2029 5.35981C23.187 5.4014 23.1617 5.43989 23.1285 5.47306C23.0953 5.50624 23.0548 5.53345 23.0094 5.55314L20.6868 6.55317L17.8717 1.70223L20.1943 0.702208C20.2856 0.663895 20.3908 0.658064 20.4872 0.685973C20.5835 0.713882 20.6632 0.773292 20.7091 0.851378L23.1797 5.10564C23.2269 5.18413 23.236 5.27556 23.2049 5.35981H23.2029ZM11.9937 13.75C11.9722 13.8216 11.9237 13.8851 11.8557 13.9304C11.7877 13.9756 11.7042 14.0001 11.6182 14C11.5856 14.0002 11.5531 13.9968 11.5215 13.99L7.48795 13.1208C7.4407 13.1109 7.39605 13.0933 7.35634 13.0691L4.80733 11.4999C4.72379 11.4486 4.66738 11.3707 4.6505 11.2835C4.63362 11.1963 4.65766 11.1069 4.71734 11.0349C4.77701 10.963 4.86742 10.9144 4.96869 10.8999C5.06996 10.8853 5.17379 10.906 5.25733 10.9574L7.74634 12.4883L11.714 13.3425C11.7636 13.3533 11.8102 13.3724 11.8511 13.3987C11.892 13.4251 11.9265 13.4582 11.9525 13.4961C11.9785 13.5339 11.9955 13.5759 12.0026 13.6195C12.0096 13.6631 12.0066 13.7074 11.9937 13.75Z" fill="#6DC0FF"/>
                        </svg>
                      </g>
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
                    <svg xmlns="http://www.w3.org/2000/svg" width="31" height="21" viewBox="0 0 31 21" fill="none">
                      <path d="M30.8405 7.21094L27.6492 0.835807C27.5612 0.659574 27.4393 0.502414 27.2905 0.3733C27.1417 0.244187 26.9689 0.145649 26.782 0.0833151C26.5952 0.0209811 26.3978 -0.00392862 26.2013 0.0100084C26.0048 0.0239455 25.813 0.0764563 25.6368 0.164542L22.3593 1.79708L15.6244 0.0170391C15.5425 -0.00469216 15.4563 -0.00469216 15.3744 0.0170391L8.63945 1.79708L5.36198 0.158292C5.18577 0.0702063 4.99393 0.0176955 4.79742 0.0037584C4.60092 -0.0101787 4.40359 0.014731 4.21671 0.0770651C4.02983 0.139399 3.85706 0.237936 3.70826 0.36705C3.55946 0.496163 3.43756 0.653324 3.3495 0.829557L0.158287 7.21094C0.0702041 7.38716 0.0176949 7.57901 0.00375827 7.77552C-0.0101783 7.97203 0.0147307 8.16937 0.0770627 8.35625C0.139395 8.54314 0.237929 8.71592 0.367038 8.86472C0.496148 9.01352 0.653303 9.13543 0.82953 9.22349L4.24074 10.9298L11.2094 15.9074C11.2602 15.9438 11.3175 15.9701 11.3782 15.9849L19.3781 17.9849C19.4613 18.0067 19.5488 18.0067 19.632 17.9848C19.7152 17.9629 19.7914 17.9199 19.8531 17.8599L26.7955 10.9173L30.1705 9.22974C30.3467 9.14168 30.5039 9.01977 30.633 8.87097C30.7621 8.72217 30.8606 8.54939 30.9229 8.3625C30.9853 8.17562 31.0102 7.97828 30.9962 7.78177C30.9823 7.58526 30.9298 7.39341 30.8417 7.21719L30.8405 7.21094ZM24.4655 11.8298L19.8156 8.10471C19.7193 8.02747 19.5979 7.98857 19.4746 7.99549C19.3514 8.00242 19.2351 8.05468 19.1481 8.14221C16.7119 10.5973 13.9806 10.281 12.2369 9.16723C12.1727 9.12606 12.1186 9.07097 12.0786 9.00606C12.0386 8.94115 12.0136 8.86807 12.0057 8.79223C11.9971 8.71921 12.0052 8.64522 12.0292 8.57574C12.0532 8.50627 12.0926 8.44311 12.1444 8.39097L17.7019 2.9996H22.1906L25.8905 10.401L24.4655 11.8298ZM1.02578 8.03971C0.985805 7.91589 0.99567 7.78137 1.05328 7.6647L4.24949 1.27707C4.29051 1.19452 4.35354 1.12491 4.43163 1.07594C4.50972 1.02697 4.59982 1.00053 4.69199 0.99956C4.76931 1.00003 4.84547 1.01843 4.91449 1.05331L7.91445 2.55334L4.27574 9.82975L1.27578 8.32972C1.2171 8.30017 1.16481 8.25935 1.12192 8.20959C1.07902 8.15983 1.04635 8.1021 1.02578 8.03971ZM19.3456 16.9462L11.7132 15.0374L5.13823 10.341L8.93069 2.7496L15.4994 1.01706L19.2143 1.99958H17.4994C17.3691 1.99946 17.244 2.05014 17.1506 2.14083L11.4382 7.6822C11.2792 7.84119 11.158 8.03388 11.0835 8.24603C11.009 8.45817 10.9832 8.68435 11.0079 8.90782C11.0327 9.1313 11.1073 9.34635 11.2263 9.53709C11.3454 9.72783 11.5058 9.88936 11.6957 10.0098C14.1806 11.5985 17.2119 11.2598 19.5281 9.15848L23.7493 12.5411L19.3456 16.9462ZM29.9705 8.03971C29.9499 8.1021 29.9172 8.15983 29.8743 8.20959C29.8314 8.25935 29.7792 8.30017 29.7205 8.32972L26.7205 9.82975L23.0843 2.55334L26.0843 1.05331C26.2023 0.995843 26.3382 0.987096 26.4626 1.02896C26.587 1.07082 26.69 1.15994 26.7493 1.27707L29.9405 7.65845C30.0014 7.7762 30.0131 7.91334 29.973 8.03971H29.9705ZM15.4919 20.625C15.4641 20.7325 15.4014 20.8276 15.3136 20.8955C15.2258 20.9634 15.1179 21.0002 15.0069 21C14.9647 21.0003 14.9227 20.9952 14.8819 20.985L9.67194 19.6812C9.6109 19.6663 9.55323 19.64 9.50194 19.6037L6.20947 17.2499C6.10156 17.1728 6.02869 17.056 6.00689 16.9252C5.98509 16.7944 6.01615 16.6603 6.09322 16.5524C6.1703 16.4445 6.28709 16.3716 6.41789 16.3498C6.5487 16.328 6.68281 16.3591 6.79072 16.4361L10.0057 18.7324L15.1306 20.0137C15.1946 20.0299 15.2548 20.0586 15.3076 20.0981C15.3605 20.1376 15.405 20.1873 15.4386 20.2441C15.4722 20.3009 15.4942 20.3638 15.5033 20.4292C15.5125 20.4946 15.5086 20.5611 15.4919 20.625Z" fill="#209C01"/>
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
                    <svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" viewBox="0 0 23 23" fill="none">
                      <path d="M18.1024 4.90061C18.0507 3.19207 17.8604 2.17223 17.1541 1.46703C16.186 0.5 14.6282 0.5 11.5125 0.5H7.10862C3.99298 0.5 2.43517 0.5 1.46813 1.46703C0.5 2.43297 0.5 3.98968 0.5 7.10092V15.9021C0.5 19.0134 0.5 20.5701 1.46813 21.536C2.43627 22.502 3.99298 22.5031 7.10862 22.5031H11.5136C14.6282 22.5031 16.186 22.5031 17.1541 21.536C17.8604 20.8308 18.0507 19.8121 18.1024 18.1024" stroke="#209C01" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M20.5686 11.2206L21.8635 9.9257C22.1605 9.62866 22.3101 9.47904 22.3893 9.31842C22.4632 9.16773 22.5015 9.00215 22.5015 8.83435C22.5015 8.66655 22.4632 8.50097 22.3893 8.35028C22.3101 8.18966 22.1605 8.04004 21.8635 7.743C21.5664 7.44596 21.4168 7.29634 21.2562 7.21712C21.1055 7.14329 20.9399 7.10491 20.7721 7.10491C20.6043 7.10491 20.4387 7.14329 20.288 7.21712C20.1274 7.29634 19.9789 7.44596 19.6808 7.743L18.3859 9.03788M20.5686 11.2206L14.7752 17.014L11.5011 18.1053L12.5925 14.8313L18.3859 9.03788M20.5686 11.2206L18.3859 9.03788M3.80005 19.2055H4.9002L6.27539 16.4551L7.65058 19.2055H8.75074M4.9002 4.9035H13.7014M4.9002 9.30411H11.5011" stroke="#209C01" strokeLinecap="round" strokeLinejoin="round"/>
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
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                      {/* Circular arrow */}
                      <path d="M23.4001 11.9C23.4001 18.8 18.3516 23.4 12.1232 23.4C7.06092 23.4 2.97612 20.7147 1.55012 16.5M0.400116 11.9C0.400116 4.99999 5.44862 0.399994 11.6782 0.399994C16.7393 0.399994 20.8218 3.08524 22.2501 7.29999" stroke="#209C01" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M5.10466 17.6505L1.55012 16.6051L0.400116 20.2642M18.6956 6.15054L22.2501 7.19599L23.4001 4.05963" stroke="#209C01" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round"/>
                      {/* Document centered inside - positioned at (6, 8.5) to center 12x7 viewBox in 24x24 */}
                      <g transform="translate(6, 8.5)">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="7" viewBox="0 0 12 7" fill="none">
                          <path d="M0.350006 0.350006H10.8046V6.62273H0.350006V0.350006Z" stroke="#209C01" strokeWidth="0.7" strokeLinejoin="round"/>
                          <path d="M0.350006 2.44092C0.90455 2.44092 1.43638 2.22062 1.8285 1.8285C2.22062 1.43638 2.44092 0.90455 2.44092 0.350006H0.350006V2.44092ZM0.350006 4.53182C0.90455 4.53182 1.43638 4.75212 1.8285 5.14424C2.22062 5.53636 2.44092 6.06819 2.44092 6.62273H0.350006V4.53182ZM10.8046 4.53182V6.62273H8.71364C8.71364 6.06819 8.93394 5.53636 9.32606 5.14424C9.71818 4.75212 10.25 4.53182 10.8046 4.53182ZM10.8046 2.44092C10.25 2.44092 9.71818 2.22062 9.32606 1.8285C8.93394 1.43638 8.71364 0.90455 8.71364 0.350006H10.8046V2.44092Z" stroke="#209C01" strokeWidth="0.7" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M5.56802 5.05564C6.28964 5.05564 6.87484 4.35362 6.87484 3.48746C6.87484 2.6213 6.28964 1.91928 5.56802 1.91928C4.84639 1.91928 4.2612 2.6213 4.2612 3.48746C4.2612 4.35362 4.84639 5.05564 5.56802 5.05564Z" stroke="#209C01" strokeWidth="0.7" strokeLinejoin="round"/>
                        </svg>
                      </g>
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
                    <svg xmlns="http://www.w3.org/2000/svg" width="27" height="26" viewBox="0 0 27 26" fill="none">
                      <path d="M0.832458 16.9869L9.55535 8.26398L13.8345 12.5451L24.4168 1.96478" stroke="#209C01" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M25.5011 5.22691C25.6758 3.49197 25.6758 2.53815 25.5011 0.879518C23.8425 0.706827 22.8907 0.706827 21.1537 0.879518M8.43081 25.008V15.5663M17.1316 25.008V15.5663M0.750092 22.0562L1.14367 25.008H25.1939L25.7501 11.7791" stroke="#209C01" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
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
              <p className="results-who-text-large">
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
            <h2 className="results-challenges-title">Êtes-vous aligné avec <em>notre thèse</em> ?</h2>
            <p className="results-challenges-subtitle">
              Les enjeux de nos clients
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
              <img src="/logos/image 4700.png" alt="Client 1" />
            </div>
            <div className="results-client-logo">
              <img src="/logos/image 4702.png" alt="Client 2" />
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
              <img src="/logos/image 4700.png" alt="Client 7" />
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
            <p className="results-criteria-subtitle">Critères de collaboration</p>
            <h2 className="results-criteria-title">
              Nous garantissons un pipeline d'opportunités qualifiées aux entreprises qui remplissent ces conditions :
            </h2>
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
              <button type="button" className="results-contact-button">
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


