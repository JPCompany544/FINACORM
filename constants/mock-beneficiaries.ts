export interface Beneficiary {
  id: string;
  name: string;
  type: "internal" | "domestic" | "international";
  accountNumber?: string;
  bankName?: string;
  swiftCode?: string;
  iban?: string;
  country?: string;
  currency?: string;
  email?: string;
  isFavorite: boolean;
  recentDate?: string;
  initials: string;
  color: string;
  routingInformation?: string;
  nickname?: string;
}

export const MOCK_BENEFICIARIES: Beneficiary[] = [
  {
    id: "ben-1",
    name: "Sarah Jenkins",
    type: "domestic",
    accountNumber: "•••• •••• •••• 9214",
    bankName: "Chase Bank, N.A.",
    email: "sarah.j@example.com",
    isFavorite: true,
    recentDate: "Aug 02, 2026",
    initials: "SJ",
    color: "#2563EB",
  },
  {
    id: "ben-2",
    name: "David Vane",
    type: "domestic",
    accountNumber: "•••• •••• •••• 3041",
    bankName: "Bank of America",
    email: "david.v@example.com",
    isFavorite: true,
    recentDate: "Jul 28, 2026",
    initials: "DV",
    color: "#DC2626",
  },
  {
    id: "ben-3",
    name: "Akihiro Tanaka",
    type: "international",
    bankName: "Mizuho Bank Ltd",
    swiftCode: "MZHBJPJTXXX",
    iban: "JP89 MZHB 0001 0293 8410 29",
    country: "Japan",
    currency: "JPY",
    email: "a.tanaka@corp.jp",
    isFavorite: true,
    recentDate: "Jul 20, 2026",
    initials: "AT",
    color: "#0F766E",
  },
  {
    id: "ben-4",
    name: "Marcelle Dupont",
    type: "international",
    bankName: "BNP Paribas",
    swiftCode: "BNPAFRPPXXX",
    iban: "FR76 3000 7001 2345 6789 0123 456",
    country: "France",
    currency: "EUR",
    email: "m.dupont@bnp.fr",
    isFavorite: false,
    recentDate: "Jul 15, 2026",
    initials: "MD",
    color: "#16A34A",
  },
  {
    id: "ben-5",
    name: "Elena Rostova",
    type: "international",
    bankName: "Deutsche Bank AG",
    swiftCode: "DEUTDEDDXXX",
    iban: "DE89 3704 0044 0532 0130 00",
    country: "Germany",
    currency: "EUR",
    email: "e.rostova@db.de",
    isFavorite: false,
    recentDate: "Jun 30, 2026",
    initials: "ER",
    color: "#6366F1",
  },
];
