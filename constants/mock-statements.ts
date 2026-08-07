// ─── STATEMENT TYPES ──────────────────────────────────────────────────────────

export type StatementType =
  | "Monthly Statement"
  | "Quarterly Statement"
  | "Annual Summary"
  | "Tax Document (1099)"
  | "Wire Confirmation"
  | "Account Opening";

export type StatementStatus = "available" | "processing" | "archived";

export interface StatementItem {
  id: string;
  title: string;
  period: string;        // e.g. "July 2026"
  periodStart: string;   // ISO date
  periodEnd: string;     // ISO date
  type: StatementType;
  accountId: string;
  accountName: string;
  accountNumber: string;
  generatedDate: string;
  generatedDateISO: string;
  fileSize: string;
  status: StatementStatus;
  year: number;
  month: number;        // 1–12
  // Preview data (mock)
  preview: {
    holderName: string;
    openingBalance: number;
    closingBalance: number;
    totalCredits: number;
    totalDebits: number;
    totalFees: number;
    transactionCount: number;
  };
}

export interface DownloadHistoryItem {
  id: string;
  statementId: string;
  statementTitle: string;
  downloadedOn: string;
  downloadedOnISO: string;
  downloadedBy: string;
  format: "PDF" | "CSV" | "OFX";
}

// ─── MOCK STATEMENTS ──────────────────────────────────────────────────────────

export const MOCK_STATEMENTS: StatementItem[] = [
  // ── 2026 ──────────────────────────────────────────────────────────────────
  {
    id: "stmt-001",
    title: "Monthly Statement — July 2026",
    period: "July 2026",
    periodStart: "2026-07-01",
    periodEnd: "2026-07-31",
    type: "Monthly Statement",
    accountId: "acc-checking",
    accountName: "Primary Checking Account",
    accountNumber: "•••• 8421",
    generatedDate: "Aug 01, 2026",
    generatedDateISO: "2026-08-01",
    fileSize: "1.4 MB",
    status: "available",
    year: 2026,
    month: 7,
    preview: {
      holderName: "Nnamdi Okonkwo",
      openingBalance: 9152.30,
      closingBalance: 12450.80,
      totalCredits: 4862.15,
      totalDebits: 1563.65,
      totalFees: 0.00,
      transactionCount: 15,
    },
  },
  {
    id: "stmt-002",
    title: "Monthly Statement — June 2026",
    period: "June 2026",
    periodStart: "2026-06-01",
    periodEnd: "2026-06-30",
    type: "Monthly Statement",
    accountId: "acc-checking",
    accountName: "Primary Checking Account",
    accountNumber: "•••• 8421",
    generatedDate: "Jul 01, 2026",
    generatedDateISO: "2026-07-01",
    fileSize: "1.2 MB",
    status: "available",
    year: 2026,
    month: 6,
    preview: {
      holderName: "Nnamdi Okonkwo",
      openingBalance: 6440.10,
      closingBalance: 9152.30,
      totalCredits: 5240.00,
      totalDebits: 2527.80,
      totalFees: 0.00,
      transactionCount: 19,
    },
  },
  {
    id: "stmt-003",
    title: "Monthly Statement — May 2026",
    period: "May 2026",
    periodStart: "2026-05-01",
    periodEnd: "2026-05-31",
    type: "Monthly Statement",
    accountId: "acc-checking",
    accountName: "Primary Checking Account",
    accountNumber: "•••• 8421",
    generatedDate: "Jun 01, 2026",
    generatedDateISO: "2026-06-01",
    fileSize: "1.5 MB",
    status: "available",
    year: 2026,
    month: 5,
    preview: {
      holderName: "Nnamdi Okonkwo",
      openingBalance: 4200.00,
      closingBalance: 6440.10,
      totalCredits: 4850.00,
      totalDebits: 2609.90,
      totalFees: 0.00,
      transactionCount: 22,
    },
  },
  {
    id: "stmt-004",
    title: "Quarterly Statement — Q2 2026",
    period: "Q2 2026 (Apr–Jun)",
    periodStart: "2026-04-01",
    periodEnd: "2026-06-30",
    type: "Quarterly Statement",
    accountId: "acc-checking",
    accountName: "Primary Checking Account",
    accountNumber: "•••• 8421",
    generatedDate: "Jul 05, 2026",
    generatedDateISO: "2026-07-05",
    fileSize: "3.2 MB",
    status: "available",
    year: 2026,
    month: 6,
    preview: {
      holderName: "Nnamdi Okonkwo",
      openingBalance: 3800.00,
      closingBalance: 9152.30,
      totalCredits: 14550.00,
      totalDebits: 9197.70,
      totalFees: 0.00,
      transactionCount: 58,
    },
  },
  {
    id: "stmt-005",
    title: "Monthly Statement — April 2026",
    period: "April 2026",
    periodStart: "2026-04-01",
    periodEnd: "2026-04-30",
    type: "Monthly Statement",
    accountId: "acc-savings",
    accountName: "High-Yield Savings Deposit",
    accountNumber: "•••• 9015",
    generatedDate: "May 01, 2026",
    generatedDateISO: "2026-05-01",
    fileSize: "0.8 MB",
    status: "available",
    year: 2026,
    month: 4,
    preview: {
      holderName: "Nnamdi Okonkwo",
      openingBalance: 24000.00,
      closingBalance: 25800.00,
      totalCredits: 1842.15,
      totalDebits: 42.15,
      totalFees: 0.00,
      transactionCount: 4,
    },
  },
  {
    id: "stmt-006",
    title: "Tax Document (1099-INT) — 2025",
    period: "Tax Year 2025",
    periodStart: "2025-01-01",
    periodEnd: "2025-12-31",
    type: "Tax Document (1099)",
    accountId: "acc-savings",
    accountName: "High-Yield Savings Deposit",
    accountNumber: "•••• 9015",
    generatedDate: "Jan 15, 2026",
    generatedDateISO: "2026-01-15",
    fileSize: "0.4 MB",
    status: "available",
    year: 2025,
    month: 12,
    preview: {
      holderName: "Nnamdi Okonkwo",
      openingBalance: 18500.00,
      closingBalance: 24000.00,
      totalCredits: 5544.20,
      totalDebits: 44.20,
      totalFees: 0.00,
      transactionCount: 12,
    },
  },
  {
    id: "stmt-007",
    title: "Annual Summary — 2025",
    period: "Full Year 2025",
    periodStart: "2025-01-01",
    periodEnd: "2025-12-31",
    type: "Annual Summary",
    accountId: "acc-checking",
    accountName: "Primary Checking Account",
    accountNumber: "•••• 8421",
    generatedDate: "Jan 10, 2026",
    generatedDateISO: "2026-01-10",
    fileSize: "5.8 MB",
    status: "available",
    year: 2025,
    month: 12,
    preview: {
      holderName: "Nnamdi Okonkwo",
      openingBalance: 1200.00,
      closingBalance: 9152.30,
      totalCredits: 58200.00,
      totalDebits: 50247.70,
      totalFees: 0.00,
      transactionCount: 210,
    },
  },
  {
    id: "stmt-008",
    title: "Wire Confirmation — TXN-NS-0048815",
    period: "Jul 29, 2026",
    periodStart: "2026-07-29",
    periodEnd: "2026-07-29",
    type: "Wire Confirmation",
    accountId: "acc-checking",
    accountName: "Primary Checking Account",
    accountNumber: "•••• 8421",
    generatedDate: "Jul 29, 2026",
    generatedDateISO: "2026-07-29",
    fileSize: "0.1 MB",
    status: "available",
    year: 2026,
    month: 7,
    preview: {
      holderName: "Nnamdi Okonkwo",
      openingBalance: 9378.36,
      closingBalance: 9128.36,
      totalCredits: 0.00,
      totalDebits: 250.00,
      totalFees: 0.50,
      transactionCount: 1,
    },
  },
  {
    id: "stmt-009",
    title: "Monthly Statement — March 2026",
    period: "March 2026",
    periodStart: "2026-03-01",
    periodEnd: "2026-03-31",
    type: "Monthly Statement",
    accountId: "acc-checking",
    accountName: "Primary Checking Account",
    accountNumber: "•••• 8421",
    generatedDate: "Apr 01, 2026",
    generatedDateISO: "2026-04-01",
    fileSize: "1.3 MB",
    status: "archived",
    year: 2026,
    month: 3,
    preview: {
      holderName: "Nnamdi Okonkwo",
      openingBalance: 2500.00,
      closingBalance: 3800.00,
      totalCredits: 4850.00,
      totalDebits: 3550.00,
      totalFees: 0.00,
      transactionCount: 20,
    },
  },
  {
    id: "stmt-010",
    title: "Account Opening Documents",
    period: "Oct 12, 2024",
    periodStart: "2024-10-12",
    periodEnd: "2024-10-12",
    type: "Account Opening",
    accountId: "acc-checking",
    accountName: "Primary Checking Account",
    accountNumber: "•••• 8421",
    generatedDate: "Oct 12, 2024",
    generatedDateISO: "2024-10-12",
    fileSize: "2.1 MB",
    status: "available",
    year: 2024,
    month: 10,
    preview: {
      holderName: "Nnamdi Okonkwo",
      openingBalance: 0.00,
      closingBalance: 0.00,
      totalCredits: 0.00,
      totalDebits: 0.00,
      totalFees: 0.00,
      transactionCount: 0,
    },
  },
];

// ─── DOWNLOAD HISTORY ─────────────────────────────────────────────────────────

export const MOCK_DOWNLOAD_HISTORY: DownloadHistoryItem[] = [
  {
    id: "dl-001",
    statementId: "stmt-001",
    statementTitle: "Monthly Statement — July 2026",
    downloadedOn: "Aug 04, 2026 at 4:18 PM",
    downloadedOnISO: "2026-08-04T16:18:00",
    downloadedBy: "Nnamdi Okonkwo",
    format: "PDF",
  },
  {
    id: "dl-002",
    statementId: "stmt-004",
    statementTitle: "Quarterly Statement — Q2 2026",
    downloadedOn: "Aug 03, 2026 at 10:05 AM",
    downloadedOnISO: "2026-08-03T10:05:00",
    downloadedBy: "Nnamdi Okonkwo",
    format: "PDF",
  },
  {
    id: "dl-003",
    statementId: "stmt-002",
    statementTitle: "Monthly Statement — June 2026",
    downloadedOn: "Aug 01, 2026 at 9:32 AM",
    downloadedOnISO: "2026-08-01T09:32:00",
    downloadedBy: "Nnamdi Okonkwo",
    format: "CSV",
  },
  {
    id: "dl-004",
    statementId: "stmt-006",
    statementTitle: "Tax Document (1099-INT) — 2025",
    downloadedOn: "Jan 16, 2026 at 2:00 PM",
    downloadedOnISO: "2026-01-16T14:00:00",
    downloadedBy: "Nnamdi Okonkwo",
    format: "PDF",
  },
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────

export const STATEMENT_YEARS = [2026, 2025, 2024];

export const STATEMENT_MONTHS = [
  { value: 0, label: "All Months" },
  { value: 1, label: "January" },
  { value: 2, label: "February" },
  { value: 3, label: "March" },
  { value: 4, label: "April" },
  { value: 5, label: "May" },
  { value: 6, label: "June" },
  { value: 7, label: "July" },
  { value: 8, label: "August" },
  { value: 9, label: "September" },
  { value: 10, label: "October" },
  { value: 11, label: "November" },
  { value: 12, label: "December" },
];

export const STATEMENT_TYPES: Array<{ value: StatementType | "all"; label: string }> = [
  { value: "all", label: "All Types" },
  { value: "Monthly Statement", label: "Monthly Statement" },
  { value: "Quarterly Statement", label: "Quarterly Statement" },
  { value: "Annual Summary", label: "Annual Summary" },
  { value: "Tax Document (1099)", label: "Tax Document (1099)" },
  { value: "Wire Confirmation", label: "Wire Confirmation" },
  { value: "Account Opening", label: "Account Opening Docs" },
];

export const STATEMENT_ACCOUNTS = [
  { value: "all", label: "All Accounts" },
  { value: "acc-checking", label: "Primary Checking •••• 8421" },
  { value: "acc-savings", label: "High-Yield Savings •••• 9015" },
  { value: "acc-brokerage", label: "Stock Brokerage •••• 3310" },
];
