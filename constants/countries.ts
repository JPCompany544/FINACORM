export interface CountryOption {
  code: string;
  name: string;
  currency: string;
  flag: string;
  rate: number; // mock rate against USD
}

export const COUNTRIES: CountryOption[] = [
  { code: "GB", name: "United Kingdom", currency: "GBP", flag: "🇬🇧", rate: 0.78 },
  { code: "EU", name: "Eurozone (France, Germany, etc.)", currency: "EUR", flag: "🇪🇺", rate: 0.92 },
  { code: "JP", name: "Japan", currency: "JPY", flag: "🇯🇵", rate: 142.15 },
  { code: "CA", name: "Canada", currency: "CAD", flag: "🇨🇦", rate: 1.34 },
  { code: "AU", name: "Australia", currency: "AUD", flag: "🇦🇺", rate: 1.52 },
  { code: "SG", name: "Singapore", currency: "SGD", flag: "🇸🇬", rate: 1.33 },
];
