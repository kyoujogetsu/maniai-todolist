import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { CompletionRecord, TaskCompletionStatus } from '../../types/todo';

interface CompletionChartProps {
  completionRecords: CompletionRecord[];
}

export const CompletionChart = ({ completionRecords }: CompletionChartProps) => {
  console.log('图表组件收到的记录:', completionRecords);
  
  // 如果没有完成记录，不显示图表
  if (!completionRecords || completionRecords.length === 0) {
    return null;
  }

  // 有完成记录时，显示统计图表
  const stats = completionRecords.reduce((acc, record) => {
    acc[record.completionStatus] = (acc[record.completionStatus] || 0) + 1;
    return acc;
  }, {} as Record<TaskCompletionStatus, number>);

  const chartData = [
    {
      name: '間に合わない',
      value: stats[TaskCompletionStatus.NOT_IN_TIME] || 0,
      fill: '#D23733'
    },
    {
      name: 'ギリギリ',
      value: stats[TaskCompletionStatus.JUST_IN_TIME] || 0,
      fill: '#E6DB36'
    },
    {
      name: '余裕がある',
      value: stats[TaskCompletionStatus.WITH_SPARE] || 0,
      fill: '#4BF474'
    }
  ];

  return (
    <div>
      <BarChart
        width={800}
        height={400}
        data={chartData}
        margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis label={{ value: '完了回数', angle: -90, position: 'insideLeft' }} />
        <Tooltip />
        <Bar 
          dataKey="value" 
          fill={(entry) => entry.fill}  // 使用数据中定义的颜色
        />
      </BarChart>
    </div>
  );
};
