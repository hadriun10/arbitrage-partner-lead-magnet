import React from 'react';

const MODELS = [
  {
    key: 'recurring',
    title: 'Revenus récurrents',
    examples: 'SaaS, logiciels métiers, services managés, abonnements professionnels'
  },
  {
    key: 'projects',
    title: 'Projets & prestations à forte valeur',
    examples: 'Cabinets de conseil, ingénierie, ESN, BTP privé, intégrateurs ERP'
  },
  {
    key: 'transactions',
    title: 'Transactions & intermédiation',
    examples: 'Boutiques M&A, levée de fonds, brokerage immobilier, advisory transactionnel'
  },
  {
    key: 'financing',
    title: 'Financements & dette privée',
    examples: 'Fonds de dette privée, plateformes de crédit, finance alternative'
  },
  {
    key: 'asset_management',
    title: 'Gestion d’actifs & patrimoine',
    examples: 'Banques privées, CGP, family offices, asset managers'
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
            <div className="model-button-title">{model.title}</div>
            <div className="model-button-examples">{model.examples}</div>
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



