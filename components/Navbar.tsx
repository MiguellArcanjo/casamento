'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { Menu, X, Home, Calendar, Gift, Users, FileText, DollarSign, CheckSquare, MapPin, Settings } from 'lucide-react'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/enxoval', label: 'Enxoval', icon: Gift },
  { href: '/planejamento', label: 'Evento', icon: MapPin },
  { href: '/tarefas', label: 'Tarefas', icon: CheckSquare },
  { href: '/financeiro', label: 'Financeiro', icon: DollarSign },
  { href: '/convidados', label: 'Convidados', icon: Users },
  { href: '/documentos', label: 'Documentos', icon: FileText },
  { href: '/anotacoes', label: 'Anotações', icon: Calendar },
  { href: '/admin', label: 'Configurações', icon: Settings },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
    router.refresh()
  }

  return (
    <>
      <nav className="bg-white shadow-md border-b border-wedding-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <span className="text-2xl font-serif font-bold text-wedding-700">
                💍 Nosso Casamento
              </span>
            </Link>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-wedding-50 touch-target"
              aria-label="Menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors touch-target ${
                      isActive
                        ? 'bg-wedding-100 text-wedding-700'
                        : 'text-gray-600 hover:bg-wedding-50'
                    }`}
                  >
                    {item.label}
                  </Link>
                )
              })}
              <button
                onClick={handleLogout}
                className="ml-4 px-4 py-2 text-sm text-gray-600 hover:text-wedding-700 touch-target"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </nav>

      {isOpen && (
        <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setIsOpen(false)}>
          <div className="bg-white w-64 h-full shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 border-b">
              <div className="flex justify-between items-center">
                <span className="text-xl font-serif font-bold text-wedding-700">
                  💍 Nosso Casamento
                </span>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-lg hover:bg-wedding-50 touch-target"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            <div className="py-4">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 text-sm font-medium transition-colors touch-target ${
                      isActive
                        ? 'bg-wedding-100 text-wedding-700 border-r-2 border-wedding-600'
                        : 'text-gray-600 hover:bg-wedding-50'
                    }`}
                  >
                    <Icon size={20} />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 px-4 py-3 text-sm font-medium text-gray-600 hover:bg-wedding-50 touch-target border-t mt-4"
              >
                <span>Sair</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

