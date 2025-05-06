import Decimal from 'decimal.js';
import { StateTaxRule, TaxCalculationResult, TaxCalculationOptions } from '../types/tax';

export class TaxCalculator {
  private static instance: TaxCalculator;
  private stateTaxRules: StateTaxRule[];
  private cache: Map<string, TaxCalculationResult>;

  private constructor() {
    this.stateTaxRules = [
      {
        state: 'Alabama',
        stateCode: 'AL',
        baseRate: 0.04,
        localTaxEnabled: true,
        maxLocalRate: 0.07,
        specialDistricts: true,
        exemptions: ['groceries', 'prescription-drugs'],
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
      {
        state: 'Arizona',
        stateCode: 'AZ',
        baseRate: 0.056,
        localTaxEnabled: true,
        maxLocalRate: 0.05,
        specialDistricts: true,
        exemptions: ['groceries'],
        effectiveDate: '2024-01-01'
      },
      {
        state: 'Arkansas',
        stateCode: 'AR',
        baseRate: 0.065,
        localTaxEnabled: true,
        maxLocalRate: 0.05,
        specialDistricts: true,
        exemptions: ['groceries', 'prescription-drugs'],
        effectiveDate: '2024-01-01'
      },
      {
        state: 'California',
        stateCode: 'CA',
        baseRate: 0.0725,
        localTaxEnabled: true,
        maxLocalRate: 0.02,
        specialDistricts: true,
        exemptions: ['groceries', 'prescription-drugs'],
        effectiveDate: '2024-01-01'
      },
      {
        state: 'Colorado',
        stateCode: 'CO',
        baseRate: 0.029,
        localTaxEnabled: true,
        maxLocalRate: 0.08,
        specialDistricts: true,
        exemptions: ['groceries', 'prescription-drugs'],
        effectiveDate: '2024-01-01'
      },
      {
        state: 'Connecticut',
        stateCode: 'CT',
        baseRate: 0.0635,
        localTaxEnabled: false,
        specialDistricts: false,
        exemptions: ['groceries', 'prescription-drugs'],
        effectiveDate: '2024-01-01'
      },
      {
        state: 'Delaware',
        stateCode: 'DE',
        baseRate: 0,
        localTaxEnabled: false,
        specialDistricts: false,
        exemptions: [],
        effectiveDate: '2024-01-01'
      },
      {
        state: 'Florida',
        stateCode: 'FL',
        baseRate: 0.06,
        localTaxEnabled: true,
        maxLocalRate: 0.02,
        specialDistricts: false,
        exemptions: ['groceries', 'prescription-drugs'],
        effectiveDate: '2024-01-01'
      },
      {
        state: 'Georgia',
        stateCode: 'GA',
        baseRate: 0.04,
        localTaxEnabled: true,
        maxLocalRate: 0.04,
        specialDistricts: true,
        exemptions: ['prescription-drugs'],
        effectiveDate: '2024-01-01'
      },
      {
        state: 'Hawaii',
        stateCode: 'HI',
        baseRate: 0.04,
        localTaxEnabled: true,
        maxLocalRate: 0.005,
        specialDistricts: false,
        exemptions: ['prescription-drugs'],
        effectiveDate: '2024-01-01'
      },
      {
        state: 'Idaho',
        stateCode: 'ID',
        baseRate: 0.06,
        localTaxEnabled: true,
        maxLocalRate: 0.03,
        specialDistricts: true,
        exemptions: ['prescription-drugs'],
        effectiveDate: '2024-01-01'
      },
      {
        state: 'Illinois',
        stateCode: 'IL',
        baseRate: 0.0625,
        localTaxEnabled: true,
        maxLocalRate: 0.04,
        specialDistricts: true,
        exemptions: ['prescription-drugs'],
        effectiveDate: '2024-01-01'
      },
      {
        state: 'Indiana',
        stateCode: 'IN',
        baseRate: 0.07,
        localTaxEnabled: false,
        specialDistricts: false,
        exemptions: ['groceries', 'prescription-drugs'],
        effectiveDate: '2024-01-01'
      },
      {
        state: 'Iowa',
        stateCode: 'IA',
        baseRate: 0.06,
        localTaxEnabled: true,
        maxLocalRate: 0.01,
        specialDistricts: false,
        exemptions: ['groceries', 'prescription-drugs'],
        effectiveDate: '2024-01-01'
      },
      {
        state: 'Kansas',
        stateCode: 'KS',
        baseRate: 0.065,
        localTaxEnabled: true,
        maxLocalRate: 0.04,
        specialDistricts: true,
        exemptions: ['prescription-drugs'],
        effectiveDate: '2024-01-01'
      },
      {
        state: 'Kentucky',
        stateCode: 'KY',
        baseRate: 0.06,
        localTaxEnabled: false,
        specialDistricts: false,
        exemptions: ['groceries', 'prescription-drugs'],
        effectiveDate: '2024-01-01'
      },
      {
        state: 'Louisiana',
        stateCode: 'LA',
        baseRate: 0.0445,
        localTaxEnabled: true,
        maxLocalRate: 0.07,
        specialDistricts: true,
        exemptions: ['prescription-drugs'],
        effectiveDate: '2024-01-01'
      },
      {
        state: 'Maine',
        stateCode: 'ME',
        baseRate: 0.055,
        localTaxEnabled: false,
        specialDistricts: false,
        exemptions: ['groceries', 'prescription-drugs'],
        effectiveDate: '2024-01-01'
      },
      {
        state: 'Maryland',
        stateCode: 'MD',
        baseRate: 0.06,
        localTaxEnabled: false,
        specialDistricts: false,
        exemptions: ['groceries', 'prescription-drugs'],
        effectiveDate: '2024-01-01'
      },
      {
        state: 'Massachusetts',
        stateCode: 'MA',
        baseRate: 0.0625,
        localTaxEnabled: false,
        specialDistricts: false,
        exemptions: ['groceries', 'prescription-drugs'],
        effectiveDate: '2024-01-01'
      },
      {
        state: 'Michigan',
        stateCode: 'MI',
        baseRate: 0.06,
        localTaxEnabled: false,
        specialDistricts: false,
        exemptions: ['groceries', 'prescription-drugs'],
        effectiveDate: '2024-01-01'
      },
      {
        state: 'Minnesota',
        stateCode: 'MN',
        baseRate: 0.06875,
        localTaxEnabled: true,
        maxLocalRate: 0.02,
        specialDistricts: true,
        exemptions: ['groceries', 'prescription-drugs'],
        effectiveDate: '2024-01-01'
      },
      {
        state: 'Mississippi',
        stateCode: 'MS',
        baseRate: 0.07,
        localTaxEnabled: false,
        specialDistricts: false,
        exemptions: ['prescription-drugs'],
        effectiveDate: '2024-01-01'
      },
      {
        state: 'Missouri',
        stateCode: 'MO',
        baseRate: 0.04225,
        localTaxEnabled: true,
        maxLocalRate: 0.05,
        specialDistricts: true,
        exemptions: ['groceries', 'prescription-drugs'],
        effectiveDate: '2024-01-01'
      },
      {
        state: 'Montana',
        stateCode: 'MT',
        baseRate: 0,
        localTaxEnabled: true,
        maxLocalRate: 0.03,
        specialDistricts: false,
        exemptions: [],
        effectiveDate: '2024-01-01'
      },
      {
        state: 'Nebraska',
        stateCode: 'NE',
        baseRate: 0.055,
        localTaxEnabled: true,
        maxLocalRate: 0.02,
        specialDistricts: false,
        exemptions: ['groceries', 'prescription-drugs'],
        effectiveDate: '2024-01-01'
      },
      {
        state: 'Nevada',
        stateCode: 'NV',
        baseRate: 0.0685,
        localTaxEnabled: true,
        maxLocalRate: 0.0125,
        specialDistricts: true,
        exemptions: ['groceries', 'prescription-drugs'],
        effectiveDate: '2024-01-01'
      },
      {
        state: 'New Hampshire',
        stateCode: 'NH',
        baseRate: 0,
        localTaxEnabled: false,
        specialDistricts: false,
        exemptions: [],
        effectiveDate: '2024-01-01'
      },
      {
        state: 'New Jersey',
        stateCode: 'NJ',
        baseRate: 0.06625,
        localTaxEnabled: false,
        specialDistricts: false,
        exemptions: ['groceries', 'prescription-drugs'],
        effectiveDate: '2024-01-01'
      },
      {
        state: 'New Mexico',
        stateCode: 'NM',
        baseRate: 0.05125,
        localTaxEnabled: true,
        maxLocalRate: 0.0375,
        specialDistricts: true,
        exemptions: ['groceries', 'prescription-drugs'],
        effectiveDate: '2024-01-01'
      },
      {
        state: 'New York',
        stateCode: 'NY',
        baseRate: 0.04,
        localTaxEnabled: true,
        maxLocalRate: 0.045,
        specialDistricts: true,
        exemptions: ['groceries', 'prescription-drugs'],
        effectiveDate: '2024-01-01'
      },
      {
        state: 'North Carolina',
        stateCode: 'NC',
        baseRate: 0.0475,
        localTaxEnabled: true,
        maxLocalRate: 0.0275,
        specialDistricts: false,
        exemptions: ['prescription-drugs'],
        effectiveDate: '2024-01-01'
      },
      {
        state: 'North Dakota',
        stateCode: 'ND',
        baseRate: 0.05,
        localTaxEnabled: true,
        maxLocalRate: 0.03,
        specialDistricts: true,
        exemptions: ['groceries'],
        effectiveDate: '2024-01-01'
      },
      {
        state: 'Ohio',
        stateCode: 'OH',
        baseRate: 0.0575,
        localTaxEnabled: true,
        maxLocalRate: 0.0275,
        specialDistricts: true,
        exemptions: ['groceries', 'prescription-drugs'],
        effectiveDate: '2024-01-01'
      },
      {
        state: 'Oklahoma',
        stateCode: 'OK',
        baseRate: 0.045,
        localTaxEnabled: true,
        maxLocalRate: 0.06,
        specialDistricts: true,
        exemptions: ['prescription-drugs'],
        effectiveDate: '2024-01-01'
      },
      {
        state: 'Oregon',
        stateCode: 'OR',
        baseRate: 0,
        localTaxEnabled: false,
        specialDistricts: false,
        exemptions: [],
        effectiveDate: '2024-01-01'
      },
      {
        state: 'Pennsylvania',
        stateCode: 'PA',
        baseRate: 0.06,
        localTaxEnabled: true,
        maxLocalRate: 0.02,
        specialDistricts: false,
        exemptions: ['groceries', 'prescription-drugs'],
        effectiveDate: '2024-01-01'
      },
      {
        state: 'Rhode Island',
        stateCode: 'RI',
        baseRate: 0.07,
        localTaxEnabled: false,
        specialDistricts: false,
        exemptions: ['groceries', 'prescription-drugs'],
        effectiveDate: '2024-01-01'
      },
      {
        state: 'South Carolina',
        stateCode: 'SC',
        baseRate: 0.06,
        localTaxEnabled: true,
        maxLocalRate: 0.03,
        specialDistricts: true,
        exemptions: ['prescription-drugs'],
        effectiveDate: '2024-01-01'
      },
      {
        state: 'South Dakota',
        stateCode: 'SD',
        baseRate: 0.045,
        localTaxEnabled: true,
        maxLocalRate: 0.045,
        specialDistricts: true,
        exemptions: ['groceries'],
        effectiveDate: '2024-01-01'
      },
      {
        state: 'Tennessee',
        stateCode: 'TN',
        baseRate: 0.07,
        localTaxEnabled: true,
        maxLocalRate: 0.0275,
        specialDistricts: false,
        exemptions: ['groceries-reduced'],
        effectiveDate: '2024-01-01'
      },
      {
        state: 'Texas',
        stateCode: 'TX',
        baseRate: 0.0625,
        localTaxEnabled: true,
        maxLocalRate: 0.02,
        specialDistricts: true,
        exemptions: ['groceries', 'prescription-drugs'],
        effectiveDate: '2024-01-01'
      },
      {
        state: 'Utah',
        stateCode: 'UT',
        baseRate: 0.0485,
        localTaxEnabled: true,
        maxLocalRate: 0.02,
        specialDistricts: true,
        exemptions: ['groceries-reduced'],
        effectiveDate: '2024-01-01'
      },
      {
        state: 'Vermont',
        stateCode: 'VT',
        baseRate: 0.06,
        localTaxEnabled: true,
        maxLocalRate: 0.01,
        specialDistricts: false,
        exemptions: ['groceries', 'prescription-drugs'],
        effectiveDate: '2024-01-01'
      },
      {
        state: 'Virginia',
        stateCode: 'VA',
        baseRate: 0.043,
        localTaxEnabled: true,
        maxLocalRate: 0.01,
        specialDistricts: true,
        exemptions: ['groceries-reduced', 'prescription-drugs'],
        effectiveDate: '2024-01-01'
      },
      {
        state: 'Washington',
        stateCode: 'WA',
        baseRate: 0.065,
        localTaxEnabled: true,
        maxLocalRate: 0.04,
        specialDistricts: true,
        exemptions: ['groceries', 'prescription-drugs'],
        effectiveDate: '2024-01-01'
      },
      {
        state: 'West Virginia',
        stateCode: 'WV',
        baseRate: 0.06,
        localTaxEnabled: true,
        maxLocalRate: 0.01,
        specialDistricts: false,
        exemptions: ['groceries', 'prescription-drugs'],
        effectiveDate: '2024-01-01'
      },
      {
        state: 'Wisconsin',
        stateCode: 'WI',
        baseRate: 0.05,
        localTaxEnabled: true,
        maxLocalRate: 0.005,
        specialDistricts: false,
        exemptions: ['groceries', 'prescription-drugs'],
        effectiveDate: '2024-01-01'
      },
      {
        state: 'Wyoming',
        stateCode: 'WY',
        baseRate: 0.04,
        localTaxEnabled: true,
        maxLocalRate: 0.02,
        specialDistricts: true,
        exemptions: ['groceries', 'prescription-drugs'],
        effectiveDate: '2024-01-01'
      }
    ];
    this.cache = new Map();
  }

  public static getInstance(): TaxCalculator {
    if (!TaxCalculator.instance) {
      TaxCalculator.instance = new TaxCalculator();
    }
    return TaxCalculator.instance;
  }

  private getCacheKey(options: TaxCalculationOptions): string {
    const { stateCode, subtotal, localRate = 0, zipCode = '', productType = '' } = options;
    return `${stateCode}-${subtotal}-${localRate}-${zipCode}-${productType}`;
  }

  private validateZipCode(zipCode: string): boolean {
    return /^\d{5}$/.test(zipCode);
  }

  private getFallbackRate(stateCode: string): number {
    const rule = this.getStateTaxRule(stateCode);
    return rule ? rule.baseRate : 0;
  }

  public calculateTax(options: TaxCalculationOptions): TaxCalculationResult {
    try {
      const { stateCode, subtotal, localRate = 0, zipCode, productType } = options;

      if (zipCode && !this.validateZipCode(zipCode)) {
        throw new Error('Invalid ZIP code format');
      }

      const cacheKey = this.getCacheKey(options);
      const cachedResult = this.cache.get(cacheKey);
      
      if (cachedResult) {
        return cachedResult;
      }

      const rule = this.stateTaxRules.find(r => r.stateCode === stateCode);
      if (!rule) {
        throw new Error('Invalid state code');
      }

      if (localRate > 0 && !rule.localTaxEnabled) {
        throw new Error('Local tax not enabled for this state');
      }

      if (localRate > (rule.maxLocalRate || 0)) {
        throw new Error('Local rate exceeds maximum');
      }

      const subtotalDecimal = new Decimal(subtotal);
      let stateTax = subtotalDecimal.times(rule.baseRate);
      let localTax = rule.localTaxEnabled ? subtotalDecimal.times(localRate) : new Decimal(0);

      // Apply exemptions if product type is specified
      if (productType && rule.exemptions.includes(productType)) {
        stateTax = new Decimal(0);
        localTax = new Decimal(0);
      }

      stateTax = stateTax.toDecimalPlaces(2);
      localTax = localTax.toDecimalPlaces(2);
      const totalTax = stateTax.plus(localTax);
      const total = subtotalDecimal.plus(totalTax);

      const result: TaxCalculationResult = {
        subtotal: subtotalDecimal.toNumber(),
        stateTax: stateTax.toNumber(),
        localTax: localTax.toNumber(),
        totalTax: totalTax.toNumber(),
        total: total.toNumber(),
        exemptions: rule.exemptions,
        specialDistricts: rule.specialDistricts
      };

      this.cache.set(cacheKey, result);
      return result;
    } catch (error) {
      // Attempt to use fallback rate if primary calculation fails
      try {
        const fallbackRate = this.getFallbackRate(options.stateCode);
        const subtotalDecimal = new Decimal(options.subtotal);
        const fallbackTax = subtotalDecimal.times(fallbackRate).toDecimalPlaces(2);
        
        return {
          subtotal: subtotalDecimal.toNumber(),
          stateTax: fallbackTax.toNumber(),
          localTax: 0,
          totalTax: fallbackTax.toNumber(),
          total: subtotalDecimal.plus(fallbackTax).toNumber()
        };
      } catch (fallbackError) {
        if (error instanceof Error) {
          throw error;
        }
        throw new Error('An unexpected error occurred while calculating tax');
      }
    }
  }

  public getStateTaxRule(stateCode: string): StateTaxRule | undefined {
    try {
      return this.stateTaxRules.find(r => r.stateCode === stateCode);
    } catch (error) {
      console.error('Error retrieving state tax rule:', error);
      return undefined;
    }
  }

  public getAllStateTaxRules(): StateTaxRule[] {
    try {
      return [...this.stateTaxRules];
    } catch (error) {
      console.error('Error retrieving all state tax rules:', error);
      return [];
    }
  }

  public clearCache(): void {
    this.cache.clear();
  }
}