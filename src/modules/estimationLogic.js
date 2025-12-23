const UPLIFT_MIN = 1.5;

function toNumber(value, fallback = 0) {
  const n = typeof value === 'string' ? parseFloat(value.replace(/\s/g, '').replace(',', '.')) : value;
  if (Number.isNaN(n) || n === null || n === undefined) {
    return fallback;
  }
  return n;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function computeAdditionalUnits(introsPerPeriodRaw, conversionRateRaw) {
  const intros = toNumber(introsPerPeriodRaw, 4); // prudente mais tangible
  const conv = toNumber(conversionRateRaw, 20); // %
  const basePerMonth = (intros * conv) / 100;
  const uplifted = basePerMonth * UPLIFT_MIN;
  return uplifted * 12; // sur une année
}

export function estimateForModel(modelKey, params) {
  switch (modelKey) {
    case 'recurring':
      return estimateRecurring(params);
    case 'projects':
      return estimateProjects(params);
    case 'transactions':
      return estimateTransactions(params);
    case 'financing':
      return estimateFinancing(params);
    case 'asset_management':
      return estimateAssetManagement(params);
    default:
      return {
        additionalRevenue: 0,
        valuationGain: 0,
        levers: [],
        details: {}
      };
  }
}

function estimateRecurring(params) {
  const annualRevenuePerClient = toNumber(params.annualRevenuePerClient);
  const incrementalMargin = clamp(toNumber(params.incrementalMargin, 60), 10, 90) / 100;
  const contractDurationYears = toNumber(params.contractDurationYears);
  const churnRate = toNumber(params.annualRetentionRate);

  let lifetimeYears = contractDurationYears;
  if (!lifetimeYears && churnRate) {
    const churn = clamp(churnRate / 100, 0.02, 0.35);
    lifetimeYears = 1 / churn;
  }
  if (!lifetimeYears) {
    lifetimeYears = 4;
  }
  lifetimeYears = clamp(lifetimeYears, 1.5, 8);

  const additionalClientsPerYear = computeAdditionalUnits(params.introsPerQuarter, params.convIntroToClient);

  const incrementalAnnualRevenue = annualRevenuePerClient * incrementalMargin * additionalClientsPerYear;
  const arrMultiple = toNumber(params.arrMultiple, 6);
  const incrementalArr = annualRevenuePerClient * additionalClientsPerYear;
  const valuationGain = incrementalArr * arrMultiple;

  return {
    additionalRevenue: incrementalAnnualRevenue,
    valuationGain,
    levers: [
      'Optimisation du flux d’introductions qualifiées (min. 1,5× appliqué)',
      'Activation de la marge incrémentale sur les nouveaux clients récurrents',
      'Projection de valorisation sur la base d’un multiple d’ARR de marché'
    ],
    details: {
      lifetimeYears,
      additionalClientsPerYear,
      incrementalMarginPct: incrementalMargin * 100,
      arrMultiple
    }
  };
}

function estimateProjects(params) {
  const avgContractValue = toNumber(params.avgContractValue);
  const margin = clamp(toNumber(params.avgOperatingMargin, 30), 5, 60) / 100;
  const additionalContractsPerYear = computeAdditionalUnits(
    params.qualifiedOppPerQuarter,
    params.convOppToClient
  );

  const incrementalAnnualRevenue = avgContractValue * margin * additionalContractsPerYear;
  const ebitdaMultiple = toNumber(params.ebitdaMultiple, 6);
  const incrementalEbitda = incrementalAnnualRevenue;
  const valuationGain = incrementalEbitda * ebitdaMultiple;

  return {
    additionalRevenue: incrementalAnnualRevenue,
    valuationGain,
    levers: [
      'Qualité du pipeline d’opportunités à forte valeur',
      'Taux de conversion opportunité → client',
      'Conversion de la marge projet en EBITDA valorisable'
    ],
    details: {
      additionalContractsPerYear,
      marginPct: margin * 100,
      ebitdaMultiple
    }
  };
}

function estimateTransactions(params) {
  const avgTransactionValue = toNumber(params.avgTransactionValue);
  const successFee = clamp(toNumber(params.successFee, 3), 1.5, 8) / 100;
  const workFees = toNumber(params.workFees, 0);
  const closingProbability = clamp(toNumber(params.closingProbability, 60), 30, 90) / 100;
  const durationMonths = clamp(toNumber(params.mandateDurationMonths, 9), 3, 18);
  const netMargin = clamp(toNumber(params.netMargin, 35), 10, 60) / 100;

  const successFeeRevenue = avgTransactionValue * successFee * closingProbability;
  const totalPerMandate = successFeeRevenue + workFees;
  const annualisedRevenuePerMandate = (totalPerMandate * 12) / durationMonths;
  const ebitdaPerMandate = annualisedRevenuePerMandate * netMargin;

  const additionalMandatesPerYear = computeAdditionalUnits(
    params.introsPerQuarter,
    params.convIntroToMandate
  );
  const incrementalEbitda = ebitdaPerMandate * additionalMandatesPerYear;

  const ebitdaMultiple = toNumber(params.ebitdaMultiple, 7);
  const valuationGain = incrementalEbitda * ebitdaMultiple;

  return {
    additionalRevenue: incrementalEbitda,
    valuationGain,
    levers: [
      'Structuration du pipeline d’introductions qualifiées en mandats signés',
      'Combinaison des work fees et success fees annualisés',
      'Conversion en EBITDA net à partir de la marge opérationnelle'
    ],
    details: {
      annualisedRevenuePerMandate,
      additionalMandatesPerYear,
      netMarginPct: netMargin * 100,
      ebitdaMultiple
    }
  };
}

function estimateFinancing(params) {
  const avgFinancedAmount = toNumber(params.avgFinancedAmount);
  const annualSpread = clamp(toNumber(params.annualSpread, 3), 1, 8) / 100;
  const durationYears = clamp(toNumber(params.financingDurationYears, 4), 1, 10);
  const arrangementFees = toNumber(params.arrangementFees, 0);
  const structuringFees = toNumber(params.structuringFees, 0);
  const servicingFeesAnnual = toNumber(params.servicingFeesAnnual, 0);
  const netMargin = clamp(toNumber(params.netMargin, 35), 10, 60) / 100;

  const spreadRevenueLifetime = avgFinancedAmount * annualSpread * durationYears;
  const feeRevenueLifetime = arrangementFees + structuringFees + servicingFeesAnnual * durationYears;
  const totalLifetime = spreadRevenueLifetime + feeRevenueLifetime;
  const annualRevenuePerDeal = totalLifetime / durationYears;
  const ebitdaPerDeal = annualRevenuePerDeal * netMargin;

  const additionalDealsPerYear = computeAdditionalUnits(
    params.introsPerQuarter,
    params.convIntroToFinancing
  );
  const incrementalEbitda = ebitdaPerDeal * additionalDealsPerYear;

  const ebitdaMultiple = toNumber(params.ebitdaMultiple, 7);
  const valuationGain = incrementalEbitda * ebitdaMultiple;

  return {
    additionalRevenue: incrementalEbitda,
    valuationGain,
    levers: [
      'Valorisation de la combinaison spreads + fees sur la durée de vie des opérations',
      'Effet volume sur les introductions qualifiées transformées en financements',
      'Projection en EBITDA institutionnel'
    ],
    details: {
      annualRevenuePerDeal,
      additionalDealsPerYear,
      netMarginPct: netMargin * 100,
      ebitdaMultiple
    }
  };
}

function estimateAssetManagement(params) {
  const initialAum = toNumber(params.initialAum);
  const mgmtFeeAnnual = clamp(toNumber(params.mgmtFeeAnnual, 0.8), 0.4, 2.5) / 100;
  const perfFee = clamp(toNumber(params.perfFee, 0), 0, 20) / 100;
  const additionalCommissions = clamp(toNumber(params.additionalCommissions, 0), 0, 1.5) / 100;
  const durationYears = clamp(toNumber(params.relationshipDurationYears, 8), 3, 20);
  const netMargin = clamp(toNumber(params.netMargin, 35), 15, 60) / 100;

  const totalFeeRate = mgmtFeeAnnual + perfFee + additionalCommissions;
  const annualRevenuePerRelation = initialAum * totalFeeRate;
  const ebitdaPerRelation = annualRevenuePerRelation * netMargin;

  const additionalRelationsPerYear = computeAdditionalUnits(
    params.introsPerQuarter,
    params.convIntroToRelationship
  );
  const incrementalEbitda = ebitdaPerRelation * additionalRelationsPerYear;

  const mgmtFeesMultiple = toNumber(params.mgmtFeesMultiple, 3);
  const managementFeesAnnualised = initialAum * mgmtFeeAnnual * additionalRelationsPerYear;
  const valuationGain = managementFeesAnnualised * mgmtFeesMultiple;

  return {
    additionalRevenue: incrementalEbitda,
    valuationGain,
    levers: [
      'Accroissement des encours sous gestion via les relations qualifiées',
      'Monétisation des management fees et performance fees sur la durée de la relation',
      'Projection de valorisation sur les management fees annualisés'
    ],
    details: {
      annualRevenuePerRelation,
      additionalRelationsPerYear,
      netMarginPct: netMargin * 100,
      mgmtFeesMultiple
    }
  };
}


