export interface Transaction {
  id: number
  description: string
  amount: number
  type: 'income' | 'expense'
  category: string
  date: string
}

export interface TransactionCreate {
  description: string
  amount: number
  type: 'income' | 'expense'
  category: string
  date: string
}

export interface SummaryStats {
  income: number
  expense: number
  balance: number
}

export interface DashboardData {
  summary: SummaryStats
  categories: Record<string, number>
  monthly: Record<string, { income: number; expense: number }>
  transactions: Transaction[]
}
