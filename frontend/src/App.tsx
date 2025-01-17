// React 18+ 不需要显式导入 React
// 但为了兼容性考虑，保留这行注释
// import React from 'react'
import { useState, useEffect } from 'react'
// React 18+ 不需要显式导入 React
// 但为了兼容性考虑，保留这行注释
// React 18+ 不需要显式导入 React
// 但为了兼容性考虑，保留这行注释
// // import React, { useState, useEffect } from 'react'
import { Timeline } from './components/Timeline/Timeline'
import { TaskManager } from './components/TaskManager/TaskManager'
import { TaskInput } from './components/TaskManager/TaskInput'
import { TimeBar } from './components/TimeBar/TimeBar'
import type { Task, ViewMode, SideTask, CompletionRecord } from './types/todo'
import { TaskCompletionStatus } from './types/todo'
import styles from './components/Timeline/Timeline.module.css'
import { saveCompletionRecord } from './utils/storage'
import { getCompletionRecords } from './utils/storage'
import { CompletionChart } from './components/CompletionChart/CompletionChart'

// 定义颜色映射
const STATUS_COLORS = {
  [TaskCompletionStatus.NOT_IN_TIME]: 'text-red-400 hover:text-red-500',
  [TaskCompletionStatus.JUST_IN_TIME]: 'text-yellow-400 hover:text-yellow-500',
  [TaskCompletionStatus.WITH_SPARE]: 'text-green-400 hover:text-green-500'
} as const;

// 1. 添加任务状态类型
type TaskStatus = 'active' | 'completed';

// 2. 修改 Task 接口，添加新属性
interface Task {
  // ... 现有属性 ...
  status: TaskStatus;
  completedAt?: Date;
  completionStatus?: TaskCompletionStatus;
}

function App() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [viewMode, setViewMode] = useState<ViewMode>('maniai')
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null)
  const [activeTaskInfo, setActiveTaskInfo] = useState<{
    taskId: number;
    sideTaskId: number;
    progress: number;
  } | null>(null)
  const [showTooltip, setShowTooltip] = useState(false)
  const [taskToFinish, setTaskToFinish] = useState<Task['id'] | null>(null)
  const [completionRecords, setCompletionRecords] = useState<CompletionRecord[]>([])
  const [showStats, setShowStats] = useState(false)

  // 更新剩余时间
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date()
      setTasks(prevTasks => prevTasks.map(task => ({
        ...task,
        remainingTime: Math.max(0, Math.floor((task.deadline.getTime() - now.getTime()) / (1000 * 60)))
      })))
    }, 60000)

    return () => clearInterval(timer)
  }, [])

  // 添加初始加载
  useEffect(() => {
    const records = getCompletionRecords();
    setCompletionRecords(records);
  }, []);

  // 添加主任务
  const handleAddTask = (title: string, deadline?: Date) => {
    if (!deadline) return; // 确保 deadline 存在
    const now = new Date();
    const remainingTime = Math.max(0, Math.floor((deadline.getTime() - now.getTime()) / (1000 * 60)));
    
    const task: Task = {
      id: Date.now(),
      title: title.trim(),
      deadline: deadline,
      remainingTime: remainingTime,
      sideTasks: [],
      status: 'active'
    }
    setTasks(prev => [...prev, task])
  }

  // 添加子任务
  const handleAddSideTask = (taskId: number, title: string, pomodoroCount: number) => {
    setTasks(prevTasks => prevTasks.map(task => {
      if (task.id === taskId) {
        const newSideTask: SideTask = {
          id: Date.now(),
          title,
          pomodoroCount,
          completed: false
        }
        return {
          ...task,
          sideTasks: [...task.sideTasks, newSideTask]
        }
      }
      return task
    }))
  }

  // 完成/取消完成子任务
  const handleCompleteSideTask = (taskId: number, sideTaskId: number) => {
    setTasks(prevTasks => prevTasks.map(task => {
      if (task.id === taskId) {
        return {
          ...task,
          sideTasks: task.sideTasks.map(st => 
            st.id === sideTaskId 
              ? { ...st, completed: !st.completed }
              : st
          )
        }
      }
      return task
    }))
  }

  // 切换视图式时的处理
  const handleModeChange = (newMode: ViewMode) => {
    setViewMode(newMode)
    if (newMode === 'sidetask') {
      setShowTooltip(true)
      if (!selectedTaskId && tasks.length > 0) {
        setSelectedTaskId(tasks[0].id)
      }
    }
  }

  // 更新活动任务信息的处理函数
  const handleActiveTaskUpdate = (
    taskId: number,
    sideTaskId: number,
    progress: number
  ) => {
    setActiveTaskInfo({ taskId, sideTaskId, progress })
  }

  // 清除活动任务信息
  const handleActiveTaskComplete = () => {
    setActiveTaskInfo(null)
  }

  // 在 App 组件中添加处理函数
  const handleReorderSideTasks = (taskId: number, newSideTasks: SideTask[]) => {
    setTasks(prevTasks => {
      const newTasks = prevTasks.map(task => 
        task.id === taskId ? { ...task, sideTasks: newSideTasks } : task
      );
      return newTasks;
    });
  };

  const handleDeleteSideTask = (taskId: number, sideTaskId: number) => {
    setTasks(prevTasks => prevTasks.map(task => 
      task.id === taskId 
        ? { ...task, sideTasks: task.sideTasks.filter(st => st.id !== sideTaskId) }
        : task
    ));
  };

  const updateTaskStatus = async (taskId: string, completed: boolean) => {
    // 这里实现更新任务状态的逻辑
    // 可以是 API 调用或本地状态更新
    return true;  // 暂时返回 true
  };

  // 3. 修改处理任务完成的函数
  const handleTaskCompletion = async (taskId: Task['id'], completionStatus: TaskCompletionStatus) => {
    try {
      setTasks(prev => prev.map(task => 
        task.id === taskId 
          ? {
              ...task,
              status: 'completed',
              completedAt: new Date(),
              completionStatus
            }
          : task
      ));
      
      const newRecord: CompletionRecord = {
        taskId,
        completionStatus,
        completedAt: new Date()
      };
      setCompletionRecords(prev => [...prev, newRecord]);
      setShowStats(true);
    } catch (error) {
      console.error('完成任务时出错:', error);
    }
  };

  const handleTaskAbandon = (taskId: Task['id']) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
    setTaskToFinish(null);
  };

  // 添加完成处理函数
  const handleTaskComplete = (taskId: Task['id']) => {
    setTasks(prevTasks => prevTasks.map(task => 
      task.id === taskId 
        ? { ...task, completed: true }
        : task
    ));
  };

  // 4. 添加归档函数
  const handleArchive = () => {
    setTasks(prev => prev.filter(task => task.status === 'active'));
    setShowStats(false);
  };

  useEffect(() => {
  }, [taskToFinish]);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6', padding: '20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div className="bg-white rounded-lg shadow-sm p-6">
          {/* 标题和模式切换 */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>
              マニアイ
            </h1>
            <div style={{ display: 'flex', gap: '8px', position: 'relative' }}>
              <button
                onClick={() => handleModeChange('maniai')}
                style={{
                  padding: '8px 16px',
                  borderRadius: '4px',
                  border: 'none',
                  backgroundColor: viewMode === 'maniai' ? '#3b82f6' : '#e5e7eb',
                  color: viewMode === 'maniai' ? 'white' : '#374151',
                  cursor: 'pointer'
                }}
              >
                主タスク
              </button>
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => handleModeChange('sidetask')}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '4px',
                    border: 'none',
                    backgroundColor: viewMode === 'sidetask' ? '#3b82f6' : '#e5e7eb',
                    color: viewMode === 'sidetask' ? 'white' : '#374151',
                    cursor: 'pointer'
                  }}
                >
                  タスク準備🍅
                </button>
                
                {/* 悬浮提示框 */}
                {showTooltip && viewMode === 'sidetask' && (
                  <div 
                    className={styles.taskPopup}
                    style={{
                      position: 'absolute',
                      top: '100%',
                      right: 0,
                      width: '280px',
                      backgroundColor: 'white',
                      padding: '12px',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
                      fontSize: '14px',
                      color: '#374151',
                      zIndex: 10,
                      cursor: 'pointer',
                    }}
                  >
                    準備タスクを設定することで、締切に向けて効率的にタスクを進められます。
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowTooltip(false);
                      }}
                      style={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        border: 'none',
                        background: 'none',
                        padding: '4px',
                        cursor: 'pointer',
                        color: '#9CA3AF',
                        fontSize: '12px'
                      }}
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 主任务输入（仅在时间管理模式显示） */}
          {viewMode === 'maniai' && (
            <div style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '8px',
              marginBottom: '20px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              <TaskInput 
                type="main"
                onSubmit={handleAddTask}
              />
            </div>
          )}

          {/* 内容区域 */}
          <div style={{
            display: 'flex',
            gap: '20px'
          }}>
            {/* 主任务列表 */}
            <div style={{ flex: 1 }}>
              {tasks.map(task => (
                <div
                  key={task.id}
                  onClick={() => {
                    setSelectedTaskId(task.id);
                  }}
                  style={{
                    backgroundColor: 'white',
                    padding: '20px',
                    borderRadius: '8px',
                    marginBottom: '16px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    cursor: 'pointer',
                    border: selectedTaskId === task.id ? '2px solid #3b82f6' : '2px solid transparent'
                  }}
                >
                  <div style={{ fontWeight: 'bold' }}>{task.title}</div>
                  <div style={{ fontSize: '14px', color: '#666', marginTop: '4px' }}>
                    期限: {task.deadline.toLocaleString('ja-JP')}
                  </div>

                  {/* 时间进度条 */}
                  <TimeBar 
                    task={task} 
                    activeTaskInfo={
                      activeTaskInfo?.taskId === task.id 
                        ? { 
                            sideTaskId: activeTaskInfo.sideTaskId, 
                            progress: activeTaskInfo.progress 
                          } 
                        : null
                    }
                  />
                  
                  {/* 根据模式显示不同内容 */}
                  {viewMode === 'maniai' ? (
                    <Timeline 
                      sideTasks={task.sideTasks}
                      remainingTime={task.remainingTime}
                      activeTaskId={activeTaskInfo?.taskId === task.id ? activeTaskInfo.sideTaskId : undefined}
                      activeTaskProgress={activeTaskInfo?.taskId === task.id ? activeTaskInfo.progress : 0}
                    />
                  ) : (
                    <div style={{ 
                      fontSize: '14px', 
                      color: '#666', 
                      marginTop: '8px',
                      display: 'flex',
                      gap: '8px'
                    }}>
                      <span>🍅 {task.sideTasks.length}個</span>
                      <span>•</span>
                      <span>完了: {task.sideTasks.filter(st => st.completed).length}個</span>
                    </div>
                  )}

                  {/* 修改按钮层级结构 */}
                  <div className="mt-4 flex justify-end gap-4">
                    <div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setTaskToFinish(task.id);
                        }}
                        style={{
                          padding: '8px 16px',
                          backgroundColor: '#dbeafe',
                          color: '#5D90F0',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          border: 'none'
                        }}
                      >
                        完了
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTaskAbandon(task.id);
                        }}
                        style={{
                          padding: '8px 16px',
                          backgroundColor: '#f3f4f6',  // 浅灰色背景
                          color: '#6b7280',           // 灰色文字
                          borderRadius: '6px',
                          cursor: 'pointer',
                          border: 'none'
                        }}
                      >
                        放棄
                      </button>
                    </div>
                    
                    {taskToFinish === task.id && (
                      <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTaskCompletion(task.id, TaskCompletionStatus.NOT_IN_TIME);
                          }}
                          style={{
                            padding: '8px 16px',
                            backgroundColor: '#fee2e2',  // 红色背景
                            color: '#dc2626',           // 红色文字
                            borderRadius: '6px',
                            cursor: 'pointer',
                            border: 'none'
                          }}
                        >
                          間に合わない
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTaskCompletion(task.id, TaskCompletionStatus.JUST_IN_TIME);
                          }}
                          style={{
                            padding: '8px 16px',
                            backgroundColor: '#fef9c3',  // 黄色背景
                            color: '#ca8a04',           // 黄色文字
                            borderRadius: '6px',
                            cursor: 'pointer',
                            border: 'none'
                          }}
                        >
                          ギリギリ
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTaskCompletion(task.id, TaskCompletionStatus.WITH_SPARE);
                          }}
                          style={{
                            padding: '8px 16px',
                            backgroundColor: '#dcfce7',  // 绿色背景
                            color: '#16a34a',           // 绿色文字
                            borderRadius: '6px',
                            cursor: 'pointer',
                            border: 'none'
                          }}
                        >
                          余裕がある
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* 空状态提示 */}
              {tasks.length === 0 && (
                <div style={{
                  backgroundColor: 'white',
                  padding: '40px 20px',
                  borderRadius: '8px',
                  textAlign: 'center',
                  color: '#666'
                }}>
                  タスクはまだありません
                </div>
              )}
            </div>

            {/* 子任务管理面板（仅在番茄钟模式且选中任务时显示） */}
            {viewMode === 'sidetask' && selectedTaskId && (
              <div style={{
                width: '400px',
                backgroundColor: 'white',
                padding: '20px',
                borderRadius: '8px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                alignSelf: 'flex-start',
                position: 'sticky',
                top: '20px'
              }}>
                <TaskManager
                  taskId={selectedTaskId}
                  sideTasks={tasks.find(t => t.id === selectedTaskId)?.sideTasks || []}
                  onAddSideTask={handleAddSideTask}
                  onCompleteSideTask={handleCompleteSideTask}
                  onReorderSideTasks={handleReorderSideTasks}
                  onDeleteSideTask={handleDeleteSideTask}
                  onActiveTaskUpdate={handleActiveTaskUpdate}
                  onActiveTaskComplete={handleActiveTaskComplete}
                />
              </div>
            )}
          </div>
        </div>

        {/* 统计图表 */}
        {showStats && (
          <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
            <h2 className="text-xl font-bold">完了タスクの統計</h2>
            <CompletionChart completionRecords={completionRecords} />
            
            {/* 只保留这一个按钮 */}
            <div className="flex justify-center mt-4">
              <button 
                onClick={handleArchive}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
              >
                タスクを整理する
              </button>
            </div>
          </div>
        )}

        {/* 关闭按钮 */}
        <button 
          onClick={handleArchive}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          title="閉じる"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default App