import React, { useMemo, useState, useEffect } from 'react';
import { Landing } from './Landing.jsx';
import { ModelChoiceStep } from './ModelChoiceStep.jsx';
import { ParametersStep } from './ParametersStep.jsx';
import { ResultsView } from './ResultsView.jsx';
import { estimateForModel } from './estimationLogic.js';

const STEPS = {
  LANDING: 'landing',
  MODEL: 'model',
  PARAMETERS: 'parameters',
  RESULTS: 'results'
};

export function App() {
  const [step, setStep] = useState(STEPS.LANDING);
  const [selectedModel, setSelectedModel] = useState(null);
  const [parametersByModel, setParametersByModel] = useState({});
  const [unlockOpen, setUnlockOpen] = useState(false);
  
  // Une seule variable booléenne : true = flouté + CTA visible, false = déflouté + CTA caché
  // Par défaut true (flouté), sauf si on a déjà débloqué dans cette session (sessionStorage)
  const [isBlurred, setIsBlurred] = useState(() => {
    const saved = sessionStorage.getItem('resultsBlurred');
    // Si 'false' est sauvegardé, on est débloqué (false)
    // Sinon (null ou 'true'), on est flouté (true par défaut)
    return saved !== 'false';
  });

  const handleStart = () => {
    setStep(STEPS.MODEL);
  };

  const handleSelectModel = (modelKey) => {
    setSelectedModel(modelKey);
    setStep(STEPS.PARAMETERS);
  };

  const handleSubmitParameters = (modelKey, values) => {
    setParametersByModel((prev) => ({
      ...prev,
      [modelKey]: values
    }));
    setStep(STEPS.RESULTS);
  };

  const estimation = useMemo(() => {
    if (!selectedModel || !parametersByModel[selectedModel]) {
      return null;
    }
    return estimateForModel(selectedModel, parametersByModel[selectedModel]);
  }, [selectedModel, parametersByModel]);

  const totalSteps = 3;

  const currentStepIndex = useMemo(() => {
    switch (step) {
      case STEPS.MODEL:
        return 1;
      case STEPS.PARAMETERS:
        return 2;
      case STEPS.RESULTS:
        return 3;
      default:
        return 0;
    }
  }, [step]);

  const progress = useMemo(() => {
    if (!currentStepIndex) return 0;
    return (currentStepIndex / totalSteps) * 100;
  }, [currentStepIndex, totalSteps]);

  const handleUnlock = (data) => {
    // Quand l'utilisateur soumet ses infos, on défloute et on cache le CTA
    setIsBlurred(false);
    sessionStorage.setItem('resultsBlurred', 'false');
    setUnlockOpen(false);
    // Les données peuvent être utilisées pour d'autres besoins (analytics, etc.)
    console.log('Contact data submitted:', data);
  };

  const handleEditParameters = () => {
    if (selectedModel) {
      setStep(STEPS.PARAMETERS);
    }
  };

  // Ouvrir automatiquement le modal quand on arrive sur la page de résultats si les résultats sont floutés
  useEffect(() => {
    if (step === STEPS.RESULTS && isBlurred && !unlockOpen) {
      setUnlockOpen(true);
    }
  }, [step, isBlurred, unlockOpen]);

  return (
    <div className="app-root">
      <div className="app-shell">
        {step === STEPS.LANDING && <Landing onStart={handleStart} />}

        {step !== STEPS.LANDING && step !== STEPS.RESULTS && (
          <div style={{ maxWidth: '960px', margin: '0 auto', padding: '40px 24px' }}>
            <div className="top-progress">
              <div>
                Étape {currentStepIndex} sur {totalSteps}
              </div>
              <div className="top-progress-bar">
                <div className="top-progress-bar-fill" style={{ width: `${progress}%` }} />
              </div>
            </div>

            {step === STEPS.MODEL && (
              <ModelChoiceStep selectedModel={selectedModel} onSelectModel={handleSelectModel} />
            )}

            {step === STEPS.PARAMETERS && selectedModel && (
              <ParametersStep
                modelKey={selectedModel}
                initialValues={parametersByModel[selectedModel]}
                onBack={() => setStep(STEPS.MODEL)}
                onSubmit={handleSubmitParameters}
              />
            )}
          </div>
        )}

        {step === STEPS.RESULTS && estimation && (
          <>
            <div style={{ maxWidth: '1512px', margin: '0 auto', padding: '40px 24px 0' }}>
              <div className="top-progress">
                <div>
                  Étape {currentStepIndex} sur {totalSteps}
                </div>
                <div className="top-progress-bar">
                  <div className="top-progress-bar-fill" style={{ width: `${progress}%` }} />
                </div>
              </div>
            </div>
            <ResultsView
              modelKey={selectedModel}
              estimation={estimation}
              isBlurred={isBlurred}
              unlockOpen={unlockOpen}
              onOpenUnlock={() => setUnlockOpen(true)}
              onCloseUnlock={() => setUnlockOpen(false)}
              onSubmitUnlock={handleUnlock}
              parameters={parametersByModel[selectedModel]}
              onEditParameters={handleEditParameters}
            />
          </>
        )}
      </div>
    </div>
  );
}


