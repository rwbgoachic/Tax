export interface StateTaxRule {
  state: string;
  stateCode: string;
  baseRate: number;
  localTaxEnabled: boolean;
  maxLocalRate?: number;
  specialDistricts: boolean;
  exemptions: string[];
  effectiveDate: string;
  notes?: string;
}

export interface TaxCalculationResult {
  subtotal: number;
  stateTax: number;
  localTax: number;
  totalTax: number;
  total: number;
  exemptions?: string[];
  specialDistricts?: boolean;
}

export interface TaxCalculationOptions {
  stateCode: string;
  subtotal: number;
  localRate?: number;
  zipCode?: string;
  productType?: string;
}