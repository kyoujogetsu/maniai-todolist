import React, { useState, useEffect } from 'react';
import TaskManager from './components/TaskManager/TaskManager';
// ... 其他 imports ...

const App = () => {
  // ... 其他代码 ...

  return (
    <div className="min-h-screen bg-gray-100 p-2 md:p-5">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl mb-4 text-red-500">布局测试</h1>
        <div className="flex flex-col md:flex-row w-full gap-5">
          {/* 主任务列表 */}
          <div className="w-full">
            {tasks.map(task => (
              <div 
                key={task.id}
                className={`bg-white p-3 md:p-5 rounded-lg mb-3 shadow-sm ${
                  selectedTaskId === task.id ? 'border-2 border-blue-500' : 'border-2 border-transparent'
                }`}
              >
                {/* 任务内容 */}
              </div>
            ))}
          </div>

          {/* 子任务管理面板 */}
          {viewMode === 'sidetask' && selectedTaskId && (
            <div className="w-full md:w-[400px] bg-white p-5 rounded-lg shadow-sm mt-4 md:mt-0">
              {showTooltip && (
                <div className="w-full p-2">
                  準備タスクを設定することで、締切に向けて効率的にタスクを進められます。
                </div>
              )}
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
    </div>
  );
};

export default App;
