import { Doughnut } from 'react-chartjs-2'

interface Props {
  categories: Record<string, number>
}

const COLORS = [
  '#FF6384', '#36A2EB', '#FFCE56', '#4CAF50',
  '#9C27B0', '#FF5722', '#00BCD4', '#FFC107',
]

export default function CategoryChart({ categories }: Props) {
  const labels = Object.keys(categories)
  const values = Object.values(categories)

  const data = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: COLORS.slice(0, labels.length),
        borderWidth: 1,
      },
    ],
  }

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'bottom' as const },
    },
  }

  return (
    <div className="panel">
      <h2>Spending by Category</h2>
      {labels.length === 0 ? (
        <p className="empty-msg">No expense data yet.</p>
      ) : (
        <Doughnut data={data} options={options} />
      )}
    </div>
  )
}
