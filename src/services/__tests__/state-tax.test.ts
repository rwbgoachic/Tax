import { describe, it, expect } from 'vitest';
import { TaxCalculator } from '../state-tax';

describe('TaxCalculator', () => {
  const calculator = TaxCalculator.getInstance();

  it('should calculate taxes correctly for a state with both state and local taxes', () => {
    const result = calculator.calculateTax('AL', 100, 0.02);
    expect(result.stateTax).toBe(4);
    expect(result.localTax).toBe(2);
    expect(result.totalTax).toBe(6);
    expect(result.total).toBe(106);
  });

  it('should throw error for invalid state code', () => {
    expect(() => calculator.calculateTax('XX', 100)).toThrow('Invalid state code');
  });

  it('should throw error when local rate exceeds maximum', () => {
    expect(() => calculator.calculateTax('AL', 100, 0.08)).toThrow('Local rate exceeds maximum');
  });
});