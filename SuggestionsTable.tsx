import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, Flag, Search, X } from "lucide-react";
import { Suggestion } from "@/services/mockData";
import { formatDate, formatDistance, formatPercentage, getConfidenceColor, getStatusColor } from "@/utils/formatters";
import { Checkbox } from "@/components/ui/checkbox";

interface SuggestionsTableProps {
  suggestions: Suggestion[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onFlag: (id: string) => void;
  onResuggest: (id: string) => void;
  onAddComment: (id: string) => void;
  isProcessing?: boolean;
  selectedIds?: string[];
  onSelect?: (id: string, selected: boolean) => void;
}

const SuggestionsTable = ({
  suggestions,
  onApprove,
  onReject,
  onFlag,
  onResuggest,
  onAddComment,
  isProcessing = false,
  selectedIds = [],
  onSelect,
}: SuggestionsTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {onSelect && <TableHead className="w-[50px]">Select</TableHead>}
          <TableHead>Source Outlet</TableHead>
          <TableHead>Suggested Match</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Match Score</TableHead>
          <TableHead>Revenue Share</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {suggestions.map((suggestion) => (
          <TableRow key={suggestion.id}>
            {onSelect && (
              <TableCell>
                <Checkbox
                  checked={selectedIds.includes(suggestion.id)}
                  onCheckedChange={(checked) => onSelect(suggestion.id, !!checked)}
                />
              </TableCell>
            )}
            <TableCell>
              <div>
                <p className="font-medium">{suggestion.sourceName}</p>
                <p className="text-sm text-muted-foreground">{suggestion.sourceAddress}</p>
              </div>
            </TableCell>
            <TableCell>
              <div>
                <p className="font-medium">{suggestion.suggestedOutletName}</p>
                <p className="text-sm text-muted-foreground">{suggestion.suggestedAddress}</p>
              </div>
            </TableCell>
            <TableCell>
              <Badge className={getStatusColor(suggestion.status)}>
                {suggestion.status}
              </Badge>
            </TableCell>
            <TableCell>
              <Badge className={getConfidenceColor(suggestion.matchCategory)}>
                {formatPercentage(suggestion.matchScore)}
              </Badge>
            </TableCell>
            <TableCell>
              {suggestion.revenueShare && (
                <div className="flex flex-col gap-1">
                  <Badge className={`w-fit ${getConfidenceColor(suggestion.matchCategory)}`}>
                    {suggestion.revenueShare.percentage.toFixed(1)}%
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    ${suggestion.revenueShare.monthlyAverage.toLocaleString()}/mo
                  </span>
                </div>
              )}
            </TableCell>
            <TableCell>
              <div className="flex gap-1">
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 w-8 p-0"
                  onClick={() => onApprove(suggestion.id)}
                  disabled={isProcessing || suggestion.status === "Approved"}
                >
                  <Check className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 w-8 p-0"
                  onClick={() => onReject(suggestion.id)}
                  disabled={isProcessing || suggestion.status === "Rejected"}
                >
                  <X className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 w-8 p-0"
                  onClick={() => onFlag(suggestion.id)}
                  disabled={isProcessing || suggestion.status === "Flagged"}
                >
                  <Flag className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 w-8 p-0"
                  onClick={() => onResuggest(suggestion.id)}
                  disabled={isProcessing}
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default SuggestionsTable;
