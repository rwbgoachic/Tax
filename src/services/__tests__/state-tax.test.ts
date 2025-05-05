import { describe, it, expect } from 'vitest';
import { TaxCalculator } from '../state-tax';
import { TaxCalculationOptions } from '../../types/tax';

describe('TaxCalculator', () => {
  const calculator = TaxCalculator.getInstance();

  describe('Basic Tax Calculations', () => {
    it('should calculate taxes correctly for a state with both state and local taxes', () => {
      const options: TaxCalculationOptions = {
        stateCode: 'AL',
        subtotal: 100,
        localRate: 0.02
      };
      const result = calculator.calculateTax(options);
      expect(result.stateTax).toBe(4);
      expect(result.localTax).toBe(2);
      expect(result.totalTax).toBe(6);
      expect(result.total).toBe(106);
    });

    it('should throw error for invalid state code', () => {
      const options: TaxCalculationOptions = {
        stateCode: 'XX',
        subtotal: 100
      };
      expect(() => calculator.calculateTax(options)).toThrow('Invalid state code');
    });

    it('should throw error when local rate exceeds maximum', () => {
      const options: TaxCalculationOptions = {
        stateCode: 'AL',
        subtotal: 100,
        localRate: 0.08
      };
      expect(() => calculator.calculateTax(options)).toThrow('Local rate exceeds maximum');
    });
  });

  describe('ZIP Code Validation', () => {
    it('should accept valid ZIP code', () => {
      const options: TaxCalculationOptions = {
        stateCode: 'NY',
        subtotal: 100,
        localRate: 0.02,
        zipCode: '12345'
      };
      const result = calculator.calculateTax(options);
      expect(result.total).toBeGreaterThan(100);
    });

    it('should reject invalid ZIP code', () => {
      const invalidOptions: TaxCalculationOptions = {
        stateCode: 'NY',
        subtotal: 100,
        localRate: 0.02,
        zipCode: '1234'
      };
      expect(() => calculator.calculateTax(invalidOptions)).toThrow('Invalid ZIP code format');
    });
  });

  describe('Fallback Behavior', () => {
    it('should use fallback rate when primary calculation fails', () => {
      const options: TaxCalculationOptions = {
        stateCode: 'NY',
        subtotal: 100
      };
      const result = calculator.calculateTax(options);
      expect(result.stateTax).toBe(4); // NY base rate is 4%
      expect(result.total).toBe(104);
    });

    it('should return zero tax for states with no sales tax', () => {
      const options: TaxCalculationOptions = {
        stateCode: 'OR',
        subtotal: 100
      };
      const result = calculator.calculateTax(options);
      expect(result.stateTax).toBe(0);
      expect(result.total).toBe(100);
    });
  });
});