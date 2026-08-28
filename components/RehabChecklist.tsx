'use client'

import { useEffect, useState } from 'react'
import { last7Days, formatWeekday, todayString } from '@/lib/dates'

type RehabTask = {
  id: string
  title: string
  description: string | null
  recentCompletions: string[]
}

export default function RehabChecklist() {
  const [tasks, setTasks] = useState<RehabTask[]>([])
  const [loading, setLoading] = useState(true)
  const [togglingId, setTogglingId] = useState<string | null>(null)
  const today = todayString()
  const days = last7Days()

  const load = () => {
    fetch('/api/patient/rehab-tasks')
      .then((res) => res.json())
      .then((data) => setTasks(data.tasks || []))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [])

  const toggleToday = async (taskId: string) => {
    setTogglingId(taskId)
    try {
      await fetch(`/api/patient/rehab-tasks/${taskId}/complete`, { method: 'POST' })
      load()
    } finally {
      setTogglingId(null)
    }
  }

  if (loading) return <p className="text-sm text-slate-custom">Loading your rehabilitation plan...</p>

  if (tasks.length === 0) {
    return <p className="text-sm text-slate-custom">Your doctor hasn&apos;t assigned any daily rehabilitation tasks yet.</p>
  }

  return (
    <div className="flex flex-col gap-4">
      {tasks.map((task) => {
        const doneToday = task.recentCompletions.includes(today)
        return (
          <div key={task.id} className="border border-slate-200 rounded-xl p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <button
                  onClick={() => toggleToday(task.id)}
                  disabled={togglingId === task.id}
                  className={`mt-0.5 size-6 rounded-md border-2 flex items-center justify-center shrink-0 transition-all disabled:opacity-50 ${
                    doneToday ? 'bg-primary border-primary' : 'border-slate-300 hover:border-primary'
                  }`}
                >
                  {doneToday && <span className="material-symbols-outlined text-background-dark text-base">check</span>}
                </button>
                <div>
                  <p className="font-bold text-background-dark text-sm">{task.title}</p>
                  {task.description && <p className="text-xs text-slate-custom mt-0.5">{task.description}</p>}
                </div>
              </div>
            </div>

            <div className="flex gap-1.5 mt-4 pl-9">
              {days.map((day) => {
                const done = task.recentCompletions.includes(day)
                const isToday = day === today
                return (
                  <div key={day} className="flex flex-col items-center gap-1">
                    <span className="text-[10px] text-slate-400 font-semibold">{formatWeekday(day)[0]}</span>
                    <div
                      className={`size-5 rounded-full flex items-center justify-center ${
                        done ? 'bg-primary' : 'bg-slate-100'
                      } ${isToday ? 'ring-2 ring-primary/40 ring-offset-1' : ''}`}
                    >
                      {done && <span className="material-symbols-outlined text-background-dark text-xs">check</span>}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
