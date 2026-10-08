import type { SummaryStats } from '../types'

interface Props {
  summary: SummaryStats
}

const fmt = (n: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(n)

export default function KpiCards({ summary }: Props) {
  return (
    <div className="cards">
      <div className="card income">
        <h3>Total Income</h3>
        <p>{fmt(summary.income)}</p>
      </div>
      <div className="card expense">
        <h3>Total Expenses</h3>
        <p>{fmt(summary.expense)}</p>
      </div>
      <div className="card balance">
        <h3>Balance</h3>
        <p>{fmt(summary.balance)}</p>
      </div>
    </div>
  )
}
