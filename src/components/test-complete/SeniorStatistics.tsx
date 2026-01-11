import { StatisticsBase } from './StatisticsBase';

export default function SeniorStatistics() {
  return (
    <StatisticsBase
      title="Senior"
      total={10}
      correct={4}
      icon="/images/dashboard/statistics/statistics.png"
    />
  );
}
