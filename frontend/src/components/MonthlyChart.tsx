import { Bar } from 'react-chartjs-2'

interface Props {
  monthly: Record<string, { income: number; expense: number }>
}

export default function MonthlyChart({ monthly }: Props) {
  const months = Object.keys(monthly).sort()

  const data = {
    labels: months,
    datasets: [
      {
        label: 'Income',
        data: months.map(m => monthly[m].income),
        backgroundColor: '#4CAF50',
      },
      {
        label: 'Expenses',
        data: months.map(m => monthly[m].expense),
        backgroundColor: '#f44336',
      },
    ],
  }

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
    },
    scales: {
      y: { beginAtZero: true },
    },
  }

  return (
    <div className="panel">
      <h2>Income vs Expenses (Monthly)</h2>
      {months.length === 0 ? (
        <p className="empty-msg">No monthly data yet.</p>
      ) : (
        <Bar data={data} options={options} />
      )}
    </div>
  )
}
