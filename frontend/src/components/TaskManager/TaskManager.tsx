// React 18+ 不需要显式导入 React
// 但为了兼容性考虑，保留这行注释
// import React from 'react'
import { useState } from 'react'
// React 18+ 不需要显式导入 React
// 但为了兼容性考虑，保留这行注释
// React 18+ 不需要显式导入 React
// 但为了兼容性考虑，保留这行注释
// // import React, { useState } from 'react'
import { DragDropContext, Droppable, Draggable, DropResult, DragStart } from 'react-beautiful-dnd'
import { TaskInput } from './TaskInput'
import { PomodoroTimer } from '../PomodoroTimer/PomodoroTimer'
import type { SideTask } from '../../types/todo'

interface TaskManagerProps {
  taskId: number;
  sideTasks: SideTask[];
  onAddSideTask: (taskId: number, title: string, pomodoroCount: number) => void;
  onCompleteSideTask: (taskId: number, sideTaskId: number) => void;
  onReorderSideTasks: (taskId: number, newSideTasks: SideTask[]) => void;
  onDeleteSideTask: (taskId: number, sideTaskId: number) => void;
  onActiveTaskUpdate?: (taskId: number, sideTaskId: number, progress: number) => void;
  onActiveTaskComplete?: () => void;
}

export function TaskManager({
  taskId,
  sideTasks,
  onAddSideTask,
  onCompleteSideTask,
  onReorderSideTasks,
  onDeleteSideTask,
  onActiveTaskUpdate,
  onActiveTaskComplete
}: TaskManagerProps) {
  const [activeTaskId, setActiveTaskId] = useState<number | null>(null)

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    
    const items = Array.from(sideTasks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    onReorderSideTasks(taskId, items);
  };
  const handleDragStart = (start: DragStart) => {
  };
  return (
    <div>
      <h3 style={{ 
        fontSize: '18px', 
        fontWeight: 'bold',
        marginBottom: '16px'
      }}>
        タスク準備🍅
      </h3>

      {activeTaskId && (
        <PomodoroTimer
          taskId={taskId}
          sideTask={sideTasks.find(t => t.id === activeTaskId)!}
          onComplete={(taskId, sideTaskId) => {
            onCompleteSideTask(taskId, sideTaskId);
            setActiveTaskId(null);
            onActiveTaskComplete?.();
          }}
          onProgressUpdate={(taskId, sideTaskId, progress) => {
            onActiveTaskUpdate?.(taskId, sideTaskId, progress);
          }}
        />
      )}

      <div style={{ marginBottom: '20px' }}>
        <TaskInput
          type="side"
          onSubmit={(title, _, pomodoroCount = 1) => 
            onAddSideTask(taskId, title, pomodoroCount)
          }
        />
      </div>

      <DragDropContext 
        onDragEnd={handleDragEnd}
        onDragStart={handleDragStart}
      >
        <Droppable droppableId={`task-list-${taskId}`}>
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={{
                backgroundColor: snapshot.isDraggingOver ? '#f3f4f6' : 'transparent',
                borderRadius: '8px',
                transition: 'background-color 0.2s ease',
                minHeight: '10px'
              }}
            >
              {sideTasks.map((task, index) => (
                <Draggable
                  key={task.id}
                  draggableId={`task-${task.id}`}
                  index={index}
                  isDragDisabled={task.completed || activeTaskId === task.id}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      style={{
                        ...provided.draggableProps.style,
                        marginBottom: '8px',
                        backgroundColor: snapshot.isDragging ? '#e5e7eb' : 'white',
                        borderRadius: '4px',
                        boxShadow: snapshot.isDragging 
                          ? '0 4px 6px -1px rgba(0,0,0,0.1)' 
                          : '0 1px 3px rgba(0,0,0,0.1)',
                        userSelect: 'none'
                      }}
                    >
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '12px',
                        gap: '12px'
                      }}>
                        <div
                          {...provided.dragHandleProps}
                          style={{
                            color: '#9ca3af',
                            cursor: 'grab',
                            width: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          ⋮⋮
                        </div>

                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={() => onCompleteSideTask(taskId, task.id)}
                        />

                        <div style={{ flex: 1 }}>
                          <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                          }}>
                            <span style={{
                              textDecoration: task.completed ? 'line-through' : 'none',
                              color: task.completed ? '#9ca3af' : 'inherit'
                            }}>
                              {task.title}
                            </span>
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px'
                            }}>
                              <span style={{
                                fontSize: '12px',
                                color: '#666',
                                backgroundColor: '#f8fafc',
                                padding: '2px 6px',
                                borderRadius: '4px'
                              }}>
                                {task.pomodoroCount} 🍅
                              </span>
                              
                              <div style={{
                                display: 'flex',
                                gap: '4px'
                              }}>
                                {!task.completed && activeTaskId !== task.id && (
                                  <button
                                    onClick={() => setActiveTaskId(task.id)}
                                    style={{
                                      padding: '4px 8px',
                                      borderRadius: '4px',
                                      border: 'none',
                                      backgroundColor: '#3b82f6',
                                      color: 'white',
                                      cursor: 'pointer',
                                      fontSize: '12px'
                                    }}
                                  >
                                    実行
                                  </button>
                                )}
                                
                                {activeTaskId !== task.id && (
                                  <button
                                    onClick={() => onDeleteSideTask(taskId, task.id)}
                                    style={{
                                      padding: '4px 8px',
                                      borderRadius: '4px',
                                      border: '1px solid #ef4444',
                                      backgroundColor: 'white',
                                      color: '#ef4444',
                                      cursor: 'pointer',
                                      fontSize: '12px'
                                    }}
                                  >
                                    削除
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  )
} 