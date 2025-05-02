import { TaxCalculator } from './services/state-tax';

const calculator = TaxCalculator.getInstance();

// Example usage
const subtotal = 100;
const stateCode = 'NY';
const localRate = 0.045; // 4.5% local tax

try {
  const result = calculator.calculateTax(stateCode, subtotal, localRate);
  console.log('Tax Calculation Result:', result);
} catch (error) {
  console.error('Error calculating tax:', error);
}