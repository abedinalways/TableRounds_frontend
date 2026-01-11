import { StatisticsBase } from './StatisticsBase';

export default function BoardsStatistics() {
  return (
    <StatisticsBase
      title="Boards"
      total={10}
      correct={2}
      icon="/images/dashboard/statistics/statistics.png"
    />
  );
}
