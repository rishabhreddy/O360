
import React, { useState, useEffect } from "react";
import { 
  Select,
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { getMarkets } from "@/services/mockData";

export interface FilterBarProps {
  onFilterChange: (filters: {
    status?: string;
    matchCategory?: string;
    market?: string;
    searchTerm?: string;
  }) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ onFilterChange }) => {
  const [status, setStatus] = useState<string>("");
  const [matchCategory, setMatchCategory] = useState<string>("");
  const [market, setMarket] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [markets, setMarkets] = useState<{ id: string; name: string }[]>([]);
  
  useEffect(() => {
    const loadMarkets = async () => {
      try {
        const marketsData = await getMarkets();
        setMarkets(marketsData);
      } catch (error) {
        console.error("Error loading markets:", error);
      }
    };
    
    loadMarkets();
  }, []);
  
  const handleFilterChange = () => {
    onFilterChange({
      status: status || undefined,
      matchCategory: matchCategory || undefined,
      market: market || undefined,
      searchTerm: searchTerm || undefined,
    });
  };
  
  const handleReset = () => {
    setStatus("");
    setMatchCategory("");
    setMarket("");
    setSearchTerm("");
    onFilterChange({});
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-6">
      <div className="flex flex-1 items-center relative">
        <Search className="absolute left-2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by outlet name or address..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-8"
          onKeyPress={(e) => e.key === "Enter" && handleFilterChange()}
        />
      </div>
      
      <Select value={status} onValueChange={setStatus}>
        <SelectTrigger className="w-full sm:w-[160px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="all-statuses">All Statuses</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Approved">Approved</SelectItem>
            <SelectItem value="Rejected">Rejected</SelectItem>
            <SelectItem value="Flagged">Flagged</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      
      <Select value={matchCategory} onValueChange={setMatchCategory}>
        <SelectTrigger className="w-full sm:w-[160px]">
          <SelectValue placeholder="Confidence" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="all-confidence">All Confidence</SelectItem>
            <SelectItem value="High">High Confidence</SelectItem>
            <SelectItem value="Medium">Medium Confidence</SelectItem>
            <SelectItem value="Low">Low Confidence</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      
      <Select value={market} onValueChange={setMarket}>
        <SelectTrigger className="w-full sm:w-[160px]">
          <SelectValue placeholder="Market" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="all-markets">All Markets</SelectItem>
            {markets.map((m) => (
              <SelectItem key={m.id} value={m.id}>
                {m.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      
      <div className="flex gap-2">
        <Button onClick={handleFilterChange} className="w-full sm:w-auto">
          Apply Filters
        </Button>
        <Button variant="outline" onClick={handleReset} className="w-full sm:w-auto">
          Reset
        </Button>
      </div>
    </div>
  );
};

export default FilterBar;
