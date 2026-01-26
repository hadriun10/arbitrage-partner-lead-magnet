/**
 * Configuration des indicateurs de résultats par business model
 *
 * Chaque modèle définit :
 * - yourFigures : indicateurs "Vos Chiffres" (bleus) - données fournies par l'utilisateur
 * - projections : indicateurs "Projections" (verts) - résultats calculés avec multiplicateur x1.5
 * - layout : type d'affichage ('complete', 'intermediate', 'simple')
 */

// Helper pour convertir les valeurs en nombres (les inputs retournent des strings)
function toNum(value, fallback = 0) {
  const parsed = parseFloat(value);
  return isNaN(parsed) ? fallback : parsed;
}

export const UPLIFT_MULTIPLIER = 1.5;

export const resultsConfig = {
  recurring: {
    layout: 'complete',
    sectionTitles: {
      // Titres principaux des grandes sections
      yourFiguresMain: 'Vos chiffres',
      projectionsMain: 'Projection indicative',
      // Sous-titres des blocs (en majuscules)
      yourFiguresValue: "VALEUR D'UN CLIENT",
      yourFiguresVolume: "VOLUME D'AFFAIRES ACTUEL",
      projectionsVolume: "LE VOLUME D'AFFAIRES POTENTIEL",
      projectionsValue: "VALEUR D'UN TRIMESTRE DE COLLABORATION"
    },
    yourFigures: {
      value: [
        {
          key: 'revenuePerClient',
          label: "Chiffre d'affaires de revenus récurrents par client",
          format: 'currency',
          getValue: (params, estimation) => toNum(params.annualRevenuePerClient)
        },
        {
          key: 'lifetimeProfit',
          label: "Profit total généré par client sur sa durée de vie",
          explanation: (params) => `${formatNumber(toNum(params.annualRevenuePerClient))}€ de chiffre d'affaire annuel récurrent avec ${toNum(params.incrementalMargin, 70)}% de marge pour une durée de vie de ${toNum(params.contractDurationYears, 5)} ans.`,
          format: 'currency',
          getValue: (params, estimation) => {
            const revenue = toNum(params.annualRevenuePerClient);
            const margin = (toNum(params.incrementalMargin, 70)) / 100;
            const years = toNum(params.contractDurationYears, 5);
            return revenue * margin * years;
          }
        }
      ],
      volume: [
        {
          key: 'introsPerQuarter',
          label: "Introductions qualifiées par trimestre par votre meilleur collaborateur en interne",
          format: 'number',
          getValue: (params) => params.introsPerQuarter || 0
        }
      ]
    },
    projections: {
      volume: [
        {
          key: 'additionalIntros',
          label: "introductions qualifiées additionnels par trimestre",
          explanation: (params) => `Correspond à 1,5x les ${toNum(params.introsPerQuarter, 12)} introductions qualifiées que produit votre meilleur collaborateur.`,
          format: 'range',
          getValue: (params) => {
            const base = (toNum(params.introsPerQuarter, 12)) * UPLIFT_MULTIPLIER;
            return { min: Math.floor(base * 0.8), max: Math.ceil(base * 1.1) };
          }
        },
        {
          key: 'clientsPerQuarter',
          label: "clients par trimestre en moyenne",
          explanation: (params) => `En comptant votre taux de signature de ${toNum(params.convIntroToClient, 20)}%.`,
          format: 'range',
          getValue: (params) => {
            const intros = (toNum(params.introsPerQuarter, 12)) * UPLIFT_MULTIPLIER;
            const conv = (toNum(params.convIntroToClient, 20)) / 100;
            const base = intros * conv;
            return { min: Math.floor(base * 0.8), max: Math.ceil(base * 1.1) };
          }
        }
      ],
      value: [
        {
          key: 'additionalRevenue',
          label: "Chiffre d'affaire annuel récurrent additionnel",
          description: (params, values) => `Chiffre d'affaire annuel récurrent additionnel généré par ${values?.clientsRange || '4 - 5'} clients.`,
          format: 'currency',
          progressWidth: 20,
          getValue: (params, estimation) => {
            const intros = (toNum(params.introsPerQuarter, 12)) * UPLIFT_MULTIPLIER;
            const conv = (toNum(params.convIntroToClient, 20)) / 100;
            const clients = intros * conv;
            return clients * (toNum(params.annualRevenuePerClient));
          }
        },
        {
          key: 'additionalProfit',
          label: "Profit annuel additionnel",
          description: (params, values) => `Profit annuel additionnel générée par ${values?.clientsRange || '4 - 5'} clients avec une marge de ${toNum(params.incrementalMargin, 70)}%.`,
          format: 'currency',
          progressWidth: 10,
          getValue: (params, estimation) => {
            const intros = (toNum(params.introsPerQuarter, 12)) * UPLIFT_MULTIPLIER;
            const conv = (toNum(params.convIntroToClient, 20)) / 100;
            const clients = intros * conv;
            const revenue = clients * (toNum(params.annualRevenuePerClient));
            const margin = (toNum(params.incrementalMargin, 70)) / 100;
            return revenue * margin;
          }
        },
        {
          key: 'lifetimeProfit',
          label: "Profit total sur la durée de vie",
          description: (params, values) => `Profit total générée par ${values?.clientsRange || '4 - 5'} clients sur leur durée de vie de ${toNum(params.contractDurationYears, 5)} ans.`,
          format: 'currency',
          progressWidth: 70,
          getValue: (params, estimation) => {
            const intros = (toNum(params.introsPerQuarter, 12)) * UPLIFT_MULTIPLIER;
            const conv = (toNum(params.convIntroToClient, 20)) / 100;
            const clients = intros * conv;
            const revenue = clients * (toNum(params.annualRevenuePerClient));
            const margin = (toNum(params.incrementalMargin, 70)) / 100;
            const years = toNum(params.contractDurationYears, 5);
            return revenue * margin * years;
          }
        },
        {
          key: 'valuationGain',
          label: "Gain de valorisation d'entreprise",
          description: (params, values) => `Gain de valorisation d'entreprise générée par ${values?.clientsRange || '4 - 5'} clients.`,
          footnote: (params) => `En utilisant le multiple de ×${toNum(params.arrMultiple, 5)} l'ARR en vigueur dans votre secteur.`,
          format: 'currency',
          progressWidth: 65,
          getValue: (params, estimation) => {
            const intros = (toNum(params.introsPerQuarter, 12)) * UPLIFT_MULTIPLIER;
            const conv = (toNum(params.convIntroToClient, 20)) / 100;
            const clients = intros * conv;
            const revenue = clients * (toNum(params.annualRevenuePerClient));
            const multiple = toNum(params.arrMultiple, 5);
            return revenue * multiple;
          }
        }
      ]
    }
  },

  projects: {
    layout: 'simple',
    sectionTitles: {
      yourFiguresMain: 'Vos chiffres',
      projectionsMain: 'Projection indicative',
      yourFiguresValue: "VALEUR D'UN CONTRAT",
      yourFiguresVolume: "VOLUME D'AFFAIRES ACTUEL",
      projectionsVolume: "LE VOLUME D'AFFAIRES POTENTIEL",
      projectionsValue: "VALEUR D'UN TRIMESTRE DE COLLABORATION"
    },
    yourFigures: {
      value: [
        {
          key: 'contractValue',
          label: "Chiffre d'affaires moyen par contrat",
          format: 'currency',
          getValue: (params) => toNum(params.avgContractValue)
        },
        {
          key: 'profitPerContract',
          label: "Profit net généré par contrat",
          explanation: (params) => `${formatNumber(toNum(params.avgContractValue))}€ de contrat avec ${toNum(params.avgOperatingMargin, 30)}% de marge opérationnelle.`,
          format: 'currency',
          getValue: (params) => {
            const value = toNum(params.avgContractValue);
            const margin = (toNum(params.avgOperatingMargin, 30)) / 100;
            return value * margin;
          }
        }
      ],
      volume: [
        {
          key: 'introsPerQuarter',
          label: "Introductions qualifiées par trimestre (meilleur collab.)",
          format: 'number',
          getValue: (params) => params.qualifiedOppPerQuarter || 0
        }
      ]
    },
    projections: {
      volume: [
        {
          key: 'additionalIntros',
          label: "introductions qualifiées par trimestre",
          explanation: (params) => `Correspondant à 1,5x les ${toNum(params.qualifiedOppPerQuarter, 10)} introductions qualifiées que produit votre meilleur collaborateur.`,
          format: 'number',
          getValue: (params) => Math.round((toNum(params.qualifiedOppPerQuarter, 10)) * UPLIFT_MULTIPLIER)
        },
        {
          key: 'clientsPerQuarter',
          label: "clients par trimestre en moyenne",
          explanation: (params) => `En prenant en compte votre taux de signature de ${toNum(params.convOppToClient, 20)}%.`,
          format: 'decimal',
          getValue: (params) => {
            const intros = (toNum(params.qualifiedOppPerQuarter, 10)) * UPLIFT_MULTIPLIER;
            const conv = (toNum(params.convOppToClient, 20)) / 100;
            return intros * conv;
          }
        }
      ],
      value: [
        {
          key: 'additionalRevenue',
          label: "Chiffre d'affaire généré",
          description: (params, values) => `Chiffre d'affaire généré par ${values?.clientsRange || '3 - 4'} contrats.`,
          format: 'currency',
          progressWidth: 20,
          getValue: (params) => {
            const intros = (toNum(params.qualifiedOppPerQuarter, 10)) * UPLIFT_MULTIPLIER;
            const conv = (toNum(params.convOppToClient, 20)) / 100;
            const clients = intros * conv;
            return clients * (toNum(params.avgContractValue));
          }
        },
        {
          key: 'additionalProfit',
          label: "Profit généré",
          description: (params, values) => `Profit généré par ${values?.clientsRange || '3 - 4'} contrats avec une marge de ${toNum(params.avgOperatingMargin, 30)}%.`,
          format: 'currency',
          progressWidth: 50,
          getValue: (params) => {
            const intros = (toNum(params.qualifiedOppPerQuarter, 10)) * UPLIFT_MULTIPLIER;
            const conv = (toNum(params.convOppToClient, 20)) / 100;
            const clients = intros * conv;
            const revenue = clients * (toNum(params.avgContractValue));
            const margin = (toNum(params.avgOperatingMargin, 30)) / 100;
            return revenue * margin;
          }
        },
        {
          key: 'valuationGain',
          label: "Gain de valorisation d'entreprise",
          description: (params, values) => `Gain de valorisation d'entreprise généré par ${values?.clientsRange || '3 - 4'} contrats.`,
          footnote: (params) => `En utilisant le multiple de ×${toNum(params.ebitdaMultiple, 6)} l'EBITDA en vigueur dans votre secteur.`,
          format: 'currency',
          progressWidth: 100,
          getValue: (params) => {
            const intros = (toNum(params.qualifiedOppPerQuarter, 10)) * UPLIFT_MULTIPLIER;
            const conv = (toNum(params.convOppToClient, 20)) / 100;
            const clients = intros * conv;
            const revenue = clients * (toNum(params.avgContractValue));
            const margin = (toNum(params.avgOperatingMargin, 30)) / 100;
            const profit = revenue * margin;
            return profit * (toNum(params.ebitdaMultiple, 6));
          }
        }
      ]
    }
  },

  transactions: {
    layout: 'simple',
    sectionTitles: {
      yourFiguresMain: 'Vos chiffres',
      projectionsMain: 'Projection indicative',
      yourFiguresValue: "VALEUR D'UNE TRANSACTION",
      yourFiguresVolume: "VOLUME D'AFFAIRES ACTUEL",
      projectionsVolume: "LE VOLUME D'AFFAIRES POTENTIEL",
      projectionsValue: "VALEUR D'UN TRIMESTRE DE COLLABORATION"
    },
    yourFigures: {
      value: [
        {
          key: 'transactionFees',
          label: "Success fee moyenne par transaction",
          explanation: (params) => `${toNum(params.successFee)}% de success fee sur ${formatNumber(toNum(params.avgTransactionValue))}€ + ${formatNumber(toNum(params.workFees))}€ de retainer fees.`,
          format: 'currency',
          getValue: (params) => {
            const value = toNum(params.avgTransactionValue);
            const successFee = (toNum(params.successFee)) / 100;
            const workFees = toNum(params.workFees);
            return value * successFee + workFees;
          }
        },
        {
          key: 'profitPerTransaction',
          label: "Profit net généré par transaction",
          explanation: (params) => `Avec une marge opérationnelle nette de ${toNum(params.netMargin, 80)}%.`,
          format: 'currency',
          getValue: (params) => {
            const value = toNum(params.avgTransactionValue);
            const successFee = (toNum(params.successFee)) / 100;
            const workFees = toNum(params.workFees);
            const totalFees = value * successFee + workFees;
            const margin = (toNum(params.netMargin, 80)) / 100;
            return totalFees * margin;
          }
        }
      ],
      volume: [
        {
          key: 'introsPerQuarter',
          label: "Introductions qualifiées par trimestre (meilleur collab.)",
          format: 'number',
          getValue: (params) => params.introsPerQuarter || 0
        }
      ]
    },
    projections: {
      volume: [
        {
          key: 'additionalIntros',
          label: "Introductions qualifiées additionnelles par trimestre",
          explanation: (params) => `Correspondant à 1,5x les ${toNum(params.introsPerQuarter, 10)} introductions qualifiées que produit votre meilleur collaborateur.`,
          format: 'number',
          getValue: (params) => Math.round((toNum(params.introsPerQuarter, 10)) * UPLIFT_MULTIPLIER)
        },
        {
          key: 'clientsPerQuarter',
          label: "Nombre de clients (arrondi)",
          explanation: (params) => `En prenant en compte votre taux de closing de ${toNum(params.convIntroToMandate, 20)}%.`,
          format: 'number',
          getValue: (params) => {
            const intros = (toNum(params.introsPerQuarter, 10)) * UPLIFT_MULTIPLIER;
            const conv = (toNum(params.convIntroToMandate, 20)) / 100;
            return Math.round(intros * conv);
          }
        }
      ],
      value: [
        {
          key: 'successFees',
          label: "Success fees potentielles",
          description: (params, values) => `Success fees potentielles générées par ${values?.clientsRange || '3'} clients.`,
          format: 'currency',
          progressWidth: 30,
          getValue: (params) => {
            const intros = (toNum(params.introsPerQuarter, 10)) * UPLIFT_MULTIPLIER;
            const conv = (toNum(params.convIntroToMandate, 20)) / 100;
            const clients = Math.round(intros * conv);
            const value = toNum(params.avgTransactionValue);
            const successFee = (toNum(params.successFee)) / 100;
            const workFees = toNum(params.workFees);
            return clients * (value * successFee + workFees);
          }
        },
        {
          key: 'additionalProfit',
          label: "Profits additionnels",
          description: (params, values) => `Profits additionnels générés par ${values?.clientsRange || '3'} clients.`,
          footnote: (params) => `Avec une marge opérationnelle nette de ${toNum(params.netMargin, 80)}%.`,
          format: 'currency',
          progressWidth: 100,
          getValue: (params) => {
            const intros = (toNum(params.introsPerQuarter, 10)) * UPLIFT_MULTIPLIER;
            const conv = (toNum(params.convIntroToMandate, 20)) / 100;
            const clients = Math.round(intros * conv);
            const value = toNum(params.avgTransactionValue);
            const successFee = (toNum(params.successFee)) / 100;
            const workFees = toNum(params.workFees);
            const fees = clients * (value * successFee + workFees);
            const margin = (toNum(params.netMargin, 80)) / 100;
            return fees * margin;
          }
        }
      ]
    }
  },

  financing: {
    layout: 'simple',
    sectionTitles: {
      yourFiguresMain: 'Vos chiffres',
      projectionsMain: 'Projection indicative',
      yourFiguresValue: "VALEUR D'UNE OPÉRATION",
      yourFiguresVolume: "VOLUME D'AFFAIRES ACTUEL",
      projectionsVolume: "LE VOLUME D'AFFAIRES POTENTIEL",
      projectionsValue: "VALEUR D'UN TRIMESTRE DE COLLABORATION"
    },
    yourFigures: {
      value: [
        {
          key: 'financedAmount',
          label: "Montant moyen financé par opération",
          format: 'currency',
          getValue: (params) => toNum(params.avgFinancedAmount)
        },
        {
          key: 'revenuePerOperation',
          label: (params) => `Frais et rendement moyen par opération sur ${params?.financingDurationYears || 5} ans`,
          explanation: (params) => `${toNum(params.annualSpread, 2)}% de spread sur ${toNum(params.financingDurationYears, 5)} ans + ${formatNumber(toNum(params.fixedFees))}€ de frais fixes.`,
          format: 'currency',
          getValue: (params) => {
            const amount = toNum(params.avgFinancedAmount);
            const spread = toNum(params.annualSpread, 2) / 100;
            const years = toNum(params.financingDurationYears, 5);
            const fees = toNum(params.fixedFees);
            return amount * spread * years + fees;
          }
        },
        {
          key: 'profitPerOperation',
          label: "Profit net généré par opération",
          explanation: (params) => `Avec une marge opérationnelle nette de ${toNum(params.netMargin, 80)}%.`,
          format: 'currency',
          getValue: (params) => {
            const amount = toNum(params.avgFinancedAmount);
            const spread = toNum(params.annualSpread, 2) / 100;
            const years = toNum(params.financingDurationYears, 5);
            const fees = toNum(params.fixedFees);
            const revenue = amount * spread * years + fees;
            const margin = toNum(params.netMargin, 80) / 100;
            return revenue * margin;
          }
        }
      ],
      volume: [
        {
          key: 'introsPerQuarter',
          label: "Introductions qualifiées par trimestre (meilleur collab.)",
          format: 'number',
          getValue: (params) => params.introsPerQuarter || 0
        }
      ]
    },
    projections: {
      volume: [
        {
          key: 'additionalIntros',
          label: "Nombre d'introductions qualifiés (x1,5)",
          explanation: (params) => `Correspondant à 1,5x les ${toNum(params.introsPerQuarter, 10)} introductions qualifiées que produit votre meilleur collaborateur.`,
          format: 'number',
          getValue: (params) => Math.round((toNum(params.introsPerQuarter, 10)) * UPLIFT_MULTIPLIER)
        },
        {
          key: 'clientsPerQuarter',
          label: "Nombre de clients",
          explanation: (params) => `En prenant en compte votre taux de closing de ${toNum(params.convIntroToFinancing, 20)}%.`,
          format: 'decimal',
          getValue: (params) => {
            const intros = (toNum(params.introsPerQuarter, 10)) * UPLIFT_MULTIPLIER;
            const conv = (toNum(params.convIntroToFinancing, 20)) / 100;
            return intros * conv;
          }
        }
      ],
      value: [
        {
          key: 'volumeFinancement',
          label: "Volume de financement structuré",
          description: (params, values) => `Volume de financement structuré par ${values?.clientsRange || '3'} clients.`,
          format: 'currency',
          progressWidth: 20,
          getValue: (params) => {
            const intros = (toNum(params.introsPerQuarter, 10)) * UPLIFT_MULTIPLIER;
            const conv = (toNum(params.convIntroToFinancing, 20)) / 100;
            const clients = intros * conv;
            const amount = toNum(params.avgFinancedAmount);
            return clients * amount;
          }
        },
        {
          key: 'revenusGeneres',
          label: "Revenus générés",
          description: (params, values) => `Revenus générés par ${values?.clientsRange || '3'} clients.`,
          format: 'currency',
          progressWidth: 50,
          getValue: (params) => {
            const intros = (toNum(params.introsPerQuarter, 10)) * UPLIFT_MULTIPLIER;
            const conv = (toNum(params.convIntroToFinancing, 20)) / 100;
            const clients = intros * conv;
            const amount = toNum(params.avgFinancedAmount);
            const spread = (toNum(params.annualSpread, 2)) / 100;
            const years = toNum(params.financingDurationYears, 5);
            const fees = toNum(params.fixedFees);
            return clients * (amount * spread * years + fees);
          }
        },
        {
          key: 'profitsNets',
          label: "Profits nets générés",
          description: (params, values) => `Profits nets générés par ${values?.clientsRange || '3'} clients.`,
          footnote: (params) => `Avec une marge opérationnelle nette de ${toNum(params.netMargin, 80)}%.`,
          format: 'currency',
          progressWidth: 100,
          getValue: (params) => {
            const intros = (toNum(params.introsPerQuarter, 10)) * UPLIFT_MULTIPLIER;
            const conv = (toNum(params.convIntroToFinancing, 20)) / 100;
            const clients = intros * conv;
            const amount = toNum(params.avgFinancedAmount);
            const spread = (toNum(params.annualSpread, 2)) / 100;
            const years = toNum(params.financingDurationYears, 5);
            const fees = toNum(params.fixedFees);
            const revenue = clients * (amount * spread * years + fees);
            const margin = (toNum(params.netMargin, 80)) / 100;
            return revenue * margin;
          }
        }
      ]
    }
  },

  asset_management: {
    layout: 'simple',
    sectionTitles: {
      yourFiguresMain: 'Vos chiffres',
      projectionsMain: 'Projection indicative',
      yourFiguresValue: "VALEUR D'UNE RELATION",
      yourFiguresVolume: "VOLUME D'AFFAIRES ACTUEL",
      projectionsVolume: "LE VOLUME D'AFFAIRES POTENTIEL",
      projectionsValue: "VALEUR D'UN TRIMESTRE DE COLLABORATION"
    },
    yourFigures: {
      value: [
        {
          key: 'initialAum',
          label: "AUM initial moyen par relation",
          format: 'currency',
          getValue: (params) => toNum(params.initialAum)
        },
        {
          key: 'revenuePerRelation',
          label: "Revenus annuels moyens par relation",
          explanation: (params) => `${toNum(params.mgmtFeeAnnual, 1)}% de management fee + ${toNum(params.perfFee)}% de performance fee.`,
          format: 'currency',
          getValue: (params) => {
            const aum = toNum(params.initialAum);
            const mgmtFee = (toNum(params.mgmtFeeAnnual, 1)) / 100;
            const perfFee = (toNum(params.perfFee)) / 100;
            const additionalFee = (toNum(params.additionalCommissions)) / 100;
            return aum * (mgmtFee + perfFee + additionalFee);
          }
        },
        {
          key: 'profitPerRelation',
          label: "Profit net généré par relation",
          explanation: (params) => `Avec une marge opérationnelle nette de ${params.netMargin || 35}%.`,
          format: 'currency',
          getValue: (params) => {
            const aum = toNum(params.initialAum);
            const mgmtFee = (toNum(params.mgmtFeeAnnual, 1)) / 100;
            const perfFee = (toNum(params.perfFee)) / 100;
            const additionalFee = (toNum(params.additionalCommissions)) / 100;
            const revenue = aum * (mgmtFee + perfFee + additionalFee);
            const margin = (params.netMargin || 35) / 100;
            return revenue * margin;
          }
        }
      ],
      volume: [
        {
          key: 'introsPerQuarter',
          label: "Introductions qualifiées par trimestre (meilleur collab.)",
          format: 'number',
          getValue: (params) => params.introsPerQuarter || 0
        }
      ]
    },
    projections: {
      volume: [
        {
          key: 'additionalIntros',
          label: "introductions qualifiées par trimestre",
          explanation: (params) => `Correspondant à 1,5x les ${toNum(params.introsPerQuarter, 10)} introductions qualifiées que produit votre meilleur collaborateur.`,
          format: 'number',
          getValue: (params) => Math.round((toNum(params.introsPerQuarter, 10)) * UPLIFT_MULTIPLIER)
        },
        {
          key: 'clientsPerQuarter',
          label: "clients par trimestre en moyenne",
          explanation: (params) => `En prenant en compte votre taux de signature de ${toNum(params.convIntroToRelationship, 20)}%.`,
          format: 'decimal',
          getValue: (params) => {
            const intros = (toNum(params.introsPerQuarter, 10)) * UPLIFT_MULTIPLIER;
            const conv = (toNum(params.convIntroToRelationship, 20)) / 100;
            return intros * conv;
          }
        }
      ],
      value: [
        {
          key: 'revenusAnnuels',
          label: "Revenus annuels générés",
          description: (params, values) => `Revenus annuels générés par ${Math.round(values?.intros || 15)} introductions qualifiées`,
          format: 'currency',
          progressWidth: 30,
          getValue: (params) => {
            const intros = (toNum(params.introsPerQuarter, 10)) * UPLIFT_MULTIPLIER;
            const conv = (toNum(params.convIntroToRelationship, 20)) / 100;
            const clients = intros * conv;
            const aum = toNum(params.initialAum);
            const mgmtFee = (toNum(params.mgmtFeeAnnual, 1)) / 100;
            const perfFee = (toNum(params.perfFee)) / 100;
            const additionalFee = (toNum(params.additionalCommissions)) / 100;
            const totalFeeRate = mgmtFee + perfFee + additionalFee;
            return clients * aum * totalFeeRate;
          }
        },
        {
          key: 'valuationGain',
          label: "Gain de valorisation",
          description: (params, values) => `Gain de valorisation générée par ${Math.round(values?.intros || 15)} introductions qualifiées`,
          footnote: (params) => `En utilisant le multiple de ×${toNum(params.mgmtFeesMultiple, 3)} les management fees.`,
          format: 'currency',
          progressWidth: 100,
          getValue: (params) => {
            const intros = (toNum(params.introsPerQuarter, 10)) * UPLIFT_MULTIPLIER;
            const conv = (toNum(params.convIntroToRelationship, 20)) / 100;
            const clients = intros * conv;
            const aum = toNum(params.initialAum);
            const mgmtFee = (toNum(params.mgmtFeeAnnual, 1)) / 100;
            const mgmtFeesAnnual = clients * aum * mgmtFee;
            return mgmtFeesAnnual * (toNum(params.mgmtFeesMultiple, 3));
          }
        }
      ]
    }
  }
};

// Helper function pour formater les nombres
function formatNumber(value) {
  return value.toLocaleString('fr-FR');
}

// Fonction pour obtenir la configuration d'un modèle
export function getModelConfig(modelKey) {
  return resultsConfig[modelKey] || resultsConfig.recurring;
}

// Fonction pour calculer toutes les valeurs d'un modèle
export function computeAllValues(modelKey, params) {
  const config = getModelConfig(modelKey);
  const values = {
    yourFiguresValue: {},
    yourFiguresVolume: {},
    projectionsVolume: {},
    projectionsValue: {}
  };

  // Calculer les "Vos Chiffres - Valeur"
  config.yourFigures.value.forEach(indicator => {
    values.yourFiguresValue[indicator.key] = indicator.getValue(params, null);
  });

  // Calculer les "Vos Chiffres - Volume"
  config.yourFigures.volume.forEach(indicator => {
    values.yourFiguresVolume[indicator.key] = indicator.getValue(params, null);
  });

  // Calculer les indicateurs de projection volume
  config.projections.volume.forEach(indicator => {
    values.projectionsVolume[indicator.key] = indicator.getValue(params);
  });

  // Calculer les indicateurs de projection valeur
  const intros = values.projectionsVolume.additionalIntros?.max || values.projectionsVolume.additionalIntros || 15;
  const computeContext = { intros, clientsRange: formatClientsRange(values.projectionsVolume.clientsPerQuarter) };

  config.projections.value.forEach(indicator => {
    values.projectionsValue[indicator.key] = indicator.getValue(params, computeContext);
  });

  return values;
}

// Helper pour formater la plage de clients
function formatClientsRange(value) {
  if (typeof value === 'object' && value.min !== undefined) {
    return `${value.min} - ${value.max}`;
  }
  const rounded = Math.round(value * 10) / 10;
  const min = Math.floor(rounded * 0.9);
  const max = Math.ceil(rounded * 1.1);
  return min === max ? `${min}` : `${min} - ${max}`;
}
