
import React from "react";
import { Badge } from "@/components/ui/badge";
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Suggestion } from "@/services/mockData";
import { formatPercentage } from "@/utils/formatters";
import { TrendingUp, TrendingDown, BarChart } from "lucide-react";

interface SalesContributionPanelProps {
  suggestion: Suggestion;
}

const SalesContributionPanel: React.FC<SalesContributionPanelProps> = ({
  suggestion
}) => {
  if (!suggestion.salesContribution) {
    return null;
  }

  const { value, volume, rank, isHighValue } = suggestion.salesContribution;

  // Format the value for display
  const formatValue = (val: number) => {
    if (val >= 1000000) {
      return `$${(val / 1000000).toFixed(2)}M`;
    } else if (val >= 1000) {
      return `$${(val / 1000).toFixed(2)}K`;
    }
    return `$${val.toFixed(2)}`;
  };

  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-md font-medium flex items-center">
          <BarChart className="mr-2 h-5 w-5" />
          Sales Contribution
          {isHighValue && (
            <Badge className="ml-2 bg-amber-100 text-amber-800 border border-amber-300">
              High Value Outlet
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-muted rounded-md p-3">
            <p className="text-xs text-muted-foreground mb-1">Sales Value</p>
            <div className="flex items-center">
              <p className="text-lg font-semibold">{formatValue(value)}</p>
              <TrendingUp className="ml-2 h-4 w-4 text-green-600" />
            </div>
          </div>
          
          <div className="bg-muted rounded-md p-3">
            <p className="text-xs text-muted-foreground mb-1">Sales Volume</p>
            <p className="text-lg font-semibold">{volume.toLocaleString()}</p>
          </div>
          
          <div className="bg-muted rounded-md p-3">
            <p className="text-xs text-muted-foreground mb-1">Market Rank</p>
            <div className="flex items-center">
              <p className="text-lg font-semibold">#{rank}</p>
              <Badge className={`ml-2 ${rank <= 10 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                {rank <= 10 ? 'Top 10' : `Top ${Math.ceil(rank/10)*10}`}
              </Badge>
            </div>
          </div>
        </div>
        
        <div className="mt-3">
          <div className="h-2 w-full bg-gray-200 rounded-full mt-2">
            <div
              className={`h-2 rounded-full bg-blue-500`}
              style={{ width: `${Math.max(100 - rank, 5)}%` }}
            ></div>
          </div>
          <div className="flex justify-between mt-1 text-xs text-muted-foreground">
            <span>Higher Contribution</span>
            <span>Lower Contribution</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SalesContributionPanel;
