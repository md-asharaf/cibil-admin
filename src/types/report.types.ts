/**
 * Credit Report Types
 */

export interface CreditReport {
  id: string;
  userId: string;
  userName: string;
  pan: string;
  creditScore: number;
  status: 'Active' | 'Pending' | 'Expired' | 'Disputed';
  generatedDate: string;
  lastUpdated: string;
  reportData?: CreditReportData;
}

export interface CreditReportData {
  personalInfo: {
    name: string;
    dateOfBirth: string;
    pan: string;
    address: string;
  };
  creditScore: {
    score: number;
    range: string;
    factors: CreditFactor[];
  };
  accounts: Account[];
  inquiries: Inquiry[];
  disputes: Dispute[];
}

export interface CreditFactor {
  name: string;
  impact: 'Positive' | 'Negative' | 'Neutral';
  description: string;
  percentage?: number;
}

export interface Account {
  id: string;
  type: 'Credit Card' | 'Home Loan' | 'Personal Loan' | 'Car Loan' | 'Education Loan';
  lender: string;
  accountNumber: string;
  status: 'Active' | 'Closed' | 'Settled' | 'Written Off';
  openedDate: string;
  closedDate?: string;
  creditLimit?: number;
  outstandingBalance?: number;
  paymentHistory: PaymentHistory[];
}

export interface PaymentHistory {
  month: string;
  status: 'On Time' | 'Late' | 'Missed' | 'Settled';
  amount: number;
}

export interface Inquiry {
  id: string;
  date: string;
  lender: string;
  type: 'Hard' | 'Soft';
  purpose: string;
}

export interface Dispute {
  id: string;
  accountId: string;
  reason: string;
  status: 'Pending' | 'Resolved' | 'Rejected';
  submittedDate: string;
  resolvedDate?: string;
}

export interface GenerateReportRequest {
  userId: string;
  pan: string;
  purpose?: string;
}

export interface ReportFilters {
  search?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  minScore?: number;
  maxScore?: number;
  page?: number;
  limit?: number;
}

export interface ReportStats {
  total: number;
  active: number;
  pending: number;
  expired: number;
  disputed: number;
  averageScore: number;
}

