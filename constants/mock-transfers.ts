export interface TransferRecord {
  id: string;
  receiptNumber: string;
  transactionId: string;
  type: "internal" | "domestic" | "international";
  status: "success" | "pending" | "failed";
  date: string;
  time: string;
  dateISO: string;
  sender: string;
  senderAccount: string;
  recipient: string;
  recipientAccount: string;
  bankName: string;
  swiftCode?: string;
  iban?: string;
  country?: string;
  amount: number;
  fees: number;
  exchangeRate?: string;
  reference: string;
  notes?: string;
}

export const MOCK_TRANSFERS: TransferRecord[] = [
  {
    id: "tx-rec-1",
    receiptNumber: "REC-490382",
    transactionId: "TXN-FC-90410",
    type: "domestic",
    status: "success",
    date: "Aug 02, 2026",
    time: "2:15 PM",
    dateISO: "2026-08-02T14:15:00",
    sender: "Primary Checking Account",
    senderAccount: "•••• 8421",
    recipient: "Sarah Jenkins",
    recipientAccount: "•••• •••• •••• 9214",
    bankName: "Chase Bank, N.A.",
    amount: 150.00,
    fees: 0.00,
    reference: "Rent share payment",
    notes: "Funded from USD account. Settled immediately.",
  },
  {
    id: "tx-rec-2",
    receiptNumber: "REC-294012",
    transactionId: "TXN-FC-39401",
    type: "internal",
    status: "success",
    date: "Jul 28, 2026",
    time: "10:30 AM",
    dateISO: "2026-07-28T10:30:00",
    sender: "Primary Checking Account",
    senderAccount: "•••• 8421",
    recipient: "High-Yield Savings Deposit",
    recipientAccount: "•••• 9015",
    bankName: "FINACORM Bank",
    amount: 1200.00,
    fees: 0.00,
    reference: "Savings monthly allocation",
    notes: "Internal asset re-allocation.",
  },
  {
    id: "tx-rec-3",
    receiptNumber: "REC-104928",
    transactionId: "TXN-FC-10492",
    type: "international",
    status: "success",
    date: "Jul 20, 2026",
    time: "4:00 PM",
    dateISO: "2026-07-20T16:00:00",
    sender: "Primary Checking Account",
    senderAccount: "•••• 8421",
    recipient: "Akihiro Tanaka",
    recipientAccount: "JP89 MZHB 0001 0293 8410 29",
    bankName: "Mizuho Bank Ltd",
    swiftCode: "MZHBJPJTXXX",
    country: "Japan",
    amount: 500.00,
    fees: 15.00,
    exchangeRate: "1 USD = 142.15 JPY",
    reference: "Freelance consulting services",
    notes: "International wire exchange via SWIFT routing network.",
  },
  {
    id: "tx-rec-4",
    receiptNumber: "REC-084920",
    transactionId: "TXN-FC-08492",
    type: "domestic",
    status: "failed",
    date: "Jul 15, 2026",
    time: "11:00 AM",
    dateISO: "2026-07-15T11:00:00",
    sender: "Primary Checking Account",
    senderAccount: "•••• 8421",
    recipient: "David Vane",
    recipientAccount: "•••• •••• •••• 3041",
    bankName: "Bank of America",
    amount: 3000.00,
    fees: 0.00,
    reference: "Car downpayment",
    notes: "Declined: Insufficient clearing funds in primary account ledger.",
  },
];
