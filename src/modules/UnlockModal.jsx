import React, { useState } from 'react';

export function UnlockModal({ onClose, onSubmit }) {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    role: '',
    context: ''
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
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-panel"
        onClick={(event) => {
          event.stopPropagation();
        }}
      >
        <form onSubmit={handleSubmit}>
          <h2 className="modal-title">Déverrouiller le détail des calculs</h2>
          <p className="modal-subtitle">
            Laissez-nous quelques informations de contexte. Nous ne vous contacterons que si cela
            fait sens au regard de votre situation.
          </p>

          <div className="modal-grid">
            <div className="field">
              <label className="field-label">
                Prénom <span>*</span>
              </label>
              <input
                type="text"
                className="field-input"
                value={form.firstName}
                onChange={handleChange('firstName')}
              />
            </div>
            <div className="field">
              <label className="field-label">
                Nom <span>*</span>
              </label>
              <input
                type="text"
                className="field-input"
                value={form.lastName}
                onChange={handleChange('lastName')}
              />
            </div>
            <div className="field">
              <label className="field-label">
                Email professionnel <span>*</span>
              </label>
              <input
                type="email"
                className="field-input"
                value={form.email}
                onChange={handleChange('email')}
              />
            </div>
            <div className="field">
              <label className="field-label">
                Entreprise <span>*</span>
              </label>
              <input
                type="text"
                className="field-input"
                value={form.company}
                onChange={handleChange('company')}
              />
            </div>
            <div className="field">
              <label className="field-label">Fonction</label>
              <input
                type="text"
                className="field-input"
                value={form.role}
                onChange={handleChange('role')}
              />
            </div>
            <div className="field" style={{ gridColumn: '1 / -1' }}>
              <label className="field-label">Contexte ou objectif (optionnel)</label>
              <textarea
                className="field-input"
                rows={3}
                value={form.context}
                onChange={handleChange('context')}
              />
            </div>
          </div>

          <div className="modal-actions">
            <button type="submit" className="primary-button">
              <span>Afficher le détail des calculs</span>
              <span className="primary-button-icon">→</span>
            </button>
          </div>

          <div className="modal-footer">
            <div>
              Données utilisées uniquement dans le cadre de cet échange, sans sollicitation
              commerciale non demandée.
            </div>
            <div>
              Estimation indicative et non contractuelle, fondée sur des hypothèses prudentes et
              conforme aux standards du conseil financier.
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}



