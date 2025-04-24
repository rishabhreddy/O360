
import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartLine, ChartBar, TrendingUp, Users } from "lucide-react";
import { formatPercentage } from "@/utils/formatters";

interface StatsOverviewProps {
  totalSuggestions: number;
  approvedPercentage: number;
  averageMatchScore: number;
  activeReviewers: number;
}

const StatsOverview: React.FC<StatsOverviewProps> = ({
  totalSuggestions,
  approvedPercentage,
  averageMatchScore,
  activeReviewers,
}) => {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Suggestions</CardTitle>
          <ChartBar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalSuggestions}</div>
          <p className="text-xs text-muted-foreground">
            Pending review and validation
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Approval Rate</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatPercentage(approvedPercentage)}</div>
          <p className="text-xs text-muted-foreground">
            Of reviewed suggestions
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg Match Score</CardTitle>
          <ChartLine className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatPercentage(averageMatchScore)}</div>
          <p className="text-xs text-muted-foreground">
            Overall match confidence
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Reviewers</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeReviewers}</div>
          <p className="text-xs text-muted-foreground">
            Contributing this week
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsOverview;
