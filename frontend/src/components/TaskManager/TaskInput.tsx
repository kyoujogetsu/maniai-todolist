import React, { useState } from 'react'

interface TaskInputProps {
  onSubmit: (title: string, deadline?: Date, pomodoroCount?: number) => void;
  type: 'main' | 'side';
}

export function TaskInput({ onSubmit, type }: TaskInputProps) {
  const [title, setTitle] = useState('')
  const [deadline, setDeadline] = useState<Date>(new Date())
  const [pomodoroCount, setPomodoroCount] = useState(1)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    if (type === 'main') {
      onSubmit(title.trim(), deadline)
    } else {
      onSubmit(title.trim(), undefined, pomodoroCount)
    }

    setTitle('')
    setPomodoroCount(1)
  }

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ marginBottom: '12px' }}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={type === 'main' ? "タスクを入力..." : "サブタスクを入力..."}
          style={{
            width: '100%',
            padding: '8px',
            border: '1px solid #e5e7eb',
            borderRadius: '4px'
          }}
        />
      </div>

      {type === 'main' && (
        <div style={{ marginBottom: '12px' }}>
          <input
            type="datetime-local"
            onChange={(e) => setDeadline(new Date(e.target.value))}
            min={new Date().toISOString().slice(0, 16)}
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #e5e7eb',
              borderRadius: '4px'
            }}
          />
        </div>
      )}
      
      {type === 'side' && (
        <div style={{ 
          display: 'flex', 
          alignItems: 'center',
          gap: '8px',
          marginBottom: '12px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            border: '1px solid #e5e7eb',
            borderRadius: '4px',
            overflow: 'hidden'
          }}>
            <button
              type="button"
              onClick={() => setPomodoroCount(Math.max(1, pomodoroCount - 1))}
              style={{
                padding: '8px 12px',
                border: 'none',
                borderRight: '1px solid #e5e7eb',
                backgroundColor: 'white',
                cursor: 'pointer'
              }}
            >
              -
            </button>
            <div style={{ 
              padding: '0 12px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px' 
            }}>
              <span>{pomodoroCount}</span>
              <span style={{ color: '#666' }}>🍅</span>
            </div>
            <button
              type="button"
              onClick={() => setPomodoroCount(pomodoroCount + 1)}
              style={{
                padding: '8px 12px',
                border: 'none',
                borderLeft: '1px solid #e5e7eb',
                backgroundColor: 'white',
                cursor: 'pointer'
              }}
            >
              +
            </button>
          </div>
          <div style={{ color: '#666', fontSize: '14px' }}>
            {pomodoroCount * 5}分
          </div>
        </div>
      )}

      <button
        type="submit"
        style={{
          backgroundColor: '#3b82f6',
          color: 'white',
          padding: '8px 16px',
          borderRadius: '4px',
          border: 'none',
          cursor: 'pointer',
          width: type === 'main' ? 'auto' : '100%'
        }}
      >
        {type === 'main' ? '追加' : 'サブタスクを追加'}
      </button>
    </form>
  )
} 