import React from 'react';

export function Landing({ onStart }) {
  return (
    <div className="landing-container">
      <div className="landing-hero">
        <div className="landing-logo">
          <img src="/logo_arbrigrage_blanc.png" alt="Arbitrage Partners" width="133" height="36" />
        </div>
        <div className="landing-image">
          <img src="/image 4700.png" alt="" width="307" height="84" />
        </div>
        
        <h1 className="landing-title">
          Estimez le gain économique d'une
          <br />
          collaboration avec Arbitrage Partners
        </h1>
        <p className="landing-subtitle">
          Obtenez une estimation immédiate du revenu additionnel et du gain de valorisation
          <br />
          que votre entreprise pourrait activer sur un trimestre.
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

        <div className="landing-legal-card">
          <div className="landing-legal-title">BASÉ SUR DES DONNÉES RÉELLES</div>
          <div className="landing-legal-text">
            L'estimation repose sur vos données, sur des hypothèses conservatrices et sur des multiples sectoriels observés. Elle est indicative, non contractuelle, et conforme aux pratiques professionnelles.
          </div>
        </div>
      </div>
    </div>
  );
}


