// React 18+ 不需要显式导入 React
// 但为了兼容性考虑，保留这行注释
// import React from 'react'
import { useState } from 'react'
// React 18+ 不需要显式导入 React
// 但为了兼容性考虑，保留这行注释
// React 18+ 不需要显式导入 React
// 但为了兼容性考虑，保留这行注释
// // import React, { useState } from 'react'
import type { SideTask } from '../../types/todo'
import styles from './Timeline.module.css';

interface TimelineProps {
  sideTasks: SideTask[];
  remainingTime: number;
  activeTaskId?: number;
  activeTaskProgress?: number;
}

export function Timeline({ 
  sideTasks, 
  remainingTime,
  activeTaskId,
  activeTaskProgress = 0
}: TimelineProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <div className={styles.timelineContainer}>
      {/* 折叠按钮 */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          padding: '4px 8px',
          borderRadius: '4px',
          border: '1px solid #e5e7eb',
          backgroundColor: 'white',
          cursor: 'pointer',
          fontSize: '14px',
          color: '#666',
          marginBottom: '12px'
        }}
      >
        {isCollapsed ? '▶' : '▼'} {sideTasks.length}個のタスク
      </button>

      {/* 折叠的内容 */}
      {!isCollapsed && (
        <div className={styles.taskContainer}>
          {sideTasks.map((task) => (
            <div
              key={task.id}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                marginBottom: '12px',
                position: 'relative'
              }}
            >
              {/* 时间点 */}
              <div style={{
                position: 'absolute',
                left: '-20px',
                top: '2px',
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                backgroundColor: task.completed ? '#22c55e' : 
                  (activeTaskId === task.id ? '#ef4444' : '#94a3b8'),
                border: '2px solid white'
              }} />

              {/* 任务内容 */}
              <div style={{
                flex: 1,
                backgroundColor: task.completed ? '#f0fdf4' : 
                  (activeTaskId === task.id ? '#fef2f2' : 'white'),
                padding: '8px 12px',
                borderRadius: '4px',
                border: '1px solid',
                borderColor: task.completed ? '#86efac' : 
                  (activeTaskId === task.id ? '#fecaca' : '#e5e7eb'),
                position: 'relative',
                overflow: 'hidden'
              }}>
                {/* 进度条（仅在活动任务显示） */}
                {activeTaskId === task.id && (
                  <div style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: `${activeTaskProgress * 100}%`,
                    backgroundColor: '#ef4444',
                    opacity: 0.1,
                    transition: 'width 1s linear'
                  }} />
                )}

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  position: 'relative'
                }}>
                  <span style={{
                    textDecoration: task.completed ? 'line-through' : 'none',
                    color: task.completed ? '#666' : 'inherit'
                  }}>
                    {task.title}
                  </span>
                  <span style={{
                    fontSize: '12px',
                    color: '#666',
                    backgroundColor: activeTaskId === task.id ? '#fef2f2' : '#f8fafc',
                    padding: '2px 6px',
                    borderRadius: '4px'
                  }}>
                    {task.pomodoroCount} 🍅 ({task.pomodoroCount * 5}分)
                    {activeTaskId === task.id && (
                      <span style={{ marginLeft: '4px', color: '#ef4444' }}>
                        実行中...
                      </span>
                    )}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
} 