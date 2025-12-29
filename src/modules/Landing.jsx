import React from 'react';

export function Landing({ onStart }) {
  return (
    <div className="landing-container">
      <div className="landing-hero">
        <div className="landing-logo">
          <svg width="80" height="80" viewBox="0 0 100 100" fill="none">
            <circle cx="50" cy="50" r="8" fill="#103126"/>
            <circle cx="50" cy="20" r="10" fill="#103126"/>
            <circle cx="73.5" cy="30" r="10" fill="#103126"/>
            <circle cx="83.5" cy="55" r="10" fill="#103126"/>
            <circle cx="73.5" cy="80" r="10" fill="#103126"/>
            <circle cx="26.5" cy="80" r="10" fill="#103126"/>
            <circle cx="16.5" cy="55" r="10" fill="#103126"/>
            <circle cx="26.5" cy="30" r="10" fill="#103126"/>
          </svg>
        </div>
        
        <h1 className="card-header-title">
          Estimez l'impact financier
          <br />
          d'une collaboration avec Arbitrage Partners
        </h1>
        <p className="card-header-subtitle">
          Obtenez une estimation immédiate du revenu additionnel et du gain de valorisation que
          votre entreprise pourrait activer.
        </p>
      </div>

      <div className="landing-button-wrapper">
        <button type="button" className="primary-button" onClick={onStart}>
          <span>Commencer mon estimation</span>
          <span className="primary-button-icon">→</span>
        </button>

        <div className="tagline-row">
          <div className="tagline-item">
            <div className="tagline-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
              </svg>
            </div>
            <div className="tagline-text">Simulation gratuite<br/>en 2 minutes</div>
          </div>
          <div className="tagline-item">
            <div className="tagline-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
            </div>
            <div className="tagline-text">Données<br/>confidentielles</div>
          </div>
          <div className="tagline-item">
            <div className="tagline-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
            <div className="tagline-text">Aucun<br/>engagement</div>
          </div>
        </div>

        <p className="legal-text">
          <span className="legal-text-strong">Basé sur des données réelles.</span> L'estimation
          repose sur vos données, sur des hypothèses conservatrices et sur des multiples
          sectoriels observés. Elle est indicative, non contractuelle, et conforme aux pratiques
          professionnelles.
        </p>
      </div>
    </div>
  );
}


