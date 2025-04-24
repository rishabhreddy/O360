
import { LayoutGrid, Table } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface ViewToggleProps {
  view: "cards" | "table";
  onViewChange: (view: "cards" | "table") => void;
}

const ViewToggle = ({ view, onViewChange }: ViewToggleProps) => {
  return (
    <ToggleGroup type="single" value={view} onValueChange={(value) => value && onViewChange(value as "cards" | "table")}>
      <ToggleGroupItem value="cards" aria-label="Cards view">
        <LayoutGrid className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="table" aria-label="Table view">
        <Table className="h-4 w-4" />
      </ToggleGroupItem>
    </ToggleGroup>
  );
};

export default ViewToggle;
