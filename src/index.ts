import { TaxCalculator } from './services/state-tax';
import { TaxCalculationOptions } from './types/tax';

const calculator = TaxCalculator.getInstance();

// Example usage with new options interface
const options: TaxCalculationOptions = {
  stateCode: 'NY',
  subtotal: 100,
  localRate: 0.045, // 4.5% local tax
  zipCode: '10001'
};

try {
  const result = calculator.calculateTax(options);
  console.log('Tax Calculation Result:', result);
} catch (error) {
  console.error('Error calculating tax:', error);
}