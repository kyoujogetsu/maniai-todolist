import React, { useState } from 'react'
import type { SideTask } from '../../types/todo'

interface SideTaskManagerProps {
  taskId: number;
  sideTasks: SideTask[];
  onAddSideTask: (taskId: number, sideTask: Omit<SideTask, 'id'>) => void;
  onUpdateSideTask: (taskId: number, sideTaskId: number, completed: boolean) => void;
}

export function SideTaskManager({
  taskId,
  sideTasks,
  onAddSideTask,
  onUpdateSideTask
}: SideTaskManagerProps) {
  const [title, setTitle] = useState('')
  const [pomodoroCount, setPomodoroCount] = useState(1)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    onAddSideTask(taskId, {
      title: title.trim(),
      pomodoroCount,
      completed: false
    })

    setTitle('')
    setPomodoroCount(1)
  }

  return (
    <div>
      <h3 style={{ 
        fontSize: '18px', 
        fontWeight: 'bold',
        marginBottom: '16px'
      }}>
        ポモドーロタスク
      </h3>

      {/* 输入表单 */}
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <div style={{ marginBottom: '12px' }}>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="サブタスクを入力..."
            style={{
              width: '100%',
              padding: '8px',
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
          <button
            type="submit"
            style={{
              marginLeft: 'auto',
              padding: '8px 16px',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            追加
          </button>
        </div>
      </form>

      {/* 子任务列表 */}
      <div>
        {sideTasks.map(task => (
          <div
            key={task.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '12px',
              borderBottom: '1px solid #e5e7eb',
              backgroundColor: task.completed ? '#f8fafc' : 'white'
            }}
          >
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => onUpdateSideTask(taskId, task.id, !task.completed)}
              style={{ marginRight: '12px' }}
            />
            <div style={{ flex: 1 }}>
              <div style={{
                textDecoration: task.completed ? 'line-through' : 'none',
                color: task.completed ? '#9ca3af' : 'inherit'
              }}>
                {task.title}
              </div>
              <div style={{
                fontSize: '12px',
                color: '#666',
                marginTop: '4px'
              }}>
                {task.pomodoroCount} 🍅 ({task.pomodoroCount * 5}分)
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 总计 */}
      {sideTasks.length > 0 && (
        <div style={{
          marginTop: '16px',
          padding: '12px',
          backgroundColor: '#f8fafc',
          borderRadius: '4px',
          fontSize: '14px'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between'
          }}>
            <span>合計時間:</span>
            <span>
              {sideTasks.reduce((sum, task) => sum + task.pomodoroCount * 5, 0)}分
              ({sideTasks.reduce((sum, task) => sum + task.pomodoroCount, 0)} 🍅)
            </span>
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '4px'
          }}>
            <span>完了:</span>
            <span>
              {sideTasks.filter(task => task.completed).length} / {sideTasks.length}
            </span>
          </div>
        </div>
      )}
    </div>
  )
} 