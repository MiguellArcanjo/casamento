'use client'

import { useState, useEffect } from 'react'
import { differenceInDays, differenceInHours, differenceInMinutes, differenceInSeconds } from 'date-fns'

interface CountdownTimerProps {
  targetDate: Date
}

export default function CountdownTimer({ targetDate }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    total: 0,
  })

  const [prevValues, setPrevValues] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date()
      const total = targetDate.getTime() - now.getTime()

      if (total <= 0) {
        return {
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          total: 0,
        }
      }

      const days = differenceInDays(targetDate, now)
      const hours = differenceInHours(targetDate, now) % 24
      const minutes = differenceInMinutes(targetDate, now) % 60
      const seconds = differenceInSeconds(targetDate, now) % 60

      return { days, hours, minutes, seconds, total }
    }

    // Calcular imediatamente
    const initial = calculateTimeLeft()
    setTimeLeft(initial)
    setPrevValues(initial)

    // Atualizar a cada segundo
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = calculateTimeLeft()
        setPrevValues(prev)
        return newTime
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [targetDate])

  if (timeLeft.total <= 0) {
    return (
      <div className="text-center">
        <div className="text-3xl md:text-4xl font-bold animate-pulse">
          É hoje! 🎉
        </div>
      </div>
    )
  }

  const TimeUnit = ({ 
    value, 
    label, 
    prevValue 
  }: { 
    value: number
    label: string
    prevValue: number
  }) => {
    const isChanging = value !== prevValue

    return (
      <div className="flex flex-col items-center">
        <div className="relative w-full">
          {/* Card com fundo */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 md:p-4 border border-white/20 shadow-lg">
            <div className="relative h-16 md:h-20 flex items-center justify-center">
              {/* Número anterior (fade out) */}
              {isChanging && (
                <div 
                  key={`prev-${prevValue}`}
                  className="absolute inset-0 flex items-center justify-center text-4xl md:text-5xl font-bold text-white/30 transition-all duration-500 animate-fade-out"
                >
                  {String(prevValue).padStart(2, '0')}
                </div>
              )}
              
              {/* Número atual (fade in) */}
              <div 
                key={`current-${value}`}
                className={`text-4xl md:text-5xl font-bold text-white transition-all duration-300 ${
                  isChanging ? 'animate-bounce-in' : ''
                }`}
              >
                {String(value).padStart(2, '0')}
              </div>
            </div>
          </div>
          
          {/* Label */}
          <div className="mt-2 text-xs md:text-sm text-white/90 font-medium uppercase tracking-wider">
            {label}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-4 gap-2 md:gap-3">
        <TimeUnit 
          value={timeLeft.days} 
          label="Dias" 
          prevValue={prevValues.days}
        />
        <TimeUnit 
          value={timeLeft.hours} 
          label="Horas" 
          prevValue={prevValues.hours}
        />
        <TimeUnit 
          value={timeLeft.minutes} 
          label="Minutos" 
          prevValue={prevValues.minutes}
        />
        <TimeUnit 
          value={timeLeft.seconds} 
          label="Segundos" 
          prevValue={prevValues.seconds}
        />
      </div>
      <div className="mt-6 text-center">
        <div className="inline-block px-4 py-2 bg-white/20 rounded-full backdrop-blur-sm border border-white/30">
          <span className="text-white text-sm md:text-base font-medium">
            Faltam {timeLeft.days} {timeLeft.days === 1 ? 'dia' : 'dias'} para o grande dia! 💕
          </span>
        </div>
      </div>
    </div>
  )
}

