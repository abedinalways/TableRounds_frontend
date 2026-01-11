import { StatisticsBase } from './StatisticsBase';

export default function InternStatistics() {
  return (
    <StatisticsBase
      title="Intern"
      total={10}
      correct={9}
      icon="/images/dashboard/statistics/statistics.png"
    />
  );
}
