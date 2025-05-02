import { StateTaxRule } from '../types/tax';
import Decimal from 'decimal.js';

export const stateTaxRules: StateTaxRule[] = [
  {
    state: 'Alabama',
    stateCode: 'AL',
    baseRate: 0.04,
    localTaxEnabled: true,
    maxLocalRate: 0.07,
    specialDistricts: true,
    exemptions: ['prescription-drugs', 'certain-medical-devices'],
    effectiveDate: '2024-01-01'
  },
  {
    state: 'Alaska',
    stateCode: 'AK',
    baseRate: 0,
    localTaxEnabled: true,
    maxLocalRate: 0.07,
    specialDistricts: false,
    exemptions: [],
    effectiveDate: '2024-01-01'
  },
  // ... Add all 50 states with their specific rules
  {
    state: 'Wyoming',
    stateCode: 'WY',
    baseRate: 0.04,
    localTaxEnabled: true,
    maxLocalRate: 0.02,
    specialDistricts: true,
    exemptions: ['food', 'prescription-drugs'],
    effectiveDate: '2024-01-01'
  }
];

export class TaxCalculator {
  private static instance: TaxCalculator;
  private rules: Map<string, StateTaxRule>;

  private constructor() {
    this.rules = new Map(
      stateTaxRules.map(rule => [rule.stateCode, rule])
    );
  }

  public static getInstance(): TaxCalculator {
    if (!TaxCalculator.instance) {
      TaxCalculator.instance = new TaxCalculator();
    }
    return TaxCalculator.instance;
  }

  public getStateRule(stateCode: string): StateTaxRule | undefined {
    return this.rules.get(stateCode.toUpperCase());
  }

  public calculateTax(
    stateCode: string,
    subtotal: number,
    localRate: number = 0
  ) {
    const rule = this.getStateRule(stateCode);
    if (!rule) {
      throw new Error(`Invalid state code: ${stateCode}`);
    }

    if (localRate > (rule.maxLocalRate || 0)) {
      throw new Error(`Local rate exceeds maximum allowed rate for ${stateCode}`);
    }

    const subtotalDecimal = new Decimal(subtotal);
    const stateTax = subtotalDecimal.times(rule.baseRate);
    const localTax = subtotalDecimal.times(localRate);
    const totalTax = stateTax.plus(localTax);
    const total = subtotalDecimal.plus(totalTax);

    return {
      subtotal: subtotalDecimal.toNumber(),
      stateTax: stateTax.toNumber(),
      localTax: localTax.toNumber(),
      totalTax: totalTax.toNumber(),
      total: total.toNumber()
    };
  }
}