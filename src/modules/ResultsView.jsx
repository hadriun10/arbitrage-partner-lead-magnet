import React from 'react';
import { modelMetadata } from './ModelChoiceStep.jsx';
import { ContactModal } from './ContactModal.jsx';
import { getModelConfig, UPLIFT_MULTIPLIER } from './resultsConfig.js';

// ============ Formatters ============

function formatEuroCompact(value) {
  if (!value || Number.isNaN(value)) return '—';
  const rounded = Math.round(value);
  return `${rounded.toLocaleString('fr-FR')} €`;
}

function formatNumber(value) {
  if (!value || Number.isNaN(value)) return '—';
  return Math.round(value).toLocaleString('fr-FR');
}

function formatDecimal(value) {
  if (!value || Number.isNaN(value)) return '—';
  return value.toFixed(1).replace('.', ',').replace(',0', '');
}

function formatPercent(value) {
  if (value === undefined || value === null || Number.isNaN(value)) return '—';
  return `${Math.round(value)}%`;
}

function formatRange(value) {
  if (!value) return '—';
  if (typeof value === 'object' && value.min !== undefined) {
    return `${value.min}-${value.max}`;
  }
  return formatNumber(value);
}

function formatValue(value, format) {
  switch (format) {
    case 'currency': return formatEuroCompact(value);
    case 'percent': return formatPercent(value);
    case 'decimal': return formatDecimal(value);
    case 'range': return formatRange(value);
    case 'number':
    default: return formatNumber(value);
  }
}

// ============ Icons ============

const IconMoney = ({ color = '#6DC0FF' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M23.4001 11.9C23.4001 18.8 18.3516 23.4 12.1232 23.4C7.06092 23.4 2.97612 20.7147 1.55012 16.5M0.400116 11.9C0.400116 4.99999 5.44862 0.399994 11.6782 0.399994C16.7393 0.399994 20.8218 3.08524 22.2501 7.29999" stroke={color} strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M5.10466 17.6505L1.55012 16.6051L0.400116 20.2642M18.6956 6.15054L22.2501 7.19599L23.4001 4.05963" stroke={color} strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round"/>
    <g transform="translate(6, 8.5)">
      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="7" viewBox="0 0 12 7" fill="none">
        <path d="M0.350006 0.350006H10.8046V6.62273H0.350006V0.350006Z" stroke={color} strokeWidth="0.7" strokeLinejoin="round"/>
        <path d="M0.350006 2.44092C0.90455 2.44092 1.43638 2.22062 1.8285 1.8285C2.22062 1.43638 2.44092 0.90455 2.44092 0.350006H0.350006V2.44092ZM0.350006 4.53182C0.90455 4.53182 1.43638 4.75212 1.8285 5.14424C2.22062 5.53636 2.44092 6.06819 2.44092 6.62273H0.350006V4.53182ZM10.8046 4.53182V6.62273H8.71364C8.71364 6.06819 8.93394 5.53636 9.32606 5.14424C9.71818 4.75212 10.25 4.53182 10.8046 4.53182ZM10.8046 2.44092C10.25 2.44092 9.71818 2.22062 9.32606 1.8285C8.93394 1.43638 8.71364 0.90455 8.71364 0.350006H10.8046V2.44092Z" stroke={color} strokeWidth="0.7" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M5.56802 5.05564C6.28964 5.05564 6.87484 4.35362 6.87484 3.48746C6.87484 2.6213 6.28964 1.91928 5.56802 1.91928C4.84639 1.91928 4.2612 2.6213 4.2612 3.48746C4.2612 4.35362 4.84639 5.05564 5.56802 5.05564Z" stroke={color} strokeWidth="0.7" strokeLinejoin="round"/>
      </svg>
    </g>
  </svg>
);

const IconContract = ({ color = '#6DC0FF' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" viewBox="0 0 23 23" fill="none">
    <path d="M18.1012 4.90031C18.0495 3.19189 17.8592 2.17212 17.153 1.46697C16.1849 0.5 14.6272 0.5 11.5118 0.5H7.10816C3.99274 0.5 2.43503 0.5 1.46807 1.46697C0.5 2.43283 0.5 3.98944 0.5 7.10046V15.9011C0.5 19.0121 0.5 20.5687 1.46807 21.5346C2.43613 22.5004 3.99274 22.5015 7.10816 22.5015H11.5129C14.6272 22.5015 16.1849 22.5015 17.153 21.5346C17.8592 20.8294 18.0495 19.8107 18.1012 18.1012" stroke={color} strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M20.5688 11.2174L21.8636 9.92261C22.1606 9.62558 22.3102 9.47597 22.3894 9.31536C22.4633 9.16469 22.5017 8.99912 22.5017 8.83133C22.5017 8.66354 22.4633 8.49797 22.3894 8.3473C22.3102 8.18669 22.1606 8.03708 21.8636 7.74005C21.5666 7.44303 21.417 7.29342 21.2564 7.21422C21.1057 7.14039 20.9401 7.10201 20.7723 7.10201C20.6045 7.10201 20.439 7.14039 20.2883 7.21422C20.1277 7.29342 19.9792 7.44303 19.6811 7.74005L18.3863 9.03484M20.5688 11.2174L14.7758 17.0104L11.502 18.1017L12.5933 14.8278L18.3863 9.03484M20.5688 11.2174L18.3863 9.03484M3.80145 19.2018H4.90153L6.27662 16.4516L7.65172 19.2018H8.7518M4.90153 4.90076H13.7021M4.90153 9.30106H11.502" stroke={color} strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const IconDealflow = ({ color = '#6DC0FF' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="22" viewBox="0 0 24 22" fill="none">
    <g transform="translate(5.298, 0)">
      <svg xmlns="http://www.w3.org/2000/svg" width="13.404" height="8.042" viewBox="0 0 14 9" fill="none" preserveAspectRatio="xMidYMid meet">
        <path d="M0.25 0.25H13.6536V8.29218H0.25V0.25Z" stroke={color} strokeWidth="0.5" strokeLinejoin="round"/>
        <path d="M0.25 2.93073C0.960973 2.93073 1.64283 2.64829 2.14556 2.14556C2.64829 1.64283 2.93073 0.960973 2.93073 0.25H0.25V2.93073ZM0.25 5.61145C0.960973 5.61145 1.64283 5.89389 2.14556 6.39662C2.64829 6.89935 2.93073 7.58121 2.93073 8.29218H0.25V5.61145ZM13.6536 5.61145V8.29218H10.9729C10.9729 7.58121 11.2553 6.89935 11.7581 6.39662C12.2608 5.89389 12.9427 5.61145 13.6536 5.61145ZM13.6536 2.93073C12.9427 2.93073 12.2608 2.64829 11.7581 2.14556C11.2553 1.64283 10.9729 0.960973 10.9729 0.25H13.6536V2.93073Z" stroke={color} strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M6.95487 6.27295C7.88006 6.27295 8.63033 5.3729 8.63033 4.26241C8.63033 3.15192 7.88006 2.25186 6.95487 2.25186C6.02969 2.25186 5.27942 3.15192 5.27942 4.26241C5.27942 5.3729 6.02969 6.27295 6.95487 6.27295Z" stroke={color} strokeWidth="0.5" strokeLinejoin="round"/>
      </svg>
    </g>
    <g transform="translate(0, 8)">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="14" viewBox="0 0 24 14" fill="none">
        <path d="M23.8765 4.8073L21.4059 0.557204C21.3377 0.439716 21.2433 0.334943 21.1281 0.248867C21.0129 0.162791 20.8792 0.0970995 20.7345 0.0555434C20.5898 0.0139874 20.437 -0.00261908 20.2849 0.0066723C20.1328 0.0159637 19.9842 0.0509709 19.8478 0.109695L17.3104 1.19805L12.0963 0.0113594C12.0329 -0.00312811 11.9662 -0.00312811 11.9027 0.0113594L6.68861 1.19805L4.15121 0.105528C4.01479 0.0468042 3.86627 0.011797 3.71414 0.0025056C3.562 -0.00678577 3.40923 0.00982068 3.26455 0.0513767C3.11987 0.0929328 2.98611 0.158624 2.87091 0.2447C2.75571 0.330776 2.66134 0.435549 2.59316 0.553038L0.122545 4.8073C0.0543516 4.92478 0.0136993 5.05267 0.00290963 5.18368C-0.00788001 5.31469 0.0114044 5.44625 0.0596615 5.57084C0.107919 5.69543 0.184203 5.81061 0.284159 5.90981C0.384114 6.00901 0.505783 6.09029 0.642217 6.14899L3.28316 7.28652L8.67826 10.6049C8.71756 10.6292 8.76192 10.6467 8.80891 10.6566L15.0024 11.99C15.0668 12.0045 15.1345 12.0044 15.199 11.9898C15.2634 11.9752 15.3223 11.9466 15.3701 11.9066L20.7449 7.27818L23.3578 6.15316C23.4942 6.09445 23.6159 6.01318 23.7158 5.91398C23.8158 5.81478 23.8921 5.69959 23.9403 5.575C23.9886 5.45041 24.0079 5.31886 23.9971 5.18785C23.9863 5.05684 23.9457 4.92894 23.8775 4.81146L23.8765 4.8073Z" fill={color}/>
      </svg>
    </g>
  </svg>
);

const IconGrowth = ({ color = '#209C01' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="27" height="26" viewBox="0 0 27 26" fill="none">
    <path d="M0.832458 16.9869L9.55535 8.26398L13.8345 12.5451L24.4168 1.96478" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M25.5011 5.22691C25.6758 3.49197 25.6758 2.53815 25.5011 0.879518C23.8425 0.706827 22.8907 0.706827 21.1537 0.879518M8.43081 25.008V15.5663M17.1316 25.008V15.5663M0.750092 22.0562L1.14367 25.008H25.1939L25.7501 11.7791" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const IconHandshake = ({ color = '#209C01' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="31" height="21" viewBox="0 0 31 21" fill="none">
    <path d="M30.8405 7.21094L27.6492 0.835807C27.5612 0.659574 27.4393 0.502414 27.2905 0.3733C27.1417 0.244187 26.9689 0.145649 26.782 0.0833151C26.5952 0.0209811 26.3978 -0.00392862 26.2013 0.0100084C26.0048 0.0239455 25.813 0.0764563 25.6368 0.164542L22.3593 1.79708L15.6244 0.0170391C15.5425 -0.00469216 15.4563 -0.00469216 15.3744 0.0170391L8.63945 1.79708L5.36198 0.158292C5.18577 0.0702063 4.99393 0.0176955 4.79742 0.0037584C4.60092 -0.0101787 4.40359 0.014731 4.21671 0.0770651C4.02983 0.139399 3.85706 0.237936 3.70826 0.36705C3.55946 0.496163 3.43756 0.653324 3.3495 0.829557L0.158287 7.21094C0.0702041 7.38716 0.0176949 7.57901 0.00375827 7.77552C-0.0101783 7.97203 0.0147307 8.16937 0.0770627 8.35625C0.139395 8.54314 0.237929 8.71592 0.367038 8.86472C0.496148 9.01352 0.653303 9.13543 0.82953 9.22349L4.24074 10.9298L11.2094 15.9074C11.2602 15.9438 11.3175 15.9701 11.3782 15.9849L19.3781 17.9849C19.4613 18.0067 19.5488 18.0067 19.632 17.9848C19.7152 17.9629 19.7914 17.9199 19.8531 17.8599L26.7955 10.9173L30.1705 9.22974C30.3467 9.14168 30.5039 9.01977 30.633 8.87097C30.7621 8.72217 30.8606 8.54939 30.9229 8.3625C30.9853 8.17562 31.0102 7.97828 30.9962 7.78177C30.9823 7.58526 30.9298 7.39341 30.8417 7.21719L30.8405 7.21094Z" fill={color}/>
  </svg>
);

// ============ Sub-Components ============

// Individual indicator for "Vos Chiffres" section (blue)
function YourFiguresIndicator({ indicator, value, params, isBlurred, icon: Icon }) {
  const label = typeof indicator.label === 'function'
    ? indicator.label(params)
    : indicator.label;
  const explanation = typeof indicator.explanation === 'function'
    ? indicator.explanation(params)
    : indicator.explanation;

  return (
    <div className="results-figure-item">
      <div className="results-figure-amount-row">
        <div className="results-figure-icon">
          <Icon color="#6DC0FF" />
        </div>
        <div className={isBlurred ? 'results-figure-amount results-blurred' : 'results-figure-amount'}>
          {formatValue(value, indicator.format)}
        </div>
      </div>
      <div className="results-figure-label">{label}</div>
      {explanation && (
        <div className="results-figure-explanation" dangerouslySetInnerHTML={{
          __html: explanation.replace(/(\d+[\s,]?\d*[€%]?)/g, '<span class="results-text-blue">$1</span>')
        }} />
      )}
    </div>
  );
}

// Volume indicator card (green) - for projections
function VolumeCard({ indicator, value, params, isBlurred }) {
  const label = typeof indicator.label === 'function'
    ? indicator.label(params)
    : indicator.label;
  const explanation = typeof indicator.explanation === 'function'
    ? indicator.explanation(params)
    : indicator.explanation;

  return (
    <div className="results-collaboration-item">
      <div className="results-collaboration-amount-row">
        <div className="results-collaboration-icon">
          <IconHandshake color="#209C01" />
        </div>
        <div className={isBlurred ? 'results-collaboration-amount results-blurred' : 'results-collaboration-amount'}>
          {formatValue(value, indicator.format)}
        </div>
      </div>
      <div className="results-collaboration-label">{label}</div>
      {explanation && (
        <div className="results-collaboration-explanation" dangerouslySetInnerHTML={{
          __html: explanation.replace(/(\d+[\s,]?\d*[€%]?)/g, '<strong class="results-text-blue-italic">$1</strong>')
        }} />
      )}
    </div>
  );
}

// Value indicator card with progress bar (green) - for projections
function ValueCard({ indicator, value, params, computedValues, isBlurred }) {
  const description = typeof indicator.description === 'function'
    ? indicator.description(params, computedValues)
    : indicator.description;

  const footnote = typeof indicator.footnote === 'function'
    ? indicator.footnote(params)
    : indicator.footnote;

  return (
    <div className="results-economic-card">
      <div className="results-economic-amount-row">
        <div className="results-economic-icon">
          {indicator.key === 'valuationGain' ? <IconGrowth color="#209C01" /> : <IconMoney color="#209C01" />}
        </div>
        <div className={isBlurred ? 'results-economic-amount results-blurred' : 'results-economic-amount'}>
          {formatValue(value, indicator.format)}
        </div>
      </div>
      <div className="results-economic-progress">
        <div
          className="results-economic-progress-bar"
          style={{ width: `${indicator.progressWidth || 50}%` }}
        />
      </div>
      {description && (
        <div className="results-economic-description" dangerouslySetInnerHTML={{
          __html: description
            .replace(/(\d+[\s,-]?\d*)/g, '<span class="results-text-green">$1</span>')
            .replace(/(\d+%)/g, '<span class="results-text-blue-italic">$1</span>')
        }} />
      )}
      {footnote && (
        <div className="results-economic-footnote" dangerouslySetInnerHTML={{
          __html: footnote.replace(/(x\d+|×\d+)/gi, '<span class="results-text-blue-italic">$1</span>')
        }} />
      )}
    </div>
  );
}

// ============ Main Component ============

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
  const config = getModelConfig(modelKey);
  const model = modelMetadata[modelKey];

  // Calculate all values based on config
  const computedValues = React.useMemo(() => {
    if (!parameters) return null;

    const values = {
      yourFiguresValue: {},
      yourFiguresVolume: {},
      projectionsVolume: {},
      projectionsValue: {}
    };

    // Calculate "Vos Chiffres - Valeur"
    config.yourFigures.value.forEach(indicator => {
      values.yourFiguresValue[indicator.key] = indicator.getValue(parameters, estimation);
    });

    // Calculate "Vos Chiffres - Volume"
    config.yourFigures.volume.forEach(indicator => {
      values.yourFiguresVolume[indicator.key] = indicator.getValue(parameters, estimation);
    });

    // Calculate projections volume indicators
    config.projections.volume.forEach(indicator => {
      values.projectionsVolume[indicator.key] = indicator.getValue(parameters);
    });

    // Context for value calculations
    const intros = typeof values.projectionsVolume.additionalIntros === 'object'
      ? values.projectionsVolume.additionalIntros.max
      : values.projectionsVolume.additionalIntros;
    const clientsPerQuarter = typeof values.projectionsVolume.clientsPerQuarter === 'object'
      ? values.projectionsVolume.clientsPerQuarter
      : values.projectionsVolume.clientsPerQuarter;

    const clientsRange = typeof clientsPerQuarter === 'object'
      ? `${clientsPerQuarter.min} - ${clientsPerQuarter.max}`
      : clientsPerQuarter ? `${Math.floor(clientsPerQuarter * 0.9)} - ${Math.ceil(clientsPerQuarter * 1.1)}` : '—';

    values.computeContext = { intros, clientsRange };

    // Calculate projections value indicators
    config.projections.value.forEach(indicator => {
      values.projectionsValue[indicator.key] = indicator.getValue(parameters, values.computeContext);
    });

    return values;
  }, [parameters, estimation, config]);

  if (!computedValues) return null;

  const icons = [IconMoney, IconContract, IconDealflow];

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

        {/* ===================== SECTION: VOS CHIFFRES ===================== */}
        <h2 className="results-main-section-title results-text-blue">{config.sectionTitles.yourFiguresMain}</h2>

        {/* Card: Valeur d'un client */}
        <div className="results-your-figures-section">
          <div className="results-your-figures-card">
            <h3 className="results-section-title-small">{config.sectionTitles.yourFiguresValue}</h3>
            <div className="results-figures-list">
              {config.yourFigures.value.map((indicator, index) => (
                <YourFiguresIndicator
                  key={indicator.key}
                  indicator={indicator}
                  value={computedValues.yourFiguresValue[indicator.key]}
                  params={parameters}
                  isBlurred={isBlurred}
                  icon={icons[index % icons.length]}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Card: Volume d'affaires actuel */}
        <div className="results-your-figures-section">
          <div className="results-your-figures-card">
            <h3 className="results-section-title-small">{config.sectionTitles.yourFiguresVolume}</h3>
            <div className="results-figures-list">
              {config.yourFigures.volume.map((indicator, index) => (
                <YourFiguresIndicator
                  key={indicator.key}
                  indicator={indicator}
                  value={computedValues.yourFiguresVolume[indicator.key]}
                  params={parameters}
                  isBlurred={isBlurred}
                  icon={IconDealflow}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ===================== SECTION: PROJECTION INDICATIVE ===================== */}
        <h2 className="results-main-section-title results-text-green">{config.sectionTitles.projectionsMain}</h2>

        {/* Card: Le volume d'affaires potentiel */}
        <div className="results-collaboration-section">
          <div className="results-collaboration-card">
            <h3 className="results-section-title-small">{config.sectionTitles.projectionsVolume}</h3>
            <div className="results-collaboration-grid">
              {config.projections.volume.map((indicator, index) => (
                <React.Fragment key={indicator.key}>
                  {index > 0 && <div className="results-collaboration-arrow">≈</div>}
                  <VolumeCard
                    indicator={indicator}
                    value={computedValues.projectionsVolume[indicator.key]}
                    params={parameters}
                    isBlurred={isBlurred}
                  />
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        {/* Card: Valeur d'un trimestre de collaboration */}
        <div className="results-economic-value-section">
          <div className="results-economic-value-card">
            <h3 className="results-section-title-small">{config.sectionTitles.projectionsValue}</h3>
            <div className="results-economic-cards">
              {config.projections.value.map(indicator => (
                <ValueCard
                  key={indicator.key}
                  indicator={indicator}
                  value={computedValues.projectionsValue[indicator.key]}
                  params={parameters}
                  computedValues={computedValues.computeContext}
                  isBlurred={isBlurred}
                />
              ))}
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

        {/* Section: QUI SOMMES-NOUS ? */}
        <div className="results-who-section">
          <div className="results-who-content-wrapper">
            <div className="results-who-content">
              <h2 className="results-who-title">Qui sommes-nous ?</h2>
              <p className="results-who-text-large">
                Arbitrage Partners intervient comme une boutique de dealflows qui vous apporte un pipeline d'introductions qualifié chaque trimestre auprès de vos décideurs cibles.
              </p>
              <p className="results-who-text">
                Après un échange avec vous, nous identifions un nombre précis d'introductions qualifiées à apporter sur le trimestre. Ce volume est garanti contractuellement. Si l'objectif n'est pas atteint, nous continuons jusqu'à livraison.
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

        {/* Section: LES ENJEUX DE NOS CLIENTS */}
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

        {/* Section: NOS CLIENTS ONT OBTENU */}
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

        {/* Section: CRITÈRES DE COLLABORATION */}
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
              <p>Si vous remplissez ces conditions, nous pouvons effectuer un premier échange pour cadrer votre contexte, évaluer l'accès à vos décideurs et déterminer s'il existe un alignement pour avancer ou non.</p>
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

        {/* Footer */}
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
