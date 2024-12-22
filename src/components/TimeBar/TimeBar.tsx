import React from 'react'
import type { Task } from '../../types/todo'

interface TimeBarProps {
  task: Task;
  activeTaskInfo?: {
    sideTaskId: number;
    progress: number;
  } | null;
}

export function TimeBar({ task, activeTaskInfo }: TimeBarProps) {
  const totalTime = task.remainingTime // 总时间（分钟）
  const allocatedTime = task.sideTasks.reduce((sum, st) => sum + st.pomodoroCount * 5, 0) // 已分配时间（分钟）
  const completedTime = task.sideTasks
    .filter(st => st.completed)
    .reduce((sum, st) => sum + st.pomodoroCount * 5, 0) // 已完成时间（分钟）

  // 计算当前进行中的番茄钟时间
  const activeTask = activeTaskInfo ? task.sideTasks.find(st => st.id === activeTaskInfo.sideTaskId) : null
  const activeTime = activeTask ? activeTask.pomodoroCount * 5 * activeTaskInfo!.progress : 0

  // 计算总的完成时间（包括进行中的时间）
  const totalCompletedTime = completedTime + activeTime

  // 计算比例
  const remainingRatio = (totalTime - allocatedTime) / totalTime
  const completionRatio = totalCompletedTime / totalTime

  // 计算颜色
  const getStatusColor = () => {
    if (completionRatio >= 0.75 && remainingRatio >= 0.25) {
      return '#22c55e' // 绿色 - 状态良好
    } else if (completionRatio >= 0.75 && remainingRatio < 0.25) {
      return '#f97316' // 橙色 - 时间紧迫但任务接近完成
    } else if (completionRatio < 0.75 && remainingRatio < 0.25) {
      return '#ef4444' // 红色 - 任务未完成且时间紧迫
    } else {
      return '#3b82f6' // 蓝色 - 任务还需努力
    }
  }

  const barColor = getStatusColor()

  return (
    <div style={{ marginTop: '12px' }}>
      {/* 进度条 */}
      <div style={{
        width: '100%',
        height: '8px',
        backgroundColor: '#e5e7eb',
        borderRadius: '4px',
        overflow: 'hidden',
        position: 'relative'
      }}>
        {/* 已分配时间 */}
        <div style={{
          width: `${(allocatedTime / totalTime) * 100}%`,
          height: '100%',
          backgroundColor: barColor,
          position: 'absolute',
          left: 0,
          opacity: 0.3
        }} />
        {/* 已完成时间 */}
        <div style={{
          width: `${(completedTime / totalTime) * 100}%`,
          height: '100%',
          backgroundColor: barColor,
          position: 'absolute',
          left: 0
        }} />
        {/* 进行中的时间 */}
        {activeTaskInfo && (
          <div style={{
            width: `${(totalCompletedTime / totalTime) * 100}%`,
            height: '100%',
            backgroundColor: '#ef4444',
            position: 'absolute',
            left: `${(completedTime / totalTime) * 100}%`,
            transition: 'width 1s linear'
          }} />
        )}
      </div>

      {/* 状态信息 */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '8px',
        fontSize: '14px',
        color: '#666'
      }}>
        <div style={{
          display: 'flex',
          gap: '16px'
        }}>
          <span>
            配分済み: {Math.floor(allocatedTime / 60)}時間 {allocatedTime % 60}分
          </span>
          <span>
            完了: {Math.floor(completedTime / 60)}時間 {completedTime % 60}分
            {activeTaskInfo && (
              <span style={{ color: '#ef4444' }}>
                {' '}(+{Math.floor(activeTime)}分)
              </span>
            )}
          </span>
          <span>
            残り: {Math.floor((totalTime - allocatedTime) / 60)}時間 {(totalTime - allocatedTime) % 60}分
          </span>
        </div>
        <div style={{
          color: activeTaskInfo ? '#ef4444' : barColor,
          fontWeight: 'bold'
        }}>
          {activeTaskInfo ? '実行中...' : getStatusText(completionRatio, remainingRatio)}
        </div>
      </div>
    </div>
  )
}

// 获取状态文本
function getStatusText(completionRatio: number, remainingRatio: number) {
  if (completionRatio >= 0.75 && remainingRatio >= 0.25) {
    return '状態: 良好'
  } else if (completionRatio >= 0.75 && remainingRatio < 0.25) {
    return '状態: 時間切迫'
  } else if (completionRatio < 0.75 && remainingRatio < 0.25) {
    return '状態: 要注意'
  } else {
    return '状態: 進行中'
  }
} 