import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'INR',
  }).format(amount);
}

export function validateEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

export function validatePhoneNumber(phone: string): boolean {
  const re = /^\d{10}$/;
  return re.test(phone);
}

export function validateCardNumber(cardNumber: string): boolean {
  const re = /^\d{16}$/;
  return re.test(cardNumber);
}

export function validateCVV(cvv: string): boolean {
  const re = /^\d{3}$/;
  return re.test(cvv);
}

export function validateExpiryDate(expiryDate: string): boolean {
  // Check format MM/YY
  const re = /^(0[1-9]|1[0-2])\/\d{2}$/;
  if (!re.test(expiryDate)) return false;

  // Check if date is in the future
  const [month, year] = expiryDate.split('/');
  const expiryYear = 2000 + parseInt(year, 10); // Convert YY to YYYY
  const expiryMonth = parseInt(month, 10) - 1; // JS months are 0-indexed

  const currentDate = new Date();
  const expiryDateObj = new Date(expiryYear, expiryMonth, 1);

  return expiryDateObj > currentDate;
}

export function getCardType(cardNumber: string): string {
  const firstDigit = cardNumber.charAt(0);

  switch (firstDigit) {
    case '4':
      return 'Visa';
    case '5':
      return 'MasterCard';
    case '3':
      return 'American Express';
    case '6':
      return 'Discover';
    default:
      return 'Unknown';
  }
}

export function getTransactionOutcome(cardNumber: string): 'approved' | 'declined' | 'failed' {
  const lastDigit = cardNumber.charAt(cardNumber.length - 1);

  switch (lastDigit) {
    case '1':
      return 'approved';
    case '2':
      return 'declined';
    case '3':
      return 'failed';
    default:
      return 'approved';
  }
}

export function formatCardNumber(cardNumber: string): string {
  return cardNumber.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
}

export function maskCardNumber(cardNumber: string): string {
  return cardNumber.slice(-4).padStart(cardNumber.length, '*');
}
