import React, { useState } from 'react'
import type { SubTask } from '../../types/todo'

interface SubTaskManagerProps {
  taskId: number;
  subTasks: SubTask[];
  onAddSubTask: (taskId: number, subTask: Omit<SubTask, 'id'>) => void;
  onUpdateSubTask: (taskId: number, subTaskId: number, status: 'pending' | 'completed') => void;
}

export function SubTaskManager({ 
  taskId, 
  subTasks, 
  onAddSubTask,
  onUpdateSubTask 
}: SubTaskManagerProps) {
  const [title, setTitle] = useState('')
  const [pomodoroCount, setPomodoroCount] = useState(1) // 默认1个番茄钟（5分钟）

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    onAddSubTask(taskId, {
      title: title.trim(),
      pomodoroCount,
      completedPomodoros: 0,
      status: 'pending'
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

      {/* 子任务输入表单 */}
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
          {/* 番茄钟数量选择器 */}
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
              <span style={{ fontWeight: 'bold' }}>{pomodoroCount}</span>
              <span style={{ color: '#666', fontSize: '14px' }}>
                🍅 ({pomodoroCount * 5}分)
              </span>
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
      <div style={{
        border: subTasks.length > 0 ? '1px solid #e5e7eb' : 'none',
        borderRadius: '4px'
      }}>
        {subTasks.length === 0 ? (
          <div style={{
            padding: '20px',
            textAlign: 'center',
            color: '#666'
          }}>
            サブタスクはまだありません
          </div>
        ) : (
          subTasks.map(subTask => (
            <div
              key={subTask.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '12px',
                borderBottom: '1px solid #e5e7eb',
                backgroundColor: subTask.status === 'completed' ? '#f8fafc' : 'white'
              }}
            >
              <input
                type="checkbox"
                checked={subTask.status === 'completed'}
                onChange={() => onUpdateSubTask(
                  taskId,
                  subTask.id,
                  subTask.status === 'completed' ? 'pending' : 'completed'
                )}
                style={{ marginRight: '12px' }}
              />
              <div style={{ flex: 1 }}>
                <div style={{
                  textDecoration: subTask.status === 'completed' ? 'line-through' : 'none',
                  color: subTask.status === 'completed' ? '#9ca3af' : 'inherit'
                }}>
                  {subTask.title}
                </div>
                <div style={{
                  fontSize: '12px',
                  color: '#666',
                  marginTop: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <span>{subTask.pomodoroCount} 🍅</span>
                  <span>({subTask.pomodoroCount * 5}分)</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 总计时间 */}
      {subTasks.length > 0 && (
        <div style={{
          marginTop: '16px',
          padding: '12px',
          backgroundColor: '#f8fafc',
          borderRadius: '4px'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '14px'
          }}>
            <span>合計:</span>
            <span>
              {subTasks.reduce((sum, st) => sum + st.pomodoroCount, 0)} 🍅
              ({subTasks.reduce((sum, st) => sum + (st.pomodoroCount * 5), 0)}分)
            </span>
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '14px',
            marginTop: '4px'
          }}>
            <span>完了:</span>
            <span>
              {subTasks.filter(st => st.status === 'completed').length} / {subTasks.length}
            </span>
          </div>
        </div>
      )}
    </div>
  )
} 