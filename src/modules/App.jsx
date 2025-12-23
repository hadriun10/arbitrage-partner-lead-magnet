import React, { useMemo, useState } from 'react';
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
  const [contactData, setContactData] = useState(null);

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
    setContactData(data);
    setUnlockOpen(false);
  };

  const showDetails = Boolean(contactData);

  return (
    <div className="app-root">
      <div className="app-shell">
        {step !== STEPS.LANDING && (
          <div className="top-progress">
            <div>
              Étape {currentStepIndex} sur {totalSteps}
            </div>
            <div className="top-progress-bar">
              <div className="top-progress-bar-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}

        {step === STEPS.LANDING && <Landing onStart={handleStart} />}

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

        {step === STEPS.RESULTS && estimation && (
          <ResultsView
            modelKey={selectedModel}
            estimation={estimation}
            blurred={!showDetails}
            unlockOpen={unlockOpen}
            onOpenUnlock={() => setUnlockOpen(true)}
            onCloseUnlock={() => setUnlockOpen(false)}
            onSubmitUnlock={handleUnlock}
            parameters={parametersByModel[selectedModel]}
            contactData={contactData}
          />
        )}
      </div>
    </div>
  );
}


