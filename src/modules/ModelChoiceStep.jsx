import React from 'react';

const MODELS = [
  {
    key: 'recurring',
    title: "Revenus récurrents",
    examples: "SaaS, logiciels métiers, services managés, abonnements professionnels",
    valuation: "Multiple d'ARR",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 3v18h18"/>
        <path d="M18 17V9"/>
        <path d="M13 17V5"/>
        <path d="M8 17v-3"/>
      </svg>
    )
  },
  {
    key: 'projects',
    title: "Projets & prestations à forte valeur",
    examples: "Cabinets de conseil, ingénierie, ESN, BTP privé, intégrateurs ERP",
    valuation: "Multiple d'EBITDA",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
        <polyline points="10 9 9 9 8 9"/>
      </svg>
    )
  },
  {
    key: 'transactions',
    title: "Transactions & intermédiation",
    examples: "Boutiques M&A, cabinets de levée de fonds, brokerage immobilier, advisory transactionnel",
    valuation: "Multiple d'EBITDA",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    )
  },
  {
    key: 'financing',
    title: "Financements & dette privée",
    examples: "Fonds de dette privée, plateformes de crédit, finance alternative",
    valuation: "Multiple d'EBITDA",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23"/>
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
      </svg>
    )
  },
  {
    key: 'asset_management',
    title: "Gestion d'actifs & patrimoine",
    examples: "Banques privées, wealth managers, family offices, cabinets patrimoniaux",
    valuation: "Multiple des management fees annualisés",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <path d="M12 6v6l4 2"/>
      </svg>
    )
  }
];

export function ModelChoiceStep({ selectedModel, onSelectModel }) {
  return (
    <div className="card">
      <h1 className="card-header-title">Choix du modèle économique</h1>
      <p className="card-header-subtitle">
        Sélectionnez la structure de revenus qui décrit le mieux votre activité principale.
      </p>

      <div className="model-buttons-row">
        {MODELS.map((model) => (
          <button
            key={model.key}
            type="button"
            className={
              'model-button' + (selectedModel === model.key ? ' selected' : '')
            }
            onClick={() => onSelectModel(model.key)}
          >
            <div className="model-button-icon">{model.icon}</div>
            <div className="model-button-title">{model.title}</div>
            <div className="model-button-examples">{model.examples}</div>
            <div className="model-button-valuation">Valorisation : {model.valuation}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

export const modelMetadata = MODELS.reduce((acc, model) => {
  acc[model.key] = model;
  return acc;
}, {});




