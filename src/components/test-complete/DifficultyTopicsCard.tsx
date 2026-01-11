import InternStatistics from './InternStatistics';
import SeniorStatistics from './SeniorStatistics';
import BoardsStatistics from './BoardsStatistics';

export default function DifficultyTopicsCard() {
  return (
    <div className="grid grid-cols-12 gap-8">
      <div className="lg:col-span-4 col-span-full">
        <InternStatistics />
      </div>

      <div className="lg:col-span-4 col-span-full">
        <SeniorStatistics />
      </div>

      <div className="lg:col-span-4 col-span-full">
        <BoardsStatistics />
      </div>
    </div>
  );
}
