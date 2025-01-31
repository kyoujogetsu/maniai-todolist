import React, { useState, useEffect } from 'react';
import TaskManager from './components/TaskManager/TaskManager';
// ... 其他 imports ...

const App = () => {
  // ... 其他代码 ...

  return (
    <div className="min-h-screen bg-gray-100 p-2 md:p-5">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl mb-4 text-red-500">布局测试</h1>
        {/* 使用 grid 布局强制单列 */}
        <div className="grid grid-cols-1 gap-4">
          {/* 主任务列表 */}
          <div className="w-full">
            {tasks.map(task => (
              <div 
                key={task.id}
                className={`
                  w-full
                  bg-white 
                  p-3 md:p-5 
                  rounded-lg 
                  mb-3 
                  shadow-sm
                  relative
                  ${selectedTaskId === task.id ? 'border-2 border-blue-500' : 'border-2 border-transparent'}
                `}
              >
                {/* 任务内容 */}
              </div>
            ))}
          </div>

          {/* 子任务管理面板 */}
          {viewMode === 'sidetask' && selectedTaskId && (
            <div className="w-full bg-white p-5 rounded-lg shadow-sm relative">
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
