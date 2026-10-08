import { useState } from 'react'
import { addTransaction } from '../api/client'
import type { TransactionCreate } from '../types'

interface Props {
  onSuccess: () => void
}

const CATEGORIES = [
  'Food', 'Transport', 'Shopping', 'Bills',
  'Entertainment', 'Health', 'Education', 'Other',
]

const EMPTY: TransactionCreate = {
  description: '',
  amount: 0,
  type: 'expense',
  category: 'Food',
  date: new Date().toISOString().slice(0, 10),
}

export default function TransactionForm({ onSuccess }: Props) {
  const [form, setForm] = useState<TransactionCreate>(EMPTY)
  const [error, setError] = useState('')

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: name === 'amount' ? parseFloat(value) || 0 : value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!form.description.trim()) { setError('Description is required'); return }
    if (form.amount <= 0) { setError('Amount must be positive'); return }
    try {
      await addTransaction(form)
      setForm(EMPTY)
      onSuccess()
    } catch {
      setError('Failed to add transaction. Please try again.')
    }
  }

  return (
    <div className="panel">
      <h2>Add Transaction</h2>
      {error && <p className="form-error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Description</label>
          <input name="description" value={form.description} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Amount (₹)</label>
          <input name="amount" type="number" min="0.01" step="0.01" value={form.amount || ''} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Type</label>
          <select name="type" value={form.type} onChange={handleChange}>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>
        <div className="form-group">
          <label>Category</label>
          <select name="category" value={form.category} onChange={handleChange}>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label>Date</label>
          <input name="date" type="date" value={form.date} onChange={handleChange} required />
        </div>
        <button type="submit" className="btn-submit">Add Transaction</button>
      </form>
    </div>
  )
}
