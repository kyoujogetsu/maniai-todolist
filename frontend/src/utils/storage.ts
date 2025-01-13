import { TaskCompletionStatus } from '../types/todo';

// 定义存储键名
const STORAGE_KEYS = {
  COMPLETION_RECORDS: 'taskCompletionRecords'
} as const;

// 定义完成记录类型（与 todo.ts 中保持一致）
export interface CompletionRecord {
  taskId: number;
  completionStatus: TaskCompletionStatus;  // 改为与 todo.ts 一致的属性名
  completedAt: string;  // 存储时用字符串，因为 Date 对象不能直接序列化
}

// 存储完成记录
export const saveCompletionRecord = (record: Omit<CompletionRecord, 'completedAt'> & { completedAt: Date }): void => {
  const records = getCompletionRecords();
  records.push({
    ...record,
    completedAt: record.completedAt.toISOString()  // 将 Date 转换为字符串
  });
  localStorage.setItem(STORAGE_KEYS.COMPLETION_RECORDS, JSON.stringify(records));
};

// 获取所有完成记录
export const getCompletionRecords = (): (Omit<CompletionRecord, 'completedAt'> & { completedAt: Date })[] => {
  const records = localStorage.getItem(STORAGE_KEYS.COMPLETION_RECORDS);
  return records 
    ? JSON.parse(records).map((record: CompletionRecord) => ({
        ...record,
        completedAt: new Date(record.completedAt)  // 将字符串转回 Date
      }))
    : [];
};
