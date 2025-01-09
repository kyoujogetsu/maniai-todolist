import React, { useState } from 'react'
import type { SubTask } from '../../types/todo'

interface SubTaskInputProps {
  onAdd: (subTask: Omit<SubTask, 'id'>) => void;
  remainingTime: number;
}

export function SubTaskInput({ onAdd, remainingTime }: SubTaskInputProps) {
  const [title, setTitle] = useState('')
  const [estimatedTime, setEstimatedTime] = useState(30) // 默认30分钟

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    const newSubTask = {
      title: title.trim(),
      estimatedTime,
      status: 'pending' as const,
    }

    onAdd({
      title: newSubTask.title,
      estimatedTime: newSubTask.estimatedTime,
      status: "pending",
      completed: false,
      pomodoroCount: 0,
      taskId: someTaskId,
      completedPomodoros: 0
    })
    setTitle('')
    setEstimatedTime(30)
  }

  return (
    <form onSubmit={handleSubmit} style={{
      marginTop: '8px',
      padding: '12px',
      backgroundColor: '#f8fafc',
      borderRadius: '4px'
    }}>
      <div style={{ marginBottom: '8px' }}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="サブタスクを入力..."
          style={{
            width: '100%',
            padding: '6px',
            border: '1px solid #e5e7eb',
            borderRadius: '4px'
          }}
        />
      </div>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <input
          type="number"
          value={estimatedTime}
          onChange={(e) => setEstimatedTime(Number(e.target.value))}
          min={5}
          max={remainingTime}
          step={5}
          style={{
            width: '80px',
            padding: '6px',
            border: '1px solid #e5e7eb',
            borderRadius: '4px'
          }}
        />
        <span style={{ fontSize: '14px', color: '#666' }}>分</span>
        <button
          type="submit"
          style={{
            marginLeft: 'auto',
            backgroundColor: '#3b82f6',
            color: 'white',
            padding: '6px 12px',
            borderRadius: '4px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          追加
        </button>
      </div>
    </form>
  )
} 