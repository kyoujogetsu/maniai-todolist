// 子任务（番茄钟任务）
export interface SideTask {
  id: number;
  title: string;
  pomodoroCount: number;     // 番茄钟数量（1个 = 5分钟）
  completed: boolean;        // 完成状态
}

// 主任务
export interface Task {
  id: number;
  title: string;
  deadline: Date;           // 截止时间
  remainingTime: number;    // 剩余时间（分钟）
  sideTasks: SideTask[];    // 子任务列表
}

// 视图模式
export type ViewMode = 'maniai' | 'sidetask';
