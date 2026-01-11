import QuestionsIcon from "../reusable/icons/QuestionsIcon";
import TopicsIcon from "../reusable/icons/TopicsIcon";


type StatsCardsProps = {
  totalQuestions: number;
  totalTopics: number;
};

export default function StatsCard({
  totalQuestions,
  totalTopics,
}: StatsCardsProps) {
  return (
    <div className="flex flex-wrap gap-6 mb-6">
      <div className="background text-white rounded-[16px] p-6 w-[415px] flex gap-4 justify-between">
        <div>
          <p className="text-sm md:text-[20px] font-semibold leading-[120%]">
            Total Questions Created
          </p>
          <h2 className="text-2xl md:text-[36px] leading-[120%] font-bold">
            {totalQuestions}
          </h2>
         
        </div>
        <div className="stats-card-bg  w-12 h-12 rounded-xl flex items-center justify-center">
          <QuestionsIcon />
        </div>
      </div>

      <div className="background text-white rounded-[16px] w-[415px] p-6  flex gap-4 justify-between">
        <div>
          <p className="text-sm md:text-[20px] font-semibold leading-[120%]">
            Total Topics
          </p>
          <h2 className="text-2xl md:text-[36px] leading-[120%] font-bold">
            {totalTopics}
          </h2>
          
        </div>
        <div className="stats-card-bg  w-12 h-12 rounded-xl flex items-center justify-center">
          <TopicsIcon />
        </div>
      </div>
    </div>
  );
}
