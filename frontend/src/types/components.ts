import type { Task, SideTask } from "./todo";

// 组件层次关系定义
// 组件层次关系定义
export interface ComponentHierarchy {
  App: {
    TimeBar: null;       // 时间管理视图的主要组件
    Timeline: null;      // 时间线视图组件
    TaskManager: {       // 任务管理组件（合并后的）
      TaskInput: null;   // 任务输入组件
      TaskList: null;    // 任务列表组件
    }
  }
}

// 组件间通信接口
export interface ComponentEvents {
  onTaskAdd: (task: Task) => void;
  onTaskUpdate: (taskId: number, updates: Partial<Task>) => void;
  onSideTaskAdd: (taskId: number, sideTask: Omit<SideTask, 'id'>) => void;
  onSideTaskUpdate: (taskId: number, sideTaskId: number, completed: boolean) => void;
} 