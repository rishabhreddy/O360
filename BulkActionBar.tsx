
import React from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { BadgeCheck, BadgeX, Flag } from "lucide-react";

interface BulkActionBarProps {
  selectedIds: string[];
  onApproveSelected: () => void;
  onRejectSelected: () => void;
  onFlagSelected: () => void;
  onSelectAll: (checked: boolean) => void;
  totalItems: number;
}

const BulkActionBar = ({
  selectedIds,
  onApproveSelected,
  onRejectSelected,
  onFlagSelected,
  onSelectAll,
  totalItems,
}: BulkActionBarProps) => {
  return (
    <div className="flex items-center gap-4 p-4 bg-muted rounded-lg mb-4">
      <div className="flex items-center gap-2">
        <Checkbox
          checked={selectedIds.length === totalItems && totalItems > 0}
          onCheckedChange={(checked) => onSelectAll(!!checked)}
          aria-label="Select all"
        />
        <span className="text-sm text-muted-foreground">
          {selectedIds.length} selected
        </span>
      </div>
      
      <div className="flex gap-2">
        <Button
          size="sm"
          variant="outline"
          className="border-green-500 hover:bg-green-50 text-green-700"
          onClick={onApproveSelected}
          disabled={selectedIds.length === 0}
        >
          <BadgeCheck className="mr-1 h-4 w-4" />
          Approve Selected
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="border-red-500 hover:bg-red-50 text-red-700"
          onClick={onRejectSelected}
          disabled={selectedIds.length === 0}
        >
          <BadgeX className="mr-1 h-4 w-4" />
          Reject Selected
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="border-amber-500 hover:bg-amber-50 text-amber-700"
          onClick={onFlagSelected}
          disabled={selectedIds.length === 0}
        >
          <Flag className="mr-1 h-4 w-4" />
          Flag Selected
        </Button>
      </div>
    </div>
  );
};

export default BulkActionBar;
