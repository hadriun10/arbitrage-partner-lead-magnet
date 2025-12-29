import React, { useState, useMemo } from 'react';
import { modelMetadata } from './ModelChoiceStep.jsx';

function useFormState(initialValues) {
  const [values, setValues] = useState(initialValues || {});

  const handleChange = (name) => (event) => {
    const { value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  return { values, handleChange, setValues };
}

// Configuration des champs obligatoires par section pour chaque modèle
const REQUIRED_FIELDS_BY_MODEL = {
  recurring: [
    ['annualRevenuePerClient', 'incrementalMargin'], // Section 1
    [], // Section 2 (pas de champs obligatoires)
    ['arrMultiple'] // Section 3
  ],
  projects: [
    ['avgContractValue', 'avgOperatingMargin'], // Section 1
    [], // Section 2
    ['ebitdaMultiple'] // Section 3
  ],
  transactions: [
    ['avgTransactionValue', 'successFee'], // Section 1
    [], // Section 2
    ['ebitdaMultiple'] // Section 3
  ],
  financing: [
    ['avgFinancedAmount', 'annualSpread'], // Section 1
    [], // Section 2
    ['ebitdaMultiple'] // Section 3
  ],
  asset_management: [
    ['initialAum', 'mgmtFeeAnnual'], // Section 1
    [], // Section 2
    ['mgmtFeesMultiple'] // Section 3
  ]
};

// Configuration de tous les champs (obligatoires + optionnels) par section pour chaque modèle
const ALL_FIELDS_BY_MODEL = {
  recurring: [
    ['annualRevenuePerClient', 'incrementalMargin', 'contractDurationYears', 'annualRetentionRate'], // Section 1
    ['introsPerQuarter', 'convIntroToClient'], // Section 2
    ['arrMultiple'] // Section 3
  ],
  projects: [
    ['avgContractValue', 'avgOperatingMargin'], // Section 1
    ['qualifiedOppPerQuarter', 'convOppToClient'], // Section 2
    ['ebitdaMultiple'] // Section 3
  ],
  transactions: [
    ['avgTransactionValue', 'successFee', 'workFees'], // Section 1
    ['introsPerQuarter', 'convIntroToMandate'], // Section 2
    ['ebitdaMultiple'] // Section 3
  ],
  financing: [
    ['avgFinancedAmount', 'annualSpread', 'netMargin'], // Section 1
    ['introsPerQuarter', 'convIntroToFinancing'], // Section 2
    ['ebitdaMultiple'] // Section 3
  ],
  asset_management: [
    ['initialAum', 'mgmtFeeAnnual', 'performanceFee'], // Section 1
    ['introsPerQuarter', 'convIntroToRelationship'], // Section 2
    ['mgmtFeesMultiple'] // Section 3
  ]
};

function useProgressiveSections(modelKey, values) {
  const requiredFields = REQUIRED_FIELDS_BY_MODEL[modelKey] || [];
  const allFields = ALL_FIELDS_BY_MODEL[modelKey] || [];
  
  const visibleSections = useMemo(() => {
    const visible = [];
    
    for (let i = 0; i < requiredFields.length; i++) {
      // La première section est toujours visible
      if (i === 0) {
        visible.push(true);
        continue;
      }
      
      // Pour les sections suivantes, vérifier que la section précédente est visible
      const previousSectionVisible = visible[i - 1];
      
      if (!previousSectionVisible) {
        visible.push(false);
        continue;
      }
      
      // Vérifier que la section précédente (immédiate) est complète
      const previousRequiredFields = requiredFields[i - 1];
      const previousAllFields = allFields[i - 1] || [];
      
      let isPreviousComplete = false;
      
      // Si la section précédente a des champs obligatoires, vérifier qu'ils sont tous remplis
      if (previousRequiredFields.length > 0) {
        isPreviousComplete = previousRequiredFields.every(field => {
          const value = values[field];
          return value !== undefined && value !== null && value !== '';
        });
      } else {
        // Si la section précédente n'a pas de champs obligatoires,
        // vérifier qu'au moins un champ (optionnel) a été rempli
        isPreviousComplete = previousAllFields.some(field => {
          const value = values[field];
          return value !== undefined && value !== null && value !== '';
        });
      }
      
      // La section est visible si la section précédente est visible ET complète
      visible.push(isPreviousComplete);
    }
    
    return visible;
  }, [modelKey, values, requiredFields, allFields]);
  
  const isFormComplete = useMemo(() => {
    return requiredFields.every((sectionFields, index) => {
      if (!visibleSections[index]) return false;
      return sectionFields.every(field => {
        const value = values[field];
        return value !== undefined && value !== null && value !== '';
      });
    });
  }, [values, requiredFields, visibleSections]);
  
  return { visibleSections, isFormComplete };
}

export function ParametersStep({ modelKey, initialValues, onBack, onSubmit }) {
  const { values, handleChange } = useFormState(initialValues);
  const { visibleSections, isFormComplete } = useProgressiveSections(modelKey, values);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (isFormComplete) {
      onSubmit(modelKey, values);
    }
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
        {modelKey === 'recurring' && (
          <RecurringSections values={values} onChange={handleChange} visibleSections={visibleSections} />
        )}
        {modelKey === 'projects' && (
          <ProjectsSections values={values} onChange={handleChange} visibleSections={visibleSections} />
        )}
        {modelKey === 'transactions' && (
          <TransactionsSections values={values} onChange={handleChange} visibleSections={visibleSections} />
        )}
        {modelKey === 'financing' && (
          <FinancingSections values={values} onChange={handleChange} visibleSections={visibleSections} />
        )}
        {modelKey === 'asset_management' && (
          <AssetManagementSections values={values} onChange={handleChange} visibleSections={visibleSections} />
        )}

        <div style={{ marginTop: 32 }}>
          <button 
            type="submit" 
            className={`primary-button ${!isFormComplete ? 'primary-button-disabled' : ''}`}
            disabled={!isFormComplete}
          >
            <span>Voir mon estimation</span>
            <span className="primary-button-icon">→</span>
          </button>
        </div>
        <div style={{ marginTop: 12, fontSize: 12, color: 'rgba(255, 255, 255, 0.6)' }}>
          Données à titre indicatif, non contractuelles. Vous pourrez affiner les hypothèses lors
          d'un échange avec Arbitrage Partners.
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
              color: 'rgba(255, 255, 255, 0.6)',
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

function RecurringSections({ values, onChange, visibleSections = [true, true, true] }) {
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
      {visibleSections[0] && (
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
      )}

      {visibleSections[1] && (
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
      )}

      {visibleSections[2] && (
      <div className="section">
        <h2 className="section-title">3. Valorisation</h2>
        <div className="field-grid">
          <div className="field">
            <label className="field-label">
              Multiple de valorisation de l'ARR <span>*</span>
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
      )}
    </>
  );
}

function ProjectsSections({ values, onChange, visibleSections = [true, true, true] }) {
  return (
    <>
      {visibleSections[0] && (
      <div className="section">
        <h2 className="section-title">1. Valeur d'un contrat</h2>
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
      )}

      {visibleSections[1] && (
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
      )}

      {visibleSections[2] && (
      <div className="section">
        <h2 className="section-title">3. Valorisation</h2>
        <div className="field-grid">
          <div className="field">
            <label className="field-label">
              Multiple d'EBITDA observé <span>*</span>
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
      )}
    </>
  );
}

function TransactionsSections({ values, onChange, visibleSections = [true, true, true] }) {
  return (
    <>
      {visibleSections[0] && (
      <div className="section">
        <h2 className="section-title">1. Valeur d'un mandat</h2>
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
      )}

      {visibleSections[1] && (
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
      )}

      {visibleSections[2] && (
      <div className="section">
        <h2 className="section-title">3. Valorisation</h2>
        <div className="field-grid">
          <div className="field">
            <label className="field-label">
              Multiple d'EBITDA (small / mid-cap) <span>*</span>
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
      )}
    </>
  );
}

function FinancingSections({ values, onChange, visibleSections = [true, true, true] }) {
  return (
    <>
      {visibleSections[0] && (
      <div className="section">
        <h2 className="section-title">1. Valeur d'une opération</h2>
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
      )}

      {visibleSections[1] && (
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
      )}

      {visibleSections[2] && (
      <div className="section">
        <h2 className="section-title">3. Valorisation</h2>
        <div className="field-grid">
          <div className="field">
            <label className="field-label">
              Multiple d'EBITDA institutionnel <span>*</span>
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
      )}
    </>
  );
}

function AssetManagementSections({ values, onChange, visibleSections = [true, true, true] }) {
  return (
    <>
      {visibleSections[0] && (
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
      )}

      {visibleSections[1] && (
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
      )}

      {visibleSections[2] && (
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
      )}
    </>
  );
}


