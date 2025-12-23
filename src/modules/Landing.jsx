import React from 'react';

export function Landing({ onStart }) {
  return (
    <div className="card">
      <h1 className="card-header-title">
        Estimez l’impact financier
        <br />
        d’une collaboration avec Arbitrage Partners
      </h1>
      <p className="card-header-subtitle">
        Obtenez une estimation immédiate du revenu additionnel et du gain de valorisation que
        votre entreprise pourrait activer.
      </p>

      <div className="tagline-row">
        <div>Simulation gratuite en 2 minutes</div>
        <div>Données confidentielles</div>
        <div>Aucun engagement</div>
      </div>

      <div style={{ maxWidth: 520, margin: '0 auto' }}>
        <button type="button" className="primary-button" onClick={onStart}>
          <span>Commencer mon estimation</span>
          <span className="primary-button-icon">→</span>
        </button>

        <p className="legal-text">
          <span className="legal-text-strong">Basé sur des données réelles.</span> L’estimation
          repose sur vos données, sur des hypothèses conservatrices et sur des multiples
          sectoriels observés. Elle est indicative, non contractuelle, et conforme aux pratiques
          professionnelles.
        </p>
      </div>
    </div>
  );
}


