import React, { useState } from 'react';
import { modelMetadata } from './ModelChoiceStep.jsx';

function useFormState(initialValues) {
  const [values, setValues] = useState(initialValues || {});

  const handleChange = (name) => (event) => {
    const { value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  return { values, handleChange, setValues };
}

export function ParametersStep({ modelKey, initialValues, onBack, onSubmit }) {
  const { values, handleChange } = useFormState(initialValues);
  const meta = modelMetadata[modelKey];

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(modelKey, values);
  };

  const title = 'Comprendre votre modèle pour affiner l’estimation';

  return (
    <div className="card">
      <h1 className="card-header-title">{title}</h1>
      <p className="card-header-subtitle">
        Chaque question correspond à un levier économique réel. Répondez avec un ordre de
        grandeur : l’outil appliquera des hypothèses prudentes lorsque des données sont
        manquantes.
      </p>

      <form onSubmit={handleSubmit}>
        {modelKey === 'recurring' && <RecurringSections values={values} onChange={handleChange} />}
        {modelKey === 'projects' && <ProjectsSections values={values} onChange={handleChange} />}
        {modelKey === 'transactions' && (
          <TransactionsSections values={values} onChange={handleChange} />
        )}
        {modelKey === 'financing' && <FinancingSections values={values} onChange={handleChange} />}
        {modelKey === 'asset_management' && (
          <AssetManagementSections values={values} onChange={handleChange} />
        )}

        <div style={{ marginTop: 32 }}>
          <button type="submit" className="primary-button">
            <span>Voir mon estimation</span>
            <span className="primary-button-icon">→</span>
          </button>
        </div>
        <div style={{ marginTop: 12, fontSize: 12, color: 'var(--color-text-muted)' }}>
          Données à titre indicatif, non contractuelles. Vous pourrez affiner les hypothèses lors
          d’un échange avec Arbitrage Partners.
        </div>
        <div style={{ marginTop: 16, fontSize: 12 }}>
          <button
            type="button"
            onClick={onBack}
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              color: 'var(--color-text-muted)',
              textDecoration: 'underline'
            }}
          >
            ← Revenir au choix du modèle économique
          </button>
        </div>
      </form>
    </div>
  );
}

function RecurringSections({ values, onChange }) {
  const setFieldValue = (name, rawValue) => {
    onChange(name)({ target: { value: rawValue } });
  };

  const handleDurationChange = (event) => {
    const raw = event.target.value;
    setFieldValue('contractDurationYears', raw);

    const years = parseFloat(String(raw).replace(',', '.'));
    if (!Number.isNaN(years) && years > 0) {
      const churn = (100 / years).toFixed(1);
      setFieldValue('annualRetentionRate', churn);
    }
  };

  const handleChurnChange = (event) => {
    const raw = event.target.value;
    setFieldValue('annualRetentionRate', raw);

    const churn = parseFloat(String(raw).replace(',', '.'));
    if (!Number.isNaN(churn) && churn > 0) {
      const years = (100 / churn).toFixed(1);
      setFieldValue('contractDurationYears', years);
    }
  };

  return (
    <>
      <div className="section">
        <h2 className="section-title">1. Valeur économique d’un client</h2>
        <div className="field">
          <label className="field-label">
            Chiffre d’affaires annuel moyen par client (€) <span>*</span>
          </label>
          <div className="field-with-unit">
            <input
              type="number"
              className="field-input"
              value={values.annualRevenuePerClient || ''}
              onChange={onChange('annualRevenuePerClient')}
            />
            <span className="field-unit">€</span>
          </div>
        </div>
        <div className="field-grid" style={{ marginTop: 20 }}>
          <div className="field">
            <label className="field-label">Durée moyenne d’un contrat (années)</label>
            <div className="field-with-unit">
              <input
                type="number"
                className="field-input"
                value={values.contractDurationYears || ''}
                onChange={handleDurationChange}
              />
              <span className="field-unit">ans</span>
            </div>
          </div>
          <div className="field">
            <label className="field-label">Churn annuel (%)</label>
            <div className="field-with-unit">
              <input
                type="number"
                className="field-input"
                value={values.annualRetentionRate || ''}
                onChange={handleChurnChange}
              />
              <span className="field-unit">%</span>
            </div>
          </div>
        </div>
        <div className="field-helper" style={{ marginTop: 6 }}>
          Renseignez soit la durée moyenne, soit le churn annuel. L’outil complètera l’autre.
        </div>
        <div className="field" style={{ marginTop: 16 }}>
          <label className="field-label">
            Marge sur un nouveau client (%) <span>*</span>
          </label>
          <div className="field-with-unit">
            <input
              type="number"
              className="field-input"
              value={values.incrementalMargin || ''}
              onChange={onChange('incrementalMargin')}
            />
            <span className="field-unit">%</span>
          </div>
        </div>
      </div>

      <div className="section">
        <h2 className="section-title">2. Potentiel de croissance</h2>
        <div className="field-grid" style={{ gridTemplateColumns: '1fr' }}>
          <div className="field">
            <label className="field-label">
              Introductions qualifiées par mois (meilleur collaborateur)
            </label>
            <div className="field-with-unit">
              <input
                type="number"
                className="field-input"
                value={values.introsPerQuarter || ''}
                onChange={onChange('introsPerQuarter')}
              />
              <span className="field-unit">/ mois</span>
            </div>
            <div className="field-helper">
              Si inconnu, indiquez un ordre de grandeur. L’outil applique un minimum de 1,5× sur
              ce levier.
            </div>
          </div>
          <div className="field">
            <label className="field-label">
              Taux de transformation : introduction qualifiée → client (%)
            </label>
            <div className="field-with-unit">
              <input
                type="number"
                className="field-input"
                value={values.convIntroToClient || ''}
                onChange={onChange('convIntroToClient')}
              />
              <span className="field-unit">%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="section">
        <h2 className="section-title">3. Valorisation</h2>
        <div className="field-grid">
          <div className="field">
            <label className="field-label">
              Multiple de valorisation de l’ARR <span>*</span>
            </label>
            <div className="field-with-unit">
              <input
                type="number"
                className="field-input"
                value={values.arrMultiple || ''}
                onChange={onChange('arrMultiple')}
              />
              <span className="field-unit">x</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function ProjectsSections({ values, onChange }) {
  return (
    <>
      <div className="section">
        <h2 className="section-title">1. Valeur d’un contrat</h2>
        <div className="field-grid">
          <div className="field">
            <label className="field-label">
              Valeur moyenne d’un contrat (€) <span>*</span>
            </label>
            <div className="field-with-unit">
              <input
                type="number"
                className="field-input"
                value={values.avgContractValue || ''}
                onChange={onChange('avgContractValue')}
              />
              <span className="field-unit">€</span>
            </div>
          </div>
          <div className="field">
            <label className="field-label">
              Marge opérationnelle moyenne (%) <span>*</span>
            </label>
            <div className="field-with-unit">
              <input
                type="number"
                className="field-input"
                value={values.avgOperatingMargin || ''}
                onChange={onChange('avgOperatingMargin')}
              />
              <span className="field-unit">%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="section">
        <h2 className="section-title">2. Capacité commerciale</h2>
        <div className="field-grid">
          <div className="field">
            <label className="field-label">Opportunités qualifiées par mois (meilleur collaborateur)</label>
            <div className="field-with-unit">
              <input
                type="number"
                className="field-input"
                value={values.qualifiedOppPerQuarter || ''}
                onChange={onChange('qualifiedOppPerQuarter')}
              />
              <span className="field-unit">/ mois</span>
            </div>
          </div>
          <div className="field">
            <label className="field-label">
              Taux de transformation : opportunité → client (%)
            </label>
            <div className="field-with-unit">
              <input
                type="number"
                className="field-input"
                value={values.convOppToClient || ''}
                onChange={onChange('convOppToClient')}
              />
              <span className="field-unit">%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="section">
        <h2 className="section-title">3. Valorisation</h2>
        <div className="field-grid">
          <div className="field">
            <label className="field-label">
              Multiple d’EBITDA observé <span>*</span>
            </label>
            <div className="field-with-unit">
              <input
                type="number"
                className="field-input"
                value={values.ebitdaMultiple || ''}
                onChange={onChange('ebitdaMultiple')}
              />
              <span className="field-unit">x</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function TransactionsSections({ values, onChange }) {
  return (
    <>
      <div className="section">
        <h2 className="section-title">1. Valeur d’un mandat</h2>
        <div className="field-grid">
          <div className="field">
            <label className="field-label">
              Valorisation moyenne des transactions (€) <span>*</span>
            </label>
            <div className="field-with-unit">
              <input
                type="number"
                className="field-input"
                value={values.avgTransactionValue || ''}
                onChange={onChange('avgTransactionValue')}
              />
              <span className="field-unit">€</span>
            </div>
          </div>
          <div className="field">
            <label className="field-label">
              Success fee moyen (%) <span>*</span>
            </label>
            <div className="field-with-unit">
              <input
                type="number"
                className="field-input"
                value={values.successFee || ''}
                onChange={onChange('successFee')}
              />
              <span className="field-unit">%</span>
            </div>
          </div>
          <div className="field">
            <label className="field-label">Work fees / retainers (€)</label>
            <div className="field-with-unit">
              <input
                type="number"
                className="field-input"
                value={values.workFees || ''}
                onChange={onChange('workFees')}
              />
              <span className="field-unit">€</span>
            </div>
          </div>
          <div className="field">
            <label className="field-label">
              Probabilité de closing (%) <span>*</span>
            </label>
            <div className="field-with-unit">
              <input
                type="number"
                className="field-input"
                value={values.closingProbability || ''}
                onChange={onChange('closingProbability')}
              />
              <span className="field-unit">%</span>
            </div>
          </div>
          <div className="field">
            <label className="field-label">
              Durée moyenne d’un mandat (mois) <span>*</span>
            </label>
            <div className="field-with-unit">
              <input
                type="number"
                className="field-input"
                value={values.mandateDurationMonths || ''}
                onChange={onChange('mandateDurationMonths')}
              />
              <span className="field-unit">mois</span>
            </div>
          </div>
          <div className="field">
            <label className="field-label">
              Marge opérationnelle nette (%) <span>*</span>
            </label>
            <div className="field-with-unit">
              <input
                type="number"
                className="field-input"
                value={values.netMargin || ''}
                onChange={onChange('netMargin')}
              />
              <span className="field-unit">%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="section">
        <h2 className="section-title">2. Pipeline</h2>
        <div className="field-grid">
          <div className="field">
            <label className="field-label">Introductions qualifiées par mois</label>
            <div className="field-with-unit">
              <input
                type="number"
                className="field-input"
                value={values.introsPerQuarter || ''}
                onChange={onChange('introsPerQuarter')}
              />
              <span className="field-unit">/ mois</span>
            </div>
          </div>
          <div className="field">
            <label className="field-label">
              Taux de transformation : introduction → mandat (%)
            </label>
            <div className="field-with-unit">
              <input
                type="number"
                className="field-input"
                value={values.convIntroToMandate || ''}
                onChange={onChange('convIntroToMandate')}
              />
              <span className="field-unit">%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="section">
        <h2 className="section-title">3. Valorisation</h2>
        <div className="field-grid">
          <div className="field">
            <label className="field-label">
              Multiple d’EBITDA (small / mid-cap) <span>*</span>
            </label>
            <div className="field-with-unit">
              <input
                type="number"
                className="field-input"
                value={values.ebitdaMultiple || ''}
                onChange={onChange('ebitdaMultiple')}
              />
              <span className="field-unit">x</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function FinancingSections({ values, onChange }) {
  return (
    <>
      <div className="section">
        <h2 className="section-title">1. Valeur d’une opération</h2>
        <div className="field-grid">
          <div className="field">
            <label className="field-label">
              Montant moyen financé (€) <span>*</span>
            </label>
            <div className="field-with-unit">
              <input
                type="number"
                className="field-input"
                value={values.avgFinancedAmount || ''}
                onChange={onChange('avgFinancedAmount')}
              />
              <span className="field-unit">€</span>
            </div>
          </div>
          <div className="field">
            <label className="field-label">
              Spread annuel capté (%) <span>*</span>
            </label>
            <div className="field-with-unit">
              <input
                type="number"
                className="field-input"
                value={values.annualSpread || ''}
                onChange={onChange('annualSpread')}
              />
              <span className="field-unit">%</span>
            </div>
          </div>
          <div className="field">
            <label className="field-label">
              Durée du financement (années) <span>*</span>
            </label>
            <div className="field-with-unit">
              <input
                type="number"
                className="field-input"
                value={values.financingDurationYears || ''}
                onChange={onChange('financingDurationYears')}
              />
              <span className="field-unit">ans</span>
            </div>
          </div>
          <div className="field">
            <label className="field-label">Frais d’arrangement (€)</label>
            <div className="field-with-unit">
              <input
                type="number"
                className="field-input"
                value={values.arrangementFees || ''}
                onChange={onChange('arrangementFees')}
              />
              <span className="field-unit">€</span>
            </div>
          </div>
          <div className="field">
            <label className="field-label">Frais de structuration (€)</label>
            <div className="field-with-unit">
              <input
                type="number"
                className="field-input"
                value={values.structuringFees || ''}
                onChange={onChange('structuringFees')}
              />
              <span className="field-unit">€</span>
            </div>
          </div>
          <div className="field">
            <label className="field-label">Frais de servicing annuels (€)</label>
            <div className="field-with-unit">
              <input
                type="number"
                className="field-input"
                value={values.servicingFeesAnnual || ''}
                onChange={onChange('servicingFeesAnnual')}
              />
              <span className="field-unit">€</span>
            </div>
          </div>
          <div className="field">
            <label className="field-label">
              Marge opérationnelle nette (%) <span>*</span>
            </label>
            <div className="field-with-unit">
              <input
                type="number"
                className="field-input"
                value={values.netMargin || ''}
                onChange={onChange('netMargin')}
              />
              <span className="field-unit">%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="section">
        <h2 className="section-title">2. Pipeline</h2>
        <div className="field-grid">
          <div className="field">
            <label className="field-label">Introductions qualifiées par mois</label>
            <div className="field-with-unit">
              <input
                type="number"
                className="field-input"
                value={values.introsPerQuarter || ''}
                onChange={onChange('introsPerQuarter')}
              />
              <span className="field-unit">/ mois</span>
            </div>
          </div>
          <div className="field">
            <label className="field-label">
              Taux de transformation : introduction → financement (%)
            </label>
            <div className="field-with-unit">
              <input
                type="number"
                className="field-input"
                value={values.convIntroToFinancing || ''}
                onChange={onChange('convIntroToFinancing')}
              />
              <span className="field-unit">%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="section">
        <h2 className="section-title">3. Valorisation</h2>
        <div className="field-grid">
          <div className="field">
            <label className="field-label">
              Multiple d’EBITDA institutionnel <span>*</span>
            </label>
            <div className="field-with-unit">
              <input
                type="number"
                className="field-input"
                value={values.ebitdaMultiple || ''}
                onChange={onChange('ebitdaMultiple')}
              />
              <span className="field-unit">x</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function AssetManagementSections({ values, onChange }) {
  return (
    <>
      <div className="section">
        <h2 className="section-title">1. Nouvelle relation</h2>
        <div className="field-grid">
          <div className="field">
            <label className="field-label">
              AUM initial moyen (€) <span>*</span>
            </label>
            <div className="field-with-unit">
              <input
                type="number"
                className="field-input"
                value={values.initialAum || ''}
                onChange={onChange('initialAum')}
              />
              <span className="field-unit">€</span>
            </div>
          </div>
          <div className="field">
            <label className="field-label">
              Management fee annuel (%) <span>*</span>
            </label>
            <div className="field-with-unit">
              <input
                type="number"
                className="field-input"
                value={values.mgmtFeeAnnual || ''}
                onChange={onChange('mgmtFeeAnnual')}
              />
              <span className="field-unit">%</span>
            </div>
          </div>
          <div className="field">
            <label className="field-label">Performance fee (%) (optionnel)</label>
            <div className="field-with-unit">
              <input
                type="number"
                className="field-input"
                value={values.perfFee || ''}
                onChange={onChange('perfFee')}
              />
              <span className="field-unit">%</span>
            </div>
          </div>
          <div className="field">
            <label className="field-label">Commissions additionnelles (%)</label>
            <div className="field-with-unit">
              <input
                type="number"
                className="field-input"
                value={values.additionalCommissions || ''}
                onChange={onChange('additionalCommissions')}
              />
              <span className="field-unit">%</span>
            </div>
          </div>
          <div className="field">
            <label className="field-label">
              Durée moyenne de relation (années) <span>*</span>
            </label>
            <div className="field-with-unit">
              <input
                type="number"
                className="field-input"
                value={values.relationshipDurationYears || ''}
                onChange={onChange('relationshipDurationYears')}
              />
              <span className="field-unit">ans</span>
            </div>
          </div>
          <div className="field">
            <label className="field-label">
              Marge opérationnelle nette (%) <span>*</span>
            </label>
            <div className="field-with-unit">
              <input
                type="number"
                className="field-input"
                value={values.netMargin || ''}
                onChange={onChange('netMargin')}
              />
              <span className="field-unit">%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="section">
        <h2 className="section-title">2. Pipeline</h2>
        <div className="field-grid">
          <div className="field">
            <label className="field-label">Introductions qualifiées par mois</label>
            <div className="field-with-unit">
              <input
                type="number"
                className="field-input"
                value={values.introsPerQuarter || ''}
                onChange={onChange('introsPerQuarter')}
              />
              <span className="field-unit">/ mois</span>
            </div>
          </div>
          <div className="field">
            <label className="field-label">
              Taux de transformation : introduction → relation (%)
            </label>
            <div className="field-with-unit">
              <input
                type="number"
                className="field-input"
                value={values.convIntroToRelationship || ''}
                onChange={onChange('convIntroToRelationship')}
              />
              <span className="field-unit">%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="section">
        <h2 className="section-title">3. Valorisation</h2>
        <div className="field-grid">
          <div className="field">
            <label className="field-label">
              Management fees annualisés × multiple (2× à 4×) <span>*</span>
            </label>
            <div className="field-with-unit">
              <input
                type="number"
                className="field-input"
                value={values.mgmtFeesMultiple || ''}
                onChange={onChange('mgmtFeesMultiple')}
              />
              <span className="field-unit">x</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}


