export interface CoverageStats {
    totalPosts: number;
    coveredPosts: number;
    totalAgents: number;
    activeAgents: number;
}

export interface RankCount {
    rankName: string;
    count: number;
}

export interface WeeklyTrend {
    date: string;
    assignmentCount: number;
}
