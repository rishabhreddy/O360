
import React, { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox"; // Add this import
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Check, Flag, Search, X, BarChart, Map } from "lucide-react";
import { Suggestion } from "@/services/mockData";
import {
  formatDate,
  formatDistance,
  formatPercentage,
  getConfidenceColor,
  getDQScoreColor,
  getStatusColor,
} from "@/utils/formatters";
import SalesContributionPanel from "./SalesContributionPanel";
import MapVisualization from "./MapVisualization";
import OutletMapPanel from "./OutletMapPanel";

interface SuggestionCardProps {
  suggestion: Suggestion;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onFlag: (id: string) => void;
  onResuggest: (id: string) => void;
  onAddComment: (id: string) => void;
  isProcessing?: boolean;
  isSelected?: boolean;
  onSelect?: (id: string, selected: boolean) => void;
}

const SuggestionCard: React.FC<SuggestionCardProps> = ({
  suggestion,
  onApprove,
  onReject,
  onFlag,
  onResuggest,
  onAddComment,
  isProcessing = false,
  isSelected = false,
  onSelect,
}) => {
  const [showExtendedInfo, setShowExtendedInfo] = useState(false);

  return (
    <Card className="mb-4 border-l-4" style={{ 
      borderLeftColor: suggestion.matchCategory === "High" 
        ? "hsl(142.1, 76.2%, 36.3%)" 
        : suggestion.matchCategory === "Medium" 
          ? "hsl(35.5, 91.7%, 32.9%)" 
          : "hsl(0, 84.2%, 60.2%)" 
    }}>
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          {onSelect && (
            <Checkbox
              checked={isSelected}
              onCheckedChange={(checked) => onSelect(suggestion.id, !!checked)}
              aria-label={`Select ${suggestion.sourceName}`}
            />
          )}
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold">{suggestion.sourceName}</h3>
              <Badge className={getStatusColor(suggestion.status)}>
                {suggestion.status}
              </Badge>
              {suggestion.salesContribution?.isHighValue && (
                <Badge className="bg-amber-100 text-amber-800 border border-amber-300">
                  High Value
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{suggestion.sourceAddress}</p>
          </div>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge className={getConfidenceColor(suggestion.matchCategory)}>
                {suggestion.matchCategory} Confidence ({formatPercentage(suggestion.matchScore)})
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p>Match score: {formatPercentage(suggestion.matchScore)}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
          <div>
            <h4 className="text-md font-medium mb-1">Source Information</h4>
            <p className="text-sm mb-1">Name: <span className="font-medium">{suggestion.sourceName}</span></p>
            <p className="text-sm">Address: {suggestion.sourceAddress}</p>
          </div>
          <div>
            <h4 className="text-md font-medium mb-1">Suggested Match</h4>
            <p className="text-sm mb-1">Name: <span className="font-medium">{suggestion.suggestedOutletName}</span></p>
            <p className="text-sm">Address: {suggestion.suggestedAddress}</p>
          </div>
        </div>

        <div className="mt-4">
          <h4 className="text-md font-medium mb-2">Data Quality Metrics</h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div className="bg-muted rounded-md p-2">
              <p className="text-xs text-muted-foreground mb-1">Semantic Similarity</p>
              <div className="h-2 w-full bg-gray-200 rounded-full">
                <div
                  className={`h-2 rounded-full ${getDQScoreColor(suggestion.dqMetrics.semanticSimilarityScore)}`}
                  style={{ width: `${suggestion.dqMetrics.semanticSimilarityScore * 100}%` }}
                ></div>
              </div>
              <span className="text-xs font-medium">{formatPercentage(suggestion.dqMetrics.semanticSimilarityScore)}</span>
            </div>
            
            <div className="bg-muted rounded-md p-2">
              <p className="text-xs text-muted-foreground mb-1">Geographic Distance</p>
              <span className="text-xs font-medium">{formatDistance(suggestion.geoDistance)}</span>
            </div>
            
            <div className="bg-muted rounded-md p-2">
              <p className="text-xs text-muted-foreground mb-1">Pattern Consistency</p>
              <div className="h-2 w-full bg-gray-200 rounded-full">
                <div
                  className={`h-2 rounded-full ${getDQScoreColor(suggestion.dqMetrics.patternConsistencyIndex)}`}
                  style={{ width: `${suggestion.dqMetrics.patternConsistencyIndex * 100}%` }}
                ></div>
              </div>
              <span className="text-xs font-medium">{formatPercentage(suggestion.dqMetrics.patternConsistencyIndex)}</span>
            </div>
            
            <div className="bg-muted rounded-md p-2">
              <p className="text-xs text-muted-foreground mb-1">Overall DQ Score</p>
              <div className="h-2 w-full bg-gray-200 rounded-full">
                <div
                  className={`h-2 rounded-full ${getDQScoreColor(suggestion.dqMetrics.overallDqScore)}`}
                  style={{ width: `${suggestion.dqMetrics.overallDqScore * 100}%` }}
                ></div>
              </div>
              <span className="text-xs font-medium">{formatPercentage(suggestion.dqMetrics.overallDqScore)}</span>
            </div>
          </div>
        </div>
        
        {suggestion.revenueShare && (
          <div className="mt-4 bg-muted p-4 rounded-lg">
            <h4 className="text-md font-medium mb-2">Revenue Share Information</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Share Percentage</p>
                <p className="text-lg font-semibold">{suggestion.revenueShare.percentage.toFixed(1)}%</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Monthly Average</p>
                <p className="text-lg font-semibold">${suggestion.revenueShare.monthlyAverage.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Yearly Total</p>
                <p className="text-lg font-semibold">${suggestion.revenueShare.yearlyTotal.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Trend</p>
                <div className="flex items-center">
                  {suggestion.revenueShare.trend === "up" && (
                    <Badge className="bg-green-100 text-green-800">Increasing</Badge>
                  )}
                  {suggestion.revenueShare.trend === "down" && (
                    <Badge className="bg-red-100 text-red-800">Decreasing</Badge>
                  )}
                  {suggestion.revenueShare.trend === "stable" && (
                    <Badge className="bg-blue-100 text-blue-800">Stable</Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end mt-4">
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex gap-2 items-center"
            onClick={() => setShowExtendedInfo(!showExtendedInfo)}
          >
            {showExtendedInfo ? "Hide Details" : "Show More Details"}
            {showExtendedInfo ? 
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-up"><path d="m18 15-6-6-6 6"/></svg> : 
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-down"><path d="m6 9 6 6 6-6"/></svg>
            }
          </Button>
        </div>
        
        {showExtendedInfo && (
          <div className="mt-2">
            {suggestion.geoLocation && (
              <OutletMapPanel
                sourceCoords={[suggestion.geoLocation.sourceLatitude, suggestion.geoLocation.sourceLongitude]}
                suggestedCoords={[suggestion.geoLocation.suggestedLatitude, suggestion.geoLocation.suggestedLongitude]}
                outletData={{
                  sourceName: suggestion.sourceName,
                  sourceAddress: suggestion.sourceAddress,
                  suggestedName: suggestion.suggestedOutletName,
                  suggestedAddress: suggestion.suggestedAddress,
                }}
              />
            )}
            
            {suggestion.salesContribution && (
              <SalesContributionPanel suggestion={suggestion} />
            )}
          </div>
        )}

        {suggestion.comments && suggestion.comments.length > 0 && (
          <div className="mt-4 bg-muted p-3 rounded-md">
            <h4 className="text-sm font-medium mb-1">Comments</h4>
            {suggestion.comments.map((comment) => (
              <div key={comment.id} className="mb-2 last:mb-0">
                <p className="text-xs text-muted-foreground">
                  {comment.createdBy} - {formatDate(comment.createdAt)}
                  {comment.reasonCode && (
                    <Badge className="ml-2 text-xs" variant="outline">
                      {comment.reasonCode}
                    </Badge>
                  )}
                </p>
                <p className="text-sm">{comment.text}</p>
              </div>
            ))}
          </div>
        )}

        <div className="mt-3 text-xs text-muted-foreground">
          <p>Created: {formatDate(suggestion.createdAt)}</p>
          {suggestion.lastUpdatedBy && (
            <p>Last updated: {formatDate(suggestion.lastUpdatedAt)} by {suggestion.lastUpdatedBy}</p>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-0 flex flex-wrap gap-2">
        <Button
          size="sm"
          variant="outline"
          className="border-green-500 hover:bg-green-50 text-green-700"
          onClick={() => onApprove(suggestion.id)}
          disabled={isProcessing || suggestion.status === "Approved"}
        >
          <Check className="mr-1 h-4 w-4" />
          Approve
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="border-red-500 hover:bg-red-50 text-red-700"
          onClick={() => onReject(suggestion.id)}
          disabled={isProcessing || suggestion.status === "Rejected"}
        >
          <X className="mr-1 h-4 w-4" />
          Reject
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="border-amber-500 hover:bg-amber-50 text-amber-700"
          onClick={() => onFlag(suggestion.id)}
          disabled={isProcessing || suggestion.status === "Flagged"}
        >
          <Flag className="mr-1 h-4 w-4" />
          Flag for Review
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => onResuggest(suggestion.id)}
          disabled={isProcessing}
        >
          <Search className="mr-1 h-4 w-4" />
          Re-suggest
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => onAddComment(suggestion.id)}
          disabled={isProcessing}
        >
          Add Comment
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SuggestionCard;
