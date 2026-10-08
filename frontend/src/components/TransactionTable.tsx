import { deleteTransaction } from '../api/client'
import type { Transaction } from '../types'

interface Props {
  transactions: Transaction[]
  onDelete: () => void
}

const fmt = (n: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(n)

export default function TransactionTable({ transactions, onDelete }: Props) {
  async function handleDelete(id: number) {
    try {
      await deleteTransaction(id)
      onDelete()
    } catch {
      alert('Failed to delete transaction.')
    }
  }

  return (
    <div className="panel table-wrap">
      <h2>Transaction History</h2>
      {transactions.length === 0 ? (
        <p className="empty-msg">No transactions yet.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Description</th>
              <th>Type</th>
              <th>Category</th>
              <th>Amount</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(t => (
              <tr key={t.id} className={t.type}>
                <td>{t.date}</td>
                <td>{t.description}</td>
                <td className={`badge ${t.type}`}>{t.type}</td>
                <td>{t.category}</td>
                <td>{fmt(t.amount)}</td>
                <td>
                  <button className="btn-delete" onClick={() => handleDelete(t.id)}>✕</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
