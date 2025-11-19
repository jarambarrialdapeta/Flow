export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE'
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: TransactionType;
  category: string;
}

export interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number; // Percentage change
  holdings: number; // Quantity owned
}

export interface InvestmentHistory {
  date: string;
  value: number;
}

export interface FinancialSummary {
  totalBalance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  portfolioValue: number;
}
