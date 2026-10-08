import { useState, useEffect, useCallback } from 'react'
import './App.css'
import { fetchDashboard } from './api/client'
import type { DashboardData } from './types'
import KpiCards from './components/KpiCards'
import TransactionForm from './components/TransactionForm'
import TransactionTable from './components/TransactionTable'
import CategoryChart from './components/CategoryChart'
import MonthlyChart from './components/MonthlyChart'

export default function App() {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null)
  const [error, setError] = useState('')

  const refresh = useCallback(async () => {
    try {
      const data = await fetchDashboard()
      setDashboard(data)
      setError('')
    } catch {
      setError('Could not load data. Is the backend running?')
    }
  }, [])

  useEffect(() => { refresh() }, [refresh])

  if (error) return <p className="center-msg">{error}</p>
  if (!dashboard) return <p className="center-msg">Loading…</p>

  return (
    <>
      <header className="topbar">💸 SmartSpend AI</header>
      <main className="container">
        <KpiCards summary={dashboard.summary} />
        <div className="two-col">
          <TransactionForm onSuccess={refresh} />
          <CategoryChart categories={dashboard.categories} />
        </div>
        <MonthlyChart monthly={dashboard.monthly} />
        <TransactionTable transactions={dashboard.transactions} onDelete={refresh} />
      </main>
    </>
  )
}
