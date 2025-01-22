// 语言设置
export const LANGUAGES = [
  { id: 'ja', nativeName: '日本語' },
  { id: 'zh', nativeName: '中文' },
  { id: 'en', nativeName: 'English' }
] as const;
export type Language = typeof LANGUAGES[number]['id'];

// 用户语言设置
export interface LanguageSettings {
  currentLanguage: Language;
  defaultLanguage: Language;
}

// 子任务（番茄钟任务）
export interface SideTask {
  id: number;
  title: string;
  pomodoroCount: number;     // 番茄钟数量 / ポモドーロ数 / Pomodoro count
  completed: boolean;        // 完成状态 / 完了状態 / Completion status
}

// 子任务
export interface SubTask {
  id: number;
  title: string;
  completed: boolean;
  taskId: number;           // 关联任务ID / 関連タスクID / Related task ID
  status: 'pending' | 'completed';
  pomodoroCount: number;    // 番茄钟数量 / ポモドーロ数 / Pomodoro count
  estimatedTime?: number;   // 预计时间 / 予定時間 / Estimated time
  completedPomodoros: number; // 已完成番茄钟数 / 完了したポモドーロ数 / Completed pomodoros
}

// 主任务
export interface Task {
  id: number;
  title: string;
  deadline: Date;           // 截止时间 / 締切時間 / Deadline
  remainingTime: number;    // 剩余时间（分钟） / 残り時間（分） / Remaining time (min)
  sideTasks: SideTask[];    // 子任务列表 / サブタスク一覧 / Subtask list
  result?: TaskResult;
  completionStatus?: TaskCompletionStatus;
  status: 'active' | 'completed';  // 添加：任务状态
  completedAt?: Date;             // 添加：完成时间
}

// 新建任务
export interface NewTodo {
  title: string;
  text: string;
  language?: Language;      // 可选的语言设置 / 言語設定（オプション） / Optional language setting
  deadline?: Date;
  pomodoroCount?: number;
}

// 视图模式
export type ViewMode = 'maniai' | 'sidetask';

export enum TaskCompletionStatus {
  NOT_IN_TIME = '間に合わない',
  JUST_IN_TIME = 'ギリギリ',
  WITH_SPARE = '余裕がある'
}

export interface TaskResult {
  taskId: number;
  completionStatus: TaskCompletionStatus;
  completedAt: Date;
}

export interface CompletionRecord {
  taskId: number;
  completionStatus: TaskCompletionStatus;
  completedAt: Date;
}
