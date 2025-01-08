// React 18+ 不需要显式导入 React
// 但为了兼容性考虑，保留这行注释
// import React from 'react'
import { useState, useEffect } from 'react'
// React 18+ 不需要显式导入 React
// 但为了兼容性考虑，保留这行注释
// React 18+ 不需要显式导入 React
// 但为了兼容性考虑，保留这行注释
// // import React, { useState, useEffect } from 'react'
import type { SideTask } from '../../types/todo'

interface PomodoroTimerProps {
  taskId: number;      // 用于回调时识别主任务
  sideTask: SideTask; // 用于显示和控制番茄钟
  onComplete: (taskId: number, sideTaskId: number) => void;
  onProgressUpdate: (taskId: number, sideTaskId: number, progress: number) => void;
}

export function PomodoroTimer({ 
  // taskId 仅用于回调，由 TaskManager 使用
  taskId, 
  sideTask, 
  onComplete,
  onProgressUpdate 
}: PomodoroTimerProps) {
  const POMODORO_MINUTES = 5 // 一个番茄钟 5 分钟
  const [timeLeft, setTimeLeft] = useState(POMODORO_MINUTES * 60) // 秒数
  const [isRunning, setIsRunning] = useState(false)
  const [currentPomodoro, setCurrentPomodoro] = useState(1)

  useEffect(() => {
    let timer: number
    if (isRunning && timeLeft > 0) {
      timer = window.setInterval(() => {
        setTimeLeft(prev => {
          const newTimeLeft = prev - 1
          // 更新进度
          onProgressUpdate(taskId, sideTask.id, 1 - newTimeLeft / (POMODORO_MINUTES * 60))
          return newTimeLeft
        })
      }, 1000)
    } else if (timeLeft === 0) {
      // 一个番茄钟完成
      if (currentPomodoro < sideTask.pomodoroCount) {
        // 还有更多番茄钟要完成
        setCurrentPomodoro(prev => prev + 1)
        setTimeLeft(POMODORO_MINUTES * 60)
        setIsRunning(false)
      } else {
        // 所有番茄钟都完成了
        onComplete(taskId, sideTask.id)
      }
    }
    return () => clearInterval(timer)
  }, [isRunning, timeLeft, currentPomodoro, sideTask.pomodoroCount, onComplete, onProgressUpdate])

  const toggleTimer = () => {
    setIsRunning(prev => !prev)
  }

  const resetTimer = () => {
    setTimeLeft(POMODORO_MINUTES * 60)
    setIsRunning(false)
  }

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60

  return (
    <div style={{
      backgroundColor: '#f8fafc',
      padding: '16px',
      borderRadius: '8px',
      marginBottom: '16px'
    }}>
      <div style={{
        fontSize: '14px',
        color: '#666',
        marginBottom: '8px'
      }}>
        {sideTask.title} ({currentPomodoro}/{sideTask.pomodoroCount} 🍅)
      </div>
      
      <div style={{
        fontSize: '32px',
        fontWeight: 'bold',
        textAlign: 'center',
        fontFamily: 'monospace',
        marginBottom: '16px'
      }}>
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </div>

      {/* 进度条 */}
      <div style={{
        width: '100%',
        height: '4px',
        backgroundColor: '#e5e7eb',
        borderRadius: '2px',
        marginBottom: '16px'
      }}>
        <div
          style={{
            width: `${(timeLeft / (POMODORO_MINUTES * 60)) * 100}%`,
            height: '100%',
            backgroundColor: '#3b82f6',
            borderRadius: '2px',
            transition: 'width 1s linear'
          }}
        />
      </div>

      <div style={{
        display: 'flex',
        gap: '8px',
        justifyContent: 'center'
      }}>
        <button
          onClick={toggleTimer}
          style={{
            padding: '8px 16px',
            borderRadius: '4px',
            border: 'none',
            backgroundColor: isRunning ? '#ef4444' : '#22c55e',
            color: 'white',
            cursor: 'pointer'
          }}
        >
          {isRunning ? '一時停止' : 'スタート'}
        </button>
        <button
          onClick={resetTimer}
          style={{
            padding: '8px 16px',
            borderRadius: '4px',
            border: 'none',
            backgroundColor: '#e5e7eb',
            color: '#374151',
            cursor: 'pointer'
          }}
        >
          リセット
        </button>
      </div>
    </div>
  )
} 