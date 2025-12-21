export interface Stat {
  id: string;
  title: string;
  value: string;
  subtitle: string;
  icon: string;
}

export interface LeaderboardItem {
  rank: number;
  name: string;
  institution: string;
  tests: number;
  accuracy: number;
  avgScore: number;
  trend?: number[];
}


export interface LeaderboardData {
  stats: Stat[];
  leaderboard: LeaderboardItem[];
}
