'use client'

import { useEffect, useState } from 'react'
import { last7Days, formatWeekday } from '@/lib/dates'

type RehabTask = {
  id: string
  title: string
  description: string | null
  active: boolean
  recentCompletions: string[]
}

export default function RehabTaskManager({ patientId }: { patientId: string }) {
  const [tasks, setTasks] = useState<RehabTask[]>([])
  const [loading, setLoading] = useState(true)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const days = last7Days()

  const load = () => {
    setLoading(true)
    fetch(`/api/doctor/patients/${patientId}/rehab-tasks`)
      .then((res) => res.json())
      .then((data) => setTasks(data.tasks || []))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patientId])

  const addTask = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    setSubmitting(true)
    try {
      await fetch(`/api/doctor/patients/${patientId}/rehab-tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description }),
      })
      setTitle('')
      setDescription('')
      load()
    } finally {
      setSubmitting(false)
    }
  }

  const toggleActive = async (task: RehabTask) => {
    await fetch(`/api/doctor/rehab-tasks/${task.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: !task.active }),
    })
    load()
  }

  return (
    <div>
      <h3 className="text-lg font-bold text-background-dark mb-1">Daily Rehabilitation</h3>
      <p className="text-sm text-slate-custom mb-4">Assign tasks for this patient to complete each day.</p>

      <form onSubmit={addTask} className="flex flex-col sm:flex-row gap-2 mb-6">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task title (e.g. 30 min walk)"
          className="flex-1 px-4 py-2.5 rounded-lg border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm"
        />
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Notes (optional)"
          className="flex-1 px-4 py-2.5 rounded-lg border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm"
        />
        <button
          type="submit"
          disabled={submitting || !title.trim()}
          className="bg-primary text-background-dark px-5 py-2.5 rounded-lg text-sm font-bold hover:opacity-90 transition-all disabled:opacity-50 whitespace-nowrap"
        >
          Add Task
        </button>
      </form>

      {loading ? (
        <p className="text-sm text-slate-custom">Loading tasks...</p>
      ) : tasks.length === 0 ? (
        <p className="text-sm text-slate-custom">No rehabilitation tasks assigned yet.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {tasks.map((task) => (
            <div key={task.id} className={`border rounded-xl p-4 ${task.active ? 'border-slate-200' : 'border-slate-100 opacity-50'}`}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-bold text-background-dark text-sm">{task.title}</p>
                  {task.description && <p className="text-xs text-slate-custom mt-0.5">{task.description}</p>}
                </div>
                <button
                  onClick={() => toggleActive(task)}
                  className="text-xs font-bold text-slate-custom hover:text-red-500 transition-colors whitespace-nowrap"
                >
                  {task.active ? 'Deactivate' : 'Reactivate'}
                </button>
              </div>
              <div className="flex gap-1.5 mt-3">
                {days.map((day) => {
                  const done = task.recentCompletions.includes(day)
                  return (
                    <div key={day} className="flex flex-col items-center gap-1">
                      <span className="text-[10px] text-slate-400 font-semibold">{formatWeekday(day)[0]}</span>
                      <div className={`size-4 rounded-full ${done ? 'bg-primary' : 'bg-slate-100'}`} />
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
