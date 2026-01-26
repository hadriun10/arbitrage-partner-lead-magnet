import React, { useState } from 'react';

export function ContactModal({ onClose, onSubmit }) {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    company: '',
    role: ''
  });

  const handleChange = (field) => (event) => {
    const { value } = event.target;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(form);
  };

  return (
    <div className="contact-modal-backdrop" onClick={onClose}>
      <div
        className="contact-modal-panel"
        onClick={(event) => {
          event.stopPropagation();
        }}
      >
        <button type="button" className="contact-modal-close" onClick={onClose}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <form onSubmit={handleSubmit}>
          <h2 className="contact-modal-title">Déverrouiller le détail des calculs</h2>
          <p className="contact-modal-subtitle">
            Laissez-nous quelques informations de contexte. Nous ne vous contacterons que si cela fait sens au regard de votre situation.
          </p>

          <div className="contact-modal-fields">
            <div className="contact-field">
              <label className="contact-field-label">Prénom</label>
              <input
                type="text"
                className="contact-field-input"
                placeholder="Votre prénom"
                value={form.fullName}
                onChange={handleChange('fullName')}
              />
            </div>

            <div className="contact-field">
              <label className="contact-field-label">Email professionnel</label>
              <input
                type="email"
                className="contact-field-input"
                placeholder="Votre email"
                value={form.email}
                onChange={handleChange('email')}
              />
            </div>

            <div className="contact-field">
              <label className="contact-field-label">Entreprise</label>
              <input
                type="text"
                className="contact-field-input"
                placeholder="Votre entreprise"
                value={form.company}
                onChange={handleChange('company')}
              />
            </div>

            <div className="contact-field">
              <label className="contact-field-label">Rôle</label>
              <input
                type="text"
                className="contact-field-input"
                placeholder="Votre rôle"
                value={form.role}
                onChange={handleChange('role')}
              />
            </div>
          </div>

          <div className="contact-modal-actions">
            <button type="submit" className="contact-modal-button">
              <span>Débloquer l'accès complet</span>
              <span>→</span>
            </button>
          </div>

          <div className="contact-modal-footer">
            En cliquant sur 'Débloquer l'accès complet', vous acceptez nos{' '}
            <a href="#" className="contact-modal-link">conditions générales</a> et notre{' '}
            <a href="#" className="contact-modal-link">politique de confidentialité</a>.
          </div>
        </form>
      </div>
    </div>
  );
}



