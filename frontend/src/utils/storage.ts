// 如果不需要这个类型，可以删除导入
// import { TaskCompletionStatus } from '../types/todo';

// 定义存储键名
const STORAGE_KEYS = {
  COMPLETION_RECORDS: 'taskCompletionRecords'
} as const;

// 使用 types/todo.ts 中定义的 CompletionRecord 类型
import type { CompletionRecord } from '../types/todo';

// 存储完成记录
export function saveCompletionRecord(record: CompletionRecord): void {
  const records = getCompletionRecords();
  const recordToSave = {
    ...record,
    completedAt: record.completedAt.toISOString()  // 存储前转换为字符串
  };
  localStorage.setItem(STORAGE_KEYS.COMPLETION_RECORDS, JSON.stringify([...records, recordToSave]));
}

// 获取所有完成记录
export function getCompletionRecords(): CompletionRecord[] {
  const records = localStorage.getItem(STORAGE_KEYS.COMPLETION_RECORDS);
  if (!records) return [];
  
  return JSON.parse(records).map((record: any) => ({
    ...record,
    completedAt: new Date(record.completedAt)  // 将字符串转换为 Date 对象
  }));
}
