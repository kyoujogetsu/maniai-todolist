import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts';
import { CompletionRecord, TaskCompletionStatus } from '../../types/todo';

interface Props {
  completionRecords: CompletionRecord[];
  selectedStatus: TaskCompletionStatus | null;
}

export const CompletionChart: React.FC<Props> = ({ 
  completionRecords,
  selectedStatus
}) => {
  // 只取最近10次记录
  const recentRecords = completionRecords.slice(-10);

  // 统计每个状态的次数
  const statusCounts = {
    [TaskCompletionStatus.NOT_IN_TIME]: 0,  // 間に合わない
    [TaskCompletionStatus.JUST_IN_TIME]: 0, // ギリギリ
    [TaskCompletionStatus.WITH_SPARE]: 0    // 余裕がある
  };

  recentRecords.forEach(record => {
    statusCounts[record.completionStatus]++;
  });

  // 根据选中状态过滤数据
  const chartData = selectedStatus 
    ? [{
        status: selectedStatus,
        count: statusCounts[selectedStatus]
      }]
    : Object.entries(statusCounts).map(([status, count]) => ({
        status,
        count
      }));

  const chartColors = {
    [TaskCompletionStatus.NOT_IN_TIME]: '#F44336',  // 赤
    [TaskCompletionStatus.JUST_IN_TIME]: '#FFC107', // 黄
    [TaskCompletionStatus.WITH_SPARE]: '#4CAF50'    // 緑
  };

  return (
    <div style={{ width: '100%', height: 300 }}>
      <BarChart
        width={600}
        height={300}
        data={chartData}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="status" />
        <YAxis domain={[0, 10]} />
        <Tooltip />
        <Bar dataKey="count">
          {chartData.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={chartColors[entry.status as TaskCompletionStatus]} 
            />
          ))}
        </Bar>
      </BarChart>
    </div>
  );
};
