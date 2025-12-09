'use client'

import { useState } from 'react'
import { Plus, DollarSign, TrendingUp, TrendingDown } from 'lucide-react'
import ExpenseForm from './ExpenseForm'
import DepositForm from './DepositForm'
import ExpenseList from './ExpenseList'
import DepositList from './DepositList'
import FinancialSummary from './FinancialSummary'

interface Expense {
  id: string
  name: string
  category: string
  estimatedValue: number
  actualValue: number | null
  paidBy: 'NOIVO' | 'NOIVA' | 'AMBOS'
  paymentStatus: 'A_PAGAR' | 'PAGO_PARCIALMENTE' | 'PAGO'
}

interface Deposit {
  id: string
  description: string
  amount: number
  paidBy: 'NOIVO' | 'NOIVA' | 'AMBOS'
  date: Date
}

interface Wedding {
  id: string
  financialGoal: number
  currency: string
}

export default function FinancialContent({
  initialExpenses,
  initialDeposits,
  wedding,
  categories,
  weddingId,
}: {
  initialExpenses: Expense[]
  initialDeposits: Deposit[]
  wedding: Wedding | null
  categories: string[]
  weddingId: string
}) {
  const [expenses, setExpenses] = useState(initialExpenses)
  const [deposits, setDeposits] = useState(initialDeposits)
  const [activeTab, setActiveTab] = useState<'expenses' | 'deposits' | 'summary'>('summary')
  const [showExpenseForm, setShowExpenseForm] = useState(false)
  const [showDepositForm, setShowDepositForm] = useState(false)
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null)
  const [editingDeposit, setEditingDeposit] = useState<Deposit | null>(null)

  const totalDeposits = deposits.reduce((sum, d) => sum + d.amount, 0)
  const financialGoal = wedding?.financialGoal || 0
  const remaining = financialGoal - totalDeposits

  const handleExpenseAdd = async (data: any) => {
    const url = editingExpense
      ? `/api/financeiro/expenses/${editingExpense.id}`
      : '/api/financeiro/expenses'
    const method = editingExpense ? 'PUT' : 'POST'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, weddingId }),
    })

    if (res.ok) {
      const expense = await res.json()
      if (editingExpense) {
        setExpenses(expenses.map((e) => (e.id === expense.id ? expense : e)))
      } else {
        setExpenses([...expenses, expense])
      }
      setShowExpenseForm(false)
      setEditingExpense(null)
    }
  }

  const handleDepositAdd = async (data: any) => {
    const url = editingDeposit
      ? `/api/financeiro/deposits/${editingDeposit.id}`
      : '/api/financeiro/deposits'
    const method = editingDeposit ? 'PUT' : 'POST'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, weddingId }),
    })

    if (res.ok) {
      const deposit = await res.json()
      if (editingDeposit) {
        setDeposits(deposits.map((d) => (d.id === deposit.id ? deposit : d)))
      } else {
        setDeposits([deposit, ...deposits])
      }
      setShowDepositForm(false)
      setEditingDeposit(null)
    }
  }

  const handleDeleteExpense = async (id: string) => {
    const res = await fetch(`/api/financeiro/expenses/${id}`, {
      method: 'DELETE',
    })

    if (res.ok) {
      setExpenses(expenses.filter((e) => e.id !== id))
    }
  }

  const handleDeleteDeposit = async (id: string) => {
    const res = await fetch(`/api/financeiro/deposits/${id}`, {
      method: 'DELETE',
    })

    if (res.ok) {
      setDeposits(deposits.filter((d) => d.id !== id))
    }
  }

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-md p-2">
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('summary')}
            className={`flex-1 px-4 py-2 rounded-lg font-medium touch-target ${
              activeTab === 'summary'
                ? 'bg-wedding-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Resumo
          </button>
          <button
            onClick={() => setActiveTab('expenses')}
            className={`flex-1 px-4 py-2 rounded-lg font-medium touch-target ${
              activeTab === 'expenses'
                ? 'bg-wedding-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Gastos
          </button>
          <button
            onClick={() => setActiveTab('deposits')}
            className={`flex-1 px-4 py-2 rounded-lg font-medium touch-target ${
              activeTab === 'deposits'
                ? 'bg-wedding-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Depósitos
          </button>
        </div>
      </div>

      {/* Content */}
      {activeTab === 'summary' && (
        <FinancialSummary
          expenses={expenses}
          deposits={deposits}
          financialGoal={financialGoal}
          currency={wedding?.currency || 'R$'}
        />
      )}

      {activeTab === 'expenses' && (
        <div className="space-y-4">
          <button
            onClick={() => {
              setEditingExpense(null)
              setShowExpenseForm(true)
            }}
            className="w-full bg-wedding-600 text-white py-4 rounded-xl font-medium hover:bg-wedding-700 transition-colors flex items-center justify-center space-x-2 touch-target shadow-lg"
          >
            <Plus size={20} />
            <span>Adicionar Gasto</span>
          </button>
          <ExpenseList
            expenses={expenses}
            categories={categories}
            onEdit={(expense) => {
              setEditingExpense(expense)
              setShowExpenseForm(true)
            }}
            onDelete={handleDeleteExpense}
          />
        </div>
      )}

      {activeTab === 'deposits' && (
        <div className="space-y-4">
          <button
            onClick={() => {
              setEditingDeposit(null)
              setShowDepositForm(true)
            }}
            className="w-full bg-wedding-600 text-white py-4 rounded-xl font-medium hover:bg-wedding-700 transition-colors flex items-center justify-center space-x-2 touch-target shadow-lg"
          >
            <Plus size={20} />
            <span>Adicionar Depósito</span>
          </button>
          <DepositList
            deposits={deposits}
            onEdit={(deposit) => {
              setEditingDeposit(deposit)
              setShowDepositForm(true)
            }}
            onDelete={handleDeleteDeposit}
          />
        </div>
      )}

      {/* Modals */}
      {showExpenseForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <ExpenseForm
              categories={categories}
              initialData={editingExpense}
              onSubmit={handleExpenseAdd}
              onCancel={() => {
                setShowExpenseForm(false)
                setEditingExpense(null)
              }}
            />
          </div>
        </div>
      )}

      {showDepositForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <DepositForm
              initialData={editingDeposit}
              onSubmit={handleDepositAdd}
              onCancel={() => {
                setShowDepositForm(false)
                setEditingDeposit(null)
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}

